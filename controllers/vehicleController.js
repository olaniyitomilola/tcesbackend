const { Vehicle } = require("../Class/Vehicle");
const vehicleService = require(`../services/vehicleServices`);
const vesAPIService = require(`../services/VESAPIService`)
const crypto = require('crypto');

const { fetchVehicles, insertVehicle, fetchVehiclebyReg, vanIssues, fixVanIssue,createVanIssue } = require("../config/dbops");
//helper to fix new vans without mot expiry
function addYearsAndGetLastDay(ymString, yearsToAdd) {
    // Split into numeric year and month
    const [year, month] = ymString.split('-').map(Number);
    
    // JS Date: new Date(year, monthIndex+1, 0) → day “0” of next month is last day of given month
    // month from string is 1-based (e.g. "09" → 9), so passing month directly works
    const resultDate = new Date(year + yearsToAdd, month, 0);
  
    // Format back to "YYYY-MM-DD"
    const yyyy = resultDate.getFullYear();
    const mm   = String(resultDate.getMonth() + 1).padStart(2, '0');
    const dd   = String(resultDate.getDate()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd}`;
  }

const getVanWithReg = async (req,res,next)=>{
    try{
        const bod = {registrationNumber : req.params.registration}
        const vanMot = await vehicleService.getVehicleFromAPI(req.params.registration);
        const vanDeets = await vesAPIService.getVehicleDataFromAPI(bod)

        if(!vanMot || !vanDeets){
            res.status(404).json({body: `not found`})
        }

       
    
        const vehicle = new Vehicle(`${vanMot.name} ${vanDeets.yearOfManufacture}`, vanDeets.fuelType, vanDeets.motStatus == `No details held by DVLA`? 'Valid': vanDeets.motStatus, vanDeets.taxStatus, vanDeets.taxDueDate, vanDeets.motExpiryDate? vanDeets.motExpiryDate : addYearsAndGetLastDay(vanDeets.monthOfFirstRegistration,3) , vanDeets.registrationNumber, vanMot.recall)
        // }

        res.json(vehicle);
    } catch(error){
        next(error);
    }
}


const getVanWithVin = async (req,res,next)=>{
    try{
        const vanMot = await vehicleService.getAllVehicleFromAPIVin(req.id);

        res.json(vanMot);
    } catch(error){
        next(error);
    }
}

const getAllVehicles = async (req,res,next)=>{
    try {
        const vehicle = await fetchVehicles();
        console.log(`get all vehicles`)
        res.status(200).json(vehicle)
    } catch (error) {
        next(error)
    }
}

const addNewVehicle = async (req,res,next)=>{
    try {
        const van = req.body;

        console.log(van)

        //check if van is already in db.

        const vehicle = await fetchVehiclebyReg(van.registration);
        if(vehicle.length){
            res.status(403).json({message: `${van.registration} has already been added`}
                
            )
        }else{
            insertVehicle(van)
            console.log(`${van.name} successfully added to DB`)
            res.status(201).json({body: 'new vehicle added successfully'})
        }
      

    } catch (error) {
        next(error)
    }
}

const getVehicleByReg = async (req,res,next)=>{
    const reg = req.params.registration;
    try {
        const response = await fetchVehiclebyReg(reg.trim().toUpperCase());

        res.status(200).json(response);
        
    } catch (error) {
        console.error(error)
    }


}

const removeVehicle = async (req,res,next)=>{
    const id = req.params.reg
    //check if exists

    
    const vehicle = await fetchVehiclebyReg(id);
    if(vehicle.length){
        res.status(403).json({message: `${van.registration} has already been added`}
            
        )
    }else{
        insertVehicle(van)
        console.log(`${van.name} successfully added to DB`)
        res.status(201).json({body: 'new vehicle added successfully'})
    }
}


const getVanIssues = async (req, res, next) => {
    const { id } = req.params;  

    try {
        const issues = await vanIssues(id);

        

        res.json(issues);
    } catch (error) {
        console.error('Error fetching van issues:', error);
        res.status(500).json({ error: 'Failed to fetch van issues.' });
    }
};
const markIssueAsFixed = async (req, res) => {
    const { id } = req.params;

    try {
        const updated = await fixVanIssue(id);

        if (!updated) {
            return res.status(404).json({ message: 'Issue not found.' });
        }

        res.json({ message: 'Issue marked as fixed.', issue: updated });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update issue.' });
    }
};

const addVanIssue = async (req, res) => {
    const { driver_id, description } = req.body;  // Assuming the body contains this information
    const van_id = req.params.id
    // Validation: Check if required fields are present
    if (!driver_id || !van_id || !description) {
        return res.status(400).json({ error: 'Driver ID, Van ID, and description are required.' });
    }

    try {
        const newIssue = await createVanIssue(driver_id, van_id, description);

        res.status(201).json({ message: 'Van issue created successfully.', issue: newIssue });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to create van issue.' });
    }
};


module.exports = {getAllVehicles,getVanWithReg,addNewVehicle, getVehicleByReg,getVanIssues, markIssueAsFixed, addVanIssue}