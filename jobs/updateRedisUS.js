// local libraries
const redis = require('../src/redis');

module.exports = async (params) => {
    let { startDateString, endDateString } = params;
    if(startDateString == undefined || endDateString == undefined) throw '[updateRedis] Unable to run job, startDateString & endDateString must be specified!';

    await redis.batchWriteUS(startDateString, endDateString);
};