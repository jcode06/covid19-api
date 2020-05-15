const router = require('express').Router();

router.get('/states/all',           require('./handlerGetStatesAll') );
router.get('/states/:dateString',   require('./handlerGetStates') );
router.get('/state/:state',         require('./handlerGetState') );

module.exports = router;