const aws = require('../src/aws');

const moment = require('moment-timezone');
// set the default timezone to UTC
moment.tz.setDefault('UTC');

const handlerError = require('./handlerError');
const handlerGetStates = async (req, res) => {

    try {
        if(!req.params || !req.params.dateString) { 
            let message = 'dateString not provided';
            return handlerError(res, message, message, 501);
        }

        let dateString = req.params.dateString;
        let timestamp = moment(dateString, 'YYYYMMDD').valueOf();

        console.log(`dateString = ${dateString}`, `timestamp = ${timestamp}`);

        if(isNaN(timestamp) ) {
            let message = 'Not a valid dateString';
            return handlerError(res, message, message, 501);
        }

        let start = Date.now();
        let queryResponse = await aws.queryTimestamp(timestamp);
        let end = Date.now();

        console.log('queryTime', `${end - start}ms`, start, end);

        res.status(200).json(queryResponse);
    }
    catch(e) {
        console.log('Error', e );
        handlerError(res, 'Something went wrong, check the server', 'Something went wrong, check the server', 500);
    }
};

module.exports = handlerGetStates;