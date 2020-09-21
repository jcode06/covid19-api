// const { default: Axios } = require('axios');
const axios = require('axios').default;

const handlerError = require('./handlerError');
const handlerGetGlobalAll = async (req, res) => {

  let url = 'https://api.covid19api.com/summary'
  
  try {
    let response = await axios.get(url, { responseType: 'json'});
    let json = response.data;
  
    res.status(200).json(json);
  }
  catch(e) {
    console.log('Error', e );
    handlerError(res, 'Something went wrong, check the server', 'Something went wrong, check the server', 500);
  }
};

module.exports = handlerGetGlobalAll;