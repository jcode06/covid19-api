# A simple API I made for a COVID-19 personal project.

Stack:
- Heroku - API Host
- AWS DynamoDB - Data persistence layer
- Node
- Express

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


## Environment Variables
heroku config must be run for the following variables:
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY

AWS Account must be capable of read/write to DynamoDB


### Resources
[RESTFUL API on Heroku]
(https://devcenter.heroku.com/articles/mean-apps-restful-api)

[Using the Scheduler with NodeJS]
(http://www.modeo.co/blog/2015/1/8/heroku-scheduler-with-nodejs-tutorial)

[Connecting to DynamoDB from Heroku]
(https://stackoverflow.com/questions/37483221/can-i-use-dynamodb-through-heroku?noredirect=1&lq=1)
A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

### Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
