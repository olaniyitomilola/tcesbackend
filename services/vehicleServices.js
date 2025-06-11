const Cache = require(`../services/cacheServices`);
const Auth = require(`../services/AuthService`);
const dotenv = require('dotenv');
const Vehicle = require(`../Class/Vehicle`);
const logger = require('../utils/logger');



let url = "https://history.mot.api.gov.uk/v1/trade/vehicles";

const getVehicleFromAPI = async (regNumber) => {
    // Check if there is a logged token
    let token = await Cache.getAccessToken();

    try {
        if (!token) {
            await Auth.motAPIAuthenticate();
            token = await Cache.getAccessToken();
        }

        const apiUrl = `${url}/registration/${regNumber}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                "accept": "application/json",
                'Authorization': `Bearer ${token}`,
                'x-api-key': `${process.env.MOT_API_KEY}`
            }
        });

        if (!response.ok) {
            //console.log(response)
            throw new Error(`HTTP error! Status: ${response}`);
        }

        const data = await response.json();
        const type = `${data.primaryColour} ${data.make} ${data.model}`
        return {name: type, recall: data.hasOutstandingRecall == 'Yes'? 'Yes' : 'Unknown'};

    } catch (error) {
        logger.error('Error fetching vehicle:', error);
    }
};


const getAllVehicleFromAPIVin = (vin)=>{
    //check if there is a logged token

    const token = Cache.getAccessToken();
    try {
        if(!token){
            Auth.motAPIAuthenticate();
        }
        url = url+`/vin/${vin}`;

        logger.info(url)
        
    } catch (error) {
        logger.error(error);
    }
}





module.exports = {getVehicleFromAPI,getAllVehicleFromAPIVin};