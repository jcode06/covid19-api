const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');

// get the routes for the application
const routes = require('./routes/routes.js');

const PORT = process.env.PORT || 8080

const app = express();

// Middleware declarations
app.use(helmet() );
app.use(compression() );
app.use(bodyParser.json() );

// Set the API Rate limit for a client
app.use( rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 300 // limit each IP to 300 reqs per windowMs
}) );

// Set up routes
app.use('/api', cors(), routes);
app.use('/', cors(), (req, res) => {
  res.status(500).json({ message: 'Command not found'});
});

// Get Server running
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
