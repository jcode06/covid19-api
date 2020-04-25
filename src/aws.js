const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2',
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});
const docClient = new AWS.DynamoDB.DocumentClient();

const batchWrite = async items => {
    if(!items || items.length <= 0) { throw '(batchWrite) No items for batchWrite!'; }
    if(items.length > 25) { throw '(batchWrite) Maximum of 25 items can be written!'; }

    let requestItems = items.map( entry => ({
        PutRequest: {
            Item: entry
        }
    }) );

    let params = { RequestItems: {
            'covidData': requestItems
        }
    };
    await docClient.batchWrite(params).promise();
    console.log('Items written to DynamoDB:', requestItems);
};

const query = async (hashKey, secondaryKey) => {
    if(!hashKey) { throw '(query) hashKey or secondaryKey is missing'; }

    return await docClient.query({
        TableName: 'covidData',
        KeyConditionExpression: '#hashkey = :hkey',
        ExpressionAttributeNames: { '#hashkey': 'regionCountry' },
        ExpressionAttributeValues: {
            ':hkey': hashKey
        }
    }).promise();
};

module.exports = {
    batchWrite,
    query
};