if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const moment = require('moment-timezone');
// set the default timezone to UTC
moment.tz.setDefault('UTC');

// redis related require's
const { promisify } = require('util');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(redisClient.get).bind(redisClient);
const keysAsync = promisify(redisClient.keys).bind(redisClient);


const handlerError = require('./handlerError');

const handlerGetStatesAll = async(req, res) => {
    let { columnNames, getAll } = req.query;
    
    if(getAll == undefined && columnNames == undefined ) { 
        console.log('queryString', req.query);
        handlerError(res, 'No columns specified', 'No columns specified', 500);
        return;
    }
    
    getAll = (getAll != undefined) ? true : false;
    // Limit columnNames to 10, otherwise just use getAll
    columnNames = (getAll) ? 
        null : 
        new Set(['regionCountry', 'state', 'timestamp', ...columnNames.split(',')] );
    console.log(columnNames);

    if(columnNames != undefined && columnNames.size > 10) { 
        handlerError(res, 'Limit for columns is 7', 'Limit for columns is 7', 500);
        return;
    }

    let start = Date.now();
    try {
        let keysList = await keysAsync('*');
        if(keysList == undefined) { 
            res.status(200).json({ Items: {}, Count: 0 });
            return; 
        }
        keysList = keysList.map(key => parseInt(key, 10) );


        // currently return 
        let starting = moment('20200122', 'YYYYMMDD');
        let ending = moment(moment().format('YYYYMMDD')).tz('UTC')
            .subtract(1, 'days');
            
        const NUMDAYS = ending.diff(starting, 'days');

        let count = 0;
        let data = {};
        for(let i=0; i < NUMDAYS; i++) {
            let timestamp = moment(starting.valueOf() )
                .add(i, 'days')
                .valueOf();
            if(!keysList.includes(timestamp)) { continue; }

            let response = await getAsync(timestamp);

            // if(response == undefined) { continue; }
            let dateString = moment(timestamp).format('YYYYMMDD');

//            console.log(dateString, response);

            data[dateString] = (getAll) ? JSON.parse(response) : 
                JSON.parse(response).map(row => {
                    let obj = {};
                    columnNames.forEach(column => obj[column] = row[column]);
                    return obj;
                });

            count += data[dateString].length;
        }
        let end = Date.now();
        console.log('queryTime', `${end - start}ms`, start, end);
    
        res.status(200).json({ Items: data, Count: count });
    }
    catch(e) {
        console.log('Error', e );
        handlerError(res, 'Something went wrong, check the server', 'Something went wrong, check the server', 500);
    }    
};

module.exports = handlerGetStatesAll;