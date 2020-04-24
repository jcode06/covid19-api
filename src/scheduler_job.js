const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-2',
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});
const docClient = new AWS.DynamoDB.DocumentClient();


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

const run = async (region) => {
    console.log( await query(region) );
};
run('AK-US');

