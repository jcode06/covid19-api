const axios = require('axios').default;
const moment = require('moment-timezone');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const getAll = async() => {
    // let url = 'https://api.covid19api.com/summary';

    let url = 'https://api.covid19api.com/all';
    let path = '../data/countriesAll.csv';
    let jsonPath = '../data/countriesAll.json';

    let response = await axios.get(url, { responseType: 'json'});

    let json = response.data;
    console.log(response.data);

    console.log('writing to ', jsonPath);
    await writeFile(jsonPath, JSON.stringify(json) );
    console.log('done writing to ', jsonPath);        
};

const getSummary = async() => {
    let url = 'https://api.covid19api.com/summary'

    let path = '../data/countriesSummary.csv';
    let jsonPath = '../data/countriesSummary.json';

    // let res = await axios.get(url, { responseType: 'json'});

//    let json = res.data;
// console.log(res.data);

    console.log('writing to ', jsonPath);
    await writeFile(jsonPath, JSON.stringify(json) );
    console.log('done writing to ', jsonPath);        
};
// getSummary();
getAll();