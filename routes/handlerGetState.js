const aws = require('../src/aws');

const moment = require('moment-timezone');
// set the default timezone to UTC
moment.tz.setDefault('UTC');

const handlerError = require('./handlerError');
const handlerGetState = async (req, res) => {
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
};

module.exports = handlerGetState;