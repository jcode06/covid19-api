// local libraries
const redis = require('../src/redis');

redis.batchWriteUS('20200512', '20200513');

// redis.get('US', '20200513', '20200515');

// 1) Normal request, no keys, 6.61s for +2400 records
redis.getUSAll().then(data => console.log(data) );

// 2) Normal request, with valid keys, 4.932s for +2400 records
// redis.getUSAll(['regionCountry', 'death']);

// 3) Normal request, with invalid keys, 3.371s for +2400 records
// redis.getUSAll(['regionCountry', 'death', 'blah']);

// 4) No smembers present (i.e. Redis got cleared recently)
// TODO
