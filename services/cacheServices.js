const NodeCache = require('node-cache');

const tokenCache = new NodeCache({stdTTL: 3500});

const getAccessToken=()=>{
   return tokenCache.get(`access_token`);
}

const setAccessToken =(token)=>{
    tokenCache.set('access_token',token);
}

module.exports = {getAccessToken,setAccessToken}