const aws = require('./src/aws');
const dataReader = require('./src/dataReader');

/*
pastRecords - allows to only write the number of pastRecords specified, to avoid
excessive rewrites to DynamoDB
*/
const batchWriter = async (json, pastRecords) => {
    return Promise.all( Object.entries(json).map( async data => {
        let [ state, metadata ] = data;

        console.log(state, metadata.length);

        if(pastRecords && pastRecords <= 25) {
            let slice = metadata.slice(0, pastRecords);
            try {
                console.log('before', state, slice.length);
                await aws.batchWrite(slice);
            }
            catch(e) { 
                console.log('Error batch writing', e);
            }
            console.log('after', state, slice.length);
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
    }) );
};

const run = async () => {
    try {
       let json = await dataReader.fetchDailyJson();
        
        
        console.log('before batch write');
        // await batchWriter(json, 2);
        await batchWriter(json);
        console.log('after batch write');
    }
    catch(e) {
        console.log('Error (run)', e);
    }

};
run();