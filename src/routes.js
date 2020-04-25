const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');

// local libraries
const aws = require('./aws');
const dataReader = require('./dataReader');

// Generic error handler
const handlerError = (res, reason, message, code) => {
    console.log(`ERROR: ${reason}`);
    res.status(code || 500).json({'error': message});
};
  
router.get('/states/:dateString', async (req, res) => {

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
});

router.get('/state/:state', async (req, res) => {
    try {
        if(!req.params || !req.params.state) { 
            let message = 'Not a valid state, or state not provided';
            return handlerError(res, message, message, 501);
        }
        let state = req.params.state;

        let start = Date.now();
        let queryResponse = await aws.queryRegionCountry(`${state}-US`);
        console.log( Object.keys(queryResponse) );
        let end = Date.now();

        console.log('queryTime', `${end - start}ms`, start, end);

        res.status(200).json(queryResponse);
    }
    catch(e) {
      console.log('Error', e );
      handlerError(res, 'Something went wrong, check the server', 'Something went wrong, check the server', 500);
    }
});


module.exports = router;