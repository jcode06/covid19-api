const aws = require('./aws');
const dataReader = require('./dataReader');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/*
json - Dictionary of records, organized by state
pastRecords - allows to only write the number of pastRecords specified, to avoid
              excessive rewrites to DynamoDB
delay - A sleep introduced to prevent throttling of writes
*/
const batchWriter = async params => {
    let { 
        json, 
        pastRecords, 
        state,
        delay = 5000 
    } = params;
    if(!json) { throw 'No json provided'; }

    let list = [], flatList = [];
    let transactions = [];
    const length = 25;
    
    // flatten the list first, and then we'll simply iterate in batches
    if(state) {
        flatList = json[state];
        if(!flatList) { throw `No records for ${state}`; }
    }
    else {
        list = Object.entries(json);
        flatList = list.flatMap(el => (!pastRecords || pastRecords <= 0) ? el[1] : el[1].slice(0, pastRecords) );
    }

    // organize the flat list into a list of 25 transactions
    for(let i = 0; i < flatList.length; i+=length) {
        let slice = flatList.slice(i, i*1+length);
        console.log(i, i*1+length);
        transactions.push(slice);
    }

    let transactStart, transactEnd;

    // write the transactions to AWS
    for(let i=0; i < transactions.length; i++) {
    // for(let i=0; i < 3; i++) {
        let transaction = transactions[i];
        let first = transaction[0].regionCountry;
        let last = transaction[transaction.length - 1].regionCountry;

        console.log('');
        console.log(`Writing ${first} to ${last}`);
        transactStart = Date.now();

        try {
            // adding a delay to prevent throttling of writes due to insufficient WCUs/sec
            await sleep(delay);
            let unprocessedItems = await aws.batchWrite(transaction);
        }
        catch(e) { 
            console.log('Error batch writing', e);
            console.log('Unprocessed Items', unprocessedItems);
        }

        console.log(`Completed writing ${first} to ${last}`);
        transactEnd = Date.now();
        console.log(`Transaction Time: ${transactEnd - transactStart}ms`);
    }
    return transactions;
};

module.exports = batchWriter;