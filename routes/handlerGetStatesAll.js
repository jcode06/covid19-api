if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const moment = require('moment-timezone');
// set the default timezone to UTC
moment.tz.setDefault('UTC');

// redis related require's
const redis = require('../src/redis');


const handlerError = require('./handlerError');

const handlerGetStatesAll = async(req, res) => {
    let { columnNames, getAll, format } = req.query;

    switch(format) {
        case 'state': format = 'state'; break;
        case 'timestamp': 
        default: format = 'timestamp'; break;
    }

    if(getAll == undefined && columnNames == undefined ) { 
        console.log('queryString', req.query);
        handlerError(res, 'No columns specified', 'No columns specified', 500);
        return;
    }
    
    getAll = (getAll != undefined) ? true : false;
    // Limit columnNames to 10, otherwise just use getAll
    columnNames = (getAll) ? 
        null : 
        [...columnNames.split(',')];

    if(columnNames != undefined && columnNames.length > 7) { 
        handlerError(res, 'Limit for columns is 7', 'Limit for columns is 7', 500);
        return;
    }

    let start = Date.now();
    try {
        let response = await redis.getUSAll(columnNames);

        let start = Date.now(); 
        // sort by timestamp, then state
        response = response.sort( (item1, item2) => {
            if(item1.timestamp < item2.timestamp) { return -1; }
            else if(item1.timestamp > item2.timestamp) { return 1; }

            // timestamp is equal, compare state names
            if(item1.state < item2.state) { return -1; }
            else if(item1.state > item2.state) { return 1; }
            return 0;
        });

        let statesData = {};
        for(let i=0; i < response.length; i++) {
            let row = response[i];

            if(statesData[row[format]] == undefined) { statesData[row[format]] = []; }
            statesData[row[format]].push(row);
        }
        let end = Date.now(); 
        console.log(`${(end - start)/1000}s to transform`);

        res.status(200).json({ Items: statesData, Count: response.length });
    }
    catch(e) {
        console.log('Error', e );
        handlerError(res, 'Something went wrong, check the server', 'Something went wrong, check the server', 500);
    }    
};

module.exports = handlerGetStatesAll;