const express = require('express');
const router = express.Router();
const fs = require('fs');

// wrap readFile in a promise
const util = require('util');
const readFile = util.promisify(fs.readFile);

// Generic error handler
const handlerError = (res, reason, message, code) => {
    console.log(`ERROR: ${reason}`);
    res.status(code || 500).json({'error': message});
  };
  

router.get('/states', async (req, res) => {

    try {
        let fileRes = await readFile('./data/states.json', 'utf-8');
        res.status(200).json(JSON.parse(fileRes) );
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

        let fileRes = await readFile('./data/states.json', 'utf-8');
        let data = JSON.parse(fileRes);

        let stateKeys = Object.keys(data);
        if(!stateKeys.includes(state)) { 
            let message = 'State not found, check the state abbreviation supplied';
            return handlerError(res, message, message, 501);
        }

        res.status(200).json(data[state]);
    }
    catch(e) {
      console.log('Error', e );
      handlerError(res, 'Something went wrong, check the server', 'Something went wrong, check the server', 500);
    }
});

module.exports = router;