// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Set the region 
const region = 'us-east-1';
AWS.config.update({
    region: 'us-east-1',
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"

});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let params = {
    AttributeDefinitions: [
      {
        AttributeName: 'regionCountry',
        AttributeType: 'S'
      },
      {
        AttributeName: 'timestamp',
        AttributeType: 'N'
      },
      {
        AttributeName: 'deathIncrease',
        AttributeType: 'N'
      },
      {
        AttributeName: 'hospitalizedIncrease',
        AttributeType: 'N'
      },
      {
        AttributeName: 'positiveIncrease',
        AttributeType: 'N'
      },
      {
        AttributeName: 'totalTestResults',
        AttributeType: 'N'
      },
      {
        AttributeName: 'totalTestResultsIncrease',
        AttributeType: 'N'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'regionCountry',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'timestamp',
        KeyType: 'RANGE'
      }
    ],
    GlobalSecondaryIndexes: [{
      IndexName: "timestamp-regionCountry-index",
      KeySchema: [
          {
              AttributeName: "timestamp",
              KeyType: "HASH"
          },
          {
              AttributeName: "regionCountry",
              KeyType: "RANGE"
          }
      ],
      Projection: {
          ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
          ReadCapacityUnits: 2,
          WriteCapacityUnits: 2
      }
    }],    
    LocalSecondaryIndexes: [
        {
            "IndexName": "regionCountry-deathIncrease-index",
            "KeySchema": [
                {
                    "AttributeName": "regionCountry",
                    "KeyType": "HASH"
                },
                {
                    "AttributeName": "deathIncrease",
                    "KeyType": "RANGE"
                }
            ],
            "Projection": {
                "ProjectionType": "KEYS_ONLY"
            }
        },
        {
            "IndexName": "regionCountry-hospitalizedIncrease-index",
            "KeySchema": [
                {
                    "AttributeName": "regionCountry",
                    "KeyType": "HASH"
                },
                {
                    "AttributeName": "hospitalizedIncrease",
                    "KeyType": "RANGE"
                }
            ],
            "Projection": {
                "ProjectionType": "KEYS_ONLY"
            }
        },
        {
            "IndexName": "regionCountry-positiveIncrease-index",
            "KeySchema": [
                {
                    "AttributeName": "regionCountry",
                    "KeyType": "HASH"
                },
                {
                    "AttributeName": "positiveIncrease",
                    "KeyType": "RANGE"
                }
            ],
            "Projection": {
                "ProjectionType": "KEYS_ONLY"
            }
        },
        {
            "IndexName": "regionCountry-totalTestResults-index",
            "KeySchema": [
                {
                    "AttributeName": "regionCountry",
                    "KeyType": "HASH"
                },
                {
                    "AttributeName": "totalTestResults",
                    "KeyType": "RANGE"
                }
            ],
            "Projection": {
                "ProjectionType": "KEYS_ONLY"
            }
        },
        {
            "IndexName": "regionCountry-totalTestResultsIncrease-index",
            "KeySchema": [
                {
                    "AttributeName": "regionCountry",
                    "KeyType": "HASH"
                },
                {
                    "AttributeName": "totalTestResultsIncrease",
                    "KeyType": "RANGE"
                }
            ],
            "Projection": {
                "ProjectionType": "KEYS_ONLY"
            }
        }
            
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 2,
      WriteCapacityUnits: 2
    },
    TableName: 'covidData',
    StreamSpecification: {
      StreamEnabled: false
    }
  };
  
  // Call DynamoDB to create the table
  ddb.createTable(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Created", data);
    }
  });