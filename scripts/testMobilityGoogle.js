const axios = require('axios').default;
const moment = require('moment-timezone');
const papa = require('papaparse');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const run = async() => {
    let url = 'https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv?cachebust=d09f7f6f428c6783';
    let path = '../data/test.csv';
    let jsonPath = '../data/mobilityGoogle.json';

    let start = Date.now();

    try {
        // console.log('getting mobility data from ', url);
        // let res = await axios(url);
        // console.log(res.data);
        // console.log(Object.keys(res.data) );

        // console.log('writing to ', path);
        // await writeFile('path', JSON.stringify(res.data) );
        // console.log('done writing to ', path);        


        console.log('getting mobility data from ', path);
        let res = await readFile(path, 'utf-8');

        // response comes back in a single string, arrange it by each line
        let data = res.split('\\r\\n');

        // Get and clean up columns (sometimes there's a double quote in a column)
        let columns = data[0].split(',');
        columns = columns.map(col => (col.replace('"', '')) );

        console.log(columns);
        // console.log(data[1].split(','));

        data = data.reduce( (acc, row) => {
            let dataCols = row.split(',');
            // console.log(dataCols);

            if(dataCols == undefined) { return acc; }
            // For US, keep the state data 
            // (dataCols[2] will not be empty, but dataCols[3] will)
            else {
            // else if(dataCols[0] == 'US') {
                if(dataCols[3] != undefined && dataCols[3].length > 0) { return acc; }
            }
            // // For all other nations, just keep the country only data
            // else if(dataCols == undefined ||  
            //     (dataCols[2] != undefined && dataCols[2].length > 0) ||
            //     (dataCols[3] != undefined && dataCols[3].length > 0) ) { 
            //     return acc;
            // }
            acc.push(row);

            return acc;
        }, []);

        // console.log(data.length);
        // return;

    //    let json = data.slice(1).map( (row, index) => {
    //         // console.log(row);

    //         let obj = {};
    //         let dataCols = row.split(',');
    //         // console.log(dataCols);

    //         for(let i=0; i < dataCols.length; i++) {
    //             obj[columns[i]] = dataCols[i];
    //         }
    //         return obj;
    //     });

       let json = data.slice(1).reduce( (acc, row) => {
            // console.log(row);

            let dataCols = row.split(',');
            // console.log(dataCols);

            if(acc[dataCols[0]] == undefined) { 
                // For US, break down further by state
                // if(dataCols[0] == 'US') {
                //     acc[dataCols[0]] = {}; 
                // }
                // else {
                //     acc[dataCols[0]] = []; 
                // }
                acc[dataCols[0]] = {}; 
            }

            let obj = {};
            for(let i=0; i < dataCols.length; i++) {
                obj[columns[i]] = dataCols[i];
            }

            console.log(dataCols[0], dataCols[2]);

            // if(dataCols[0] == 'US') {
                if(dataCols[2] == undefined || dataCols[2].trim().length <= 0) {
                    if(acc[dataCols[0]]['All'] == undefined) {
                        acc[dataCols[0]]['All'] = [];
                    }
                    acc[dataCols[0]]['All'].push(obj);
                }
                else {
                    if(acc[dataCols[0]][dataCols[2]] == undefined) {
                        acc[dataCols[0]][dataCols[2]] = [];
                    }
                    acc[dataCols[0]][dataCols[2]].push(obj);
                }
            // }
            // else {
                // acc[dataCols[0]].push(obj);
            // }

            return acc;
        }, {});


        // console.log(json);
        console.log(Object.entries(json)[0] );
        console.log(Object.entries(json).length );
        
        console.log('writing to ', jsonPath);
        await writeFile(jsonPath, JSON.stringify(json) );
        console.log('done writing to ', jsonPath);        



    }
    catch(e) {
        console.log('Error', e);
    }
    

    
    let end = Date.now();
    console.log(`${(end - start) / 1000}s total execution time`);
};
run();

// console.log(Object.keys(papa));