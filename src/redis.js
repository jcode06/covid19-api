if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '../.env'});
}

// IO Redis Client
const IORedis = require('ioredis');
const ioredis = new IORedis(process.env.REDIS_URL);
const { Timer } = require('./helper');

const moment = require('moment-timezone');

// set the default timezone to UTC
moment.tz.setDefault('UTC');

const aws = require('./aws');


// This helper map function creates hset commands for each item in an array
const mapHsetCommands = item => {
    let { country, state, timestamp} = item;

    return Object.entries(item).reduce( (acc, cur) => {
        acc.push(cur[0], cur[1]);
        return acc;
        }, ['hset', `${country}:${state}:${timestamp}`]);

};

const reducerSaddCommands =  (acc, item) => {
    acc.push(`${item.country}:${item.state}:${item.timestamp}`);
    return acc;
};

const formatItem = (key, item) => (isNaN(item) || key === 'dateString') ? item : parseInt(data[i]);

const mapTransformGetResponse = keys => item => {
    let [err, data] = item;

    // for hgetall requests, there should be no keys
    if(keys == undefined || keys.length <= 0) { return data; }
    
    // if keys are provided (i.e. hget request), we will get the data in an unmapped fashion
    // we have to perform the mapping ourselves
    let obj = {};
    for(let i=0; i < data.length; i++) {
        if(data[i] == undefined) { continue; }
        // obj[keys[i]] = formatItem(keys[i], data[i]);
        // obj[keys[i]] = (isNaN(data[i]) || keys[i] === 'dateString') ? data[i] : parseInt(data[i]);
        obj[keys[i]] = data[i];
    }
    return obj;
};

const getHashesForDateRange = async (country='US', startDateString, endDateString) => {
    let starting = moment(startDateString, 'YYYYMMDD');
    let ending = moment(endDateString, 'YYYYMMDD');
    const NUMDAYS = ending.diff(starting, 'days');

    let smembersCommands = [];

    for(let i=0; i < NUMDAYS; i++) {
        let newDate = moment(starting.valueOf() ).add(i, 'days');
        let timestamp = newDate.valueOf();
        let dateString = newDate.format('YYYYMMDD');

        smembersCommands.push(['smembers', `${country}:${timestamp}`]);
    }

    let smembersStart = Date.now();
    let smembersResponse = await ioredis.pipeline(smembersCommands).exec();
    let smembersEnd = Date.now();

    console.log(`${(smembersEnd - smembersStart)/1000}s - Redis Pipeline smembers Execution`);
    return smembersResponse.map( mapTransformGetResponse() ).flat();
};


/*
Test:
1) Normal request, no keys
2) Normal request, with valid keys
3) Normal request, with invalid keys
4) No smembers present (i.e. Redis got cleared recently)
*/
const getUSAll = async(keys) => {
    let startDateString = '20200122';
    let endDateString = moment().tz('UTC').subtract(1, 'days').format('YYYYMMDD')

    return await get('US', startDateString, endDateString, keys);
};

const get = async(country='US', startDateString, endDateString, keys) => {
    // A minimum set of keys
    if(keys != undefined && keys.length > 0) {
        keys = [...(new Set(['regionCountry', 'country', 'state', 'timestamp', ...keys]).keys() )];
    }
    let redisTimer = new Timer();

    try {
        let smembers = await getHashesForDateRange(country, startDateString, endDateString);

        hmgetCommands = (keys == undefined || !Array.isArray(keys) || keys.length <= 0) ? 
        smembers.map(hash => ['hgetall', hash]) :
        smembers.map(hash => ['hmget', hash, ...keys]);
    
        redisTimer.start();
        let redisResponse = await ioredis.pipeline(hmgetCommands).exec();
        redisTimer.end();        
    
        let data = redisResponse.map( mapTransformGetResponse(keys) );

        console.log(`${redisTimer.seconds}s - Redis Pipeline hmget Execution`);

        return data;
    }
    catch(e) {
        console.log('[getUS] Error querying Redis: ', e);
        return [];
    }
};


const batchWriteUS = async (startDateString, endDateString) => {
    let starting = moment(startDateString, 'YYYYMMDD');
    let ending = moment(endDateString, 'YYYYMMDD');
    
    const NUMDAYS = ending.diff(starting, 'days');

    const opTimer = new Timer();
    const redisTimer = new Timer();
    opTimer.start();

    let commands = [];

    try {
        // Make a Redis pipeline request once for each day's worth of data
        for(let i=0; i <= NUMDAYS; i++) {
            let timestamp = moment(starting.valueOf() )
                .add(i, 'days')
                .valueOf();
            let awsTimer = new Timer();
        
            awsTimer.start();
            let queryResponse = await aws.queryTimestamp(timestamp);
            awsTimer.end();

            let hsetCommands = queryResponse.Items.map(mapHsetCommands);
            let saddCommands = queryResponse.Items.reduce(reducerSaddCommands, ['sadd', `US:${timestamp}`])

            hsetCommands.push(saddCommands);
            commands.push(hsetCommands);

            console.log( moment(timestamp).format('YYYYMMDD'), `US:${timestamp}` );
            console.log(`${awsTimer.seconds}s - AWS DynamoDB Query`);
            console.log('');
        }
        commands = commands.flat();
        
        redisTimer.start();
        let redisResponse = await ioredis.pipeline(commands).exec();
        redisTimer.end();
        console.log(`${redisTimer.seconds}s - Redis Pipeline hset/sadd Execution`);
    }
    catch(e) {
        console.log('Error: ', e);
    }        
    opTimer.end();
    console.log('-----');
    console.log(`${opTimer.seconds}s - Total Operation Time`);
    console.log('');
};

module.exports = {
    getUSAll,
    get,
    batchWriteUS
};