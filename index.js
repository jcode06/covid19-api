const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');


// get the routes for the application
const routes = require('./routes/routes.js');

const PORT = process.env.PORT || 8080

const app = express();
app.use(bodyParser.json() );
app.use( rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 300 // limit each IP to 500 reqs per windowMs
}) );

app.use('/api', cors(), routes);
app.use('/', cors(), (req, res) => {
  res.status(418).json({ message: 'Command not found'});
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
