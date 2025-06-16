const NodeCache = require('node-cache');
const logger = require('../utils/logger');


const tokenCache = new NodeCache({stdTTL: 3500});

const getAccessToken=()=>{
    logger.info('getting acccess token')
   return tokenCache.get(`access_token`);
}

const setAccessToken =(token)=>{
    logger.info('setting access token:', token)
    tokenCache.set('access_token',token);
}

module.exports = {getAccessToken,setAccessToken}