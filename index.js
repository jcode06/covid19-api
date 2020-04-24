const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');


// get the routes for the application
const routes = require('./src/routes.js');

const PORT = process.env.PORT || 8080

const app = express();
app.use(bodyParser.json() );

app.use('/api', cors(), routes);
app.use('/', cors(), (req, res) => {
  res.status(418).json({ message: 'Command not found'});
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
