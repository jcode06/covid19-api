const batchWriter = require('../src/batchWriter');
const dataReader = require('../src/dataReader');


const run = async () => {
    let startFetch, startWrite, endWrite;
    try {
        startFetch = Date.now();

        // Get data from API or Cached File
        let json = await dataReader.fetchDailyJson();
        // await dataReader.writeFile('./data/states.json', JSON.stringify(json));
        
        // let fileRes = await dataReader.readFile('./data/states.json', 'utf-8');
        // let json = JSON.parse(fileRes);
        
        startWrite = Date.now();
        console.log('before batch write');
        let transactions = await batchWriter({ json, state: 'WA' });
        console.log('after batch write');
        endWrite = Date.now();

        console.log('');
        console.log(`Fetch: ${startWrite - startFetch}ms (${(startWrite - startFetch)/1000}s) elapsed`);
        console.log(`Write: ${endWrite - startWrite}ms (${(endWrite - startWrite)/1000}s) elapsed`);
        console.log(`Total transactions written: ${transactions.length}`);
        
        dataReader.writeFile('./data/transactions.json', JSON.stringify(transactions) );
    }
    catch(e) {
        console.log('Error (run)', e);
    }

};
run();