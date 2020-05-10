const axios = require('axios').default;

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const moment = require('moment-timezone');

// set the default timezone to UTC
moment.tz.setDefault('UTC');


const formatRow = (state, country) => row => {
    let {
        date,

        // totals
        totalTestResults=0,
        pending=0,
        positive=0,
        negative=0,
        death=0,
        recovered=0,
        hospitalizedCurrently=0,
        inIcuCurrently=0,
        onVentilatorCurrently=0,

        // Cumulative stats
        hospitalizedCumulative=0,
        inIcuCumulative=0,
        onVentilatorCumulative=0,

        // daily data
        totalTestResultsIncrease=0,
        positiveIncrease=0,
        negativeIncrease=0,
        deathIncrease=0,
        hospitalizedIncrease=0
    } = row;

    date = date + '';
    const dateTimestamp = moment(date).valueOf();
    // const dateTimestamp = Date.parse(`${date.substring(0, 4)}/${date.substring(4, 6)}/${date.substring(6, 8)}`);

    const primaryKey = `${state}-${country}`;

    return {
        regionCountry: primaryKey,
        timestamp: dateTimestamp,
        dateString: date,

        state,
        country,

        // totals
        totalTestResults: totalTestResults || 0,
        pending: pending || 0,
        positive: positive || 0,
        negative: negative || 0,
        death: death || 0,
        recovered: recovered || 0,
        hospitalizedCurrently: hospitalizedCurrently || 0,
        inIcuCurrently: inIcuCurrently || 0,
        onVentilatorCurrently: onVentilatorCurrently || 0,

        hospitalizedCumulative: hospitalizedCumulative || 0,
        inIcuCumulative: inIcuCumulative || 0,
        onVentilatorCumulative: onVentilatorCumulative || 0,


        // daily data
        totalTestResultsIncrease: totalTestResultsIncrease || 0,
        positiveIncrease: positiveIncrease || 0,
        negativeIncrease: negativeIncrease || 0,
        deathIncrease: deathIncrease || 0,
        hospitalizedIncrease: hospitalizedIncrease || 0
    };
};

const fetchDailyJson = async () => {
    let res = await axios.get('https://covidtracking.com/api/v1/states/daily.json', { responseType: 'json'});
    let json = res.data;

    // await writeFile('./data/daily.json', JSON.stringify(json) );

    return json.reduce( (acc, data, index) => {
        if(!data) { return acc; }
        if(!acc[data.state]) { acc[data.state] = []; }

        acc[data.state].push(formatRow(data.state, 'US')(data));
        return acc;
    }, {});
};

module.exports = {
    readFile,
    writeFile,
    fetchDailyJson
};