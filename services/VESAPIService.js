const Cache = require(`../services/cacheServices`);
const Auth = require(`../services/AuthService`);
const dotenv = require('dotenv');
const Vehicle = require(`../Class/Vehicle`);
const logger = require('../utils/logger');

let url = "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";

const getVehicleDataFromAPI = async (body) => {

        console.log('hit')
    try {
        const response = await fetch(url, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                'x-api-key': `${process.env.OPEN_DVLA_API}`
            },
            body: JSON.stringify(body)
        });
       // console.log(response.headers)

        if (!response.ok) {
            //console.log(response)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
       

        return data;

    } catch (error) {
        logger.error('Error fetching vehicle:', error);
    }
};


const driverData = (body)=>{
    //check if there is a logged token

    const token = Cache.getAccessToken();
    try {
        if(!token){
            Auth.motAPIAuthenticate();
        }
        url = url+`/vin/${vin}`;

        console.log(url)
        
    } catch (error) {
        console.error(error);
    }
}





module.exports = {getVehicleDataFromAPI};