const aws = require('./aws');
const dataReader = require('./dataReader');


/*
pastRecords - allows to only write the number of pastRecords specified, to avoid
excessive rewrites to DynamoDB
*/
const batchWriter = (json, pastRecords) => {
    Object.entries(json).forEach( async data => {
        let [ state, metadata ] = data;

        console.log(state, metadata.length);

        if(pastRecords && pastRecords <= 25) {
            let slice = metadata.slice(0, pastRecords);
            try {
                await aws.batchWrite(slice);
            }
            catch(e) { 
                console.log('Error batch writing', e);
            }
            console.log(state, slice.length);
        }
        else {
            let index = 0;
            // loop through the complete set and write in batches of 25
            while(index < metadata.length) {
                let slice = metadata.slice(index, index*1+25);
                try {
                    await aws.batchWrite(slice);
                }
                catch(e) { 
                    console.log('Error batch writing', e);
                }
    
                console.log(state, index, slice.length);
                index += 25;
            }
        }
    });
};

const run = async () => {
    try {
        let json = await dataReader.fetchDailyJson();

        // console.log(json);

        batchWriter(json, 2);
        // batchWriter(json);
    }
    catch(e) {
        console.log('Error (run)', e);
    }

};
run();

