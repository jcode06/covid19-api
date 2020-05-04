const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// wrap readFile in a promise
const util = require('util');
const readFile = util.promisify(fs.readFile);


const PORT = process.env.PORT || 8080

const app = express();
app.use(bodyParser.json() );

// temp, delete this once API is up and running
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

// Generic error handler
const handlerError = (res, reason, message, code) => {
  console.log(`ERROR: ${reason}`);
  res.status(code || 500).json({'error': message});
};

app.use(cors() );
app.get('/api/states/data', async (req, res) => {

  try {
    let fileRes = await readFile('data/states.json', 'utf-8');

    console.log(fileRes);  
    res.status(200).json(JSON.parse(fileRes) );
  }
  catch(e) {
    console.log('Error', Object.entries(e) );
    handlerError(res, 'Something went wrong, check the server', 'Something went wrong, check the server', 500);
  }
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
