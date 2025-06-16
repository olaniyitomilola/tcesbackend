const axios = require('axios');
const qs = require('qs');
const cache = require(`../services/cacheServices`)
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

const tokenUrl = process.env.TOKEN_URL 
const scope = 'https://tapi.dvsa.gov.uk/.default';

const motdata = qs.stringify({
  grant_type: 'client_credentials',
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  scope: scope
})

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

const motAPIAuthenticate = async ()=>{
 logger.info('auth info', motdata)
 console.log('auth info', motdata)
 await axios.post(tokenUrl, motdata, { headers })
  .then(response => {
    cache.setAccessToken(response.data.access_token)
    console.log(`access token cached`);
    return true;

  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });

}


module.exports = {motAPIAuthenticate}