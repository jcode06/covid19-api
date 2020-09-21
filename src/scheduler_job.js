const moment = require('moment');
const { Timer } = require('./helper.js');
const { updateDailyUS, updateRedisUS } = require('../jobs');

// will use later, but not now
const jobs = [
    {
        name: 'updateDailyUS', 
        job: updateDailyUS,
        async: true,
        interval: 4 // every 4 hours
    },
/*    
    {
        name: 'updateRedisUS', 
        job: updateRedisUS,
        async: true,
        interval: 12 // every 12 hours
    }
*/
]

// scheduler_job is built to run every hour on Heroku
const run = async () => {

    let now = moment().tz('America/Los_Angeles');
    let hours = now.format('k');
    let numJobs = 0;

    console.log('');
    console.log(`Current Date/Time: ${now.format('M/DD/YYYY hh:mm:ss A')}`)

    let totalTimer = new Timer();
    totalTimer.start();

    console.log('Starting to run any jobs present...');
    console.log('=====');
    try {
        // Run these jobs every 4 hours
        if(hours % 4 === 0) { 
            console.log('');
            console.log('Starting updateDailyUS...');

            let jobTimer = new Timer();
            jobTimer.start();
            await updateDailyUS({ pastRecords: 3, delay: 5000 });
            jobTimer.end();
            console.log(`${jobTimer.seconds}s updateDailyUS execution time`);
            numJobs++;
        }

        // Run these jobs every 12 hours
        if(hours % 12 === 0) {
            console.log('');
            console.log('Starting updateRedisUS...');

            let jobTimer = new Timer();
            jobTimer.start();

            // do the previous three days
            let currentUTC = moment().tz('UTC');
            let endDateString       = currentUTC.subtract(1, 'days').format('YYYYMMDD');
            let startDateString     = currentUTC.subtract(2, 'days').format('YYYYMMDD');
            await updateRedisUS({ startDateString, endDateString });

            jobTimer.end();
            console.log(`${jobTimer.seconds}s updateRedisUS execution time`);
            numJobs++;
        }
    }
    catch(e) {
        console.log('There was an error running the job', e);
    }

    totalTimer.end();
    console.log('=====');
    console.log(`${totalTimer.seconds}s Total execution time`);
    console.log(`Total Jobs run: ${numJobs}`);
    console.log('');
};
run();
