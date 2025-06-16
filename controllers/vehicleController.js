const { Vehicle } = require("../Class/Vehicle");
const vehicleService = require(`../services/vehicleServices`);
const vesAPIService = require(`../services/VESAPIService`)
const crypto = require('crypto');
const logger = require('../utils/logger');
const { fetchVehicles, insertVehicle, fetchVehiclebyReg, vanIssues, fixVanIssue, createVanIssue, getAllDrivers, getVansInUseByStaff, getVansNotInUse, assignVan, updateLastMileage, vanDropOff, getDriverHistoryForVan } = require("../config/dbops");
//helper to fix new vans without mot expiry
function addYearsAndGetLastDay(ymString, yearsToAdd) {
    // Split into numeric year and month
    const [year, month] = ymString.split('-').map(Number);

    // JS Date: new Date(year, monthIndex+1, 0) → day “0” of next month is last day of given month
    // month from string is 1-based (e.g. "09" → 9), so passing month directly works
    const resultDate = new Date(year + yearsToAdd, month, 0);

    // Format back to "YYYY-MM-DD"
    const yyyy = resultDate.getFullYear();
    const mm = String(resultDate.getMonth() + 1).padStart(2, '0');
    const dd = String(resultDate.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

const getVanWithReg = async (req, res, next) => {
    try {
        const bod = { registrationNumber: req.params.registration }
        const vanMot = await vehicleService.getVehicleFromAPI(req.params.registration);
        const vanDeets = await vesAPIService.getVehicleDataFromAPI(bod)

        if (!vanMot || !vanDeets) {

            logger.info('van Mot:', vanMot)
            logger.info('van Deet:', vanDeets)
            console.log('van Mot:', vanMot)
            console.log('van deets:', vanDeets)
            
            res.status(404).json({ body: `not found` })
        }



        const vehicle = new Vehicle(`${vanMot.name} ${vanDeets.yearOfManufacture}`, vanDeets.fuelType, vanDeets.motStatus == `No details held by DVLA` ? 'Valid' : vanDeets.motStatus, vanDeets.taxStatus, vanDeets.taxDueDate, vanDeets.motExpiryDate ? vanDeets.motExpiryDate : addYearsAndGetLastDay(vanDeets.monthOfFirstRegistration, 3), vanDeets.registrationNumber, vanMot.recall)
        // }

        res.json(vehicle);
    } catch (error) {
        logger.error('error:',error)
        console.log('error:',error)
        next(error);
    }
}


const getVanWithVin = async (req, res, next) => {
    try {
        const vanMot = await vehicleService.getAllVehicleFromAPIVin(req.id);

        res.json(vanMot);
    } catch (error) {
        next(error);
    }
}

const getAllVehicles = async (req, res, next) => {
    try {
        const vehicle = await fetchVehicles();
        console.log(`get all vehicles`)
        res.status(200).json(vehicle)
    } catch (error) {
        next(error)
    }
}

const addNewVehicle = async (req, res, next) => {
    try {
        const van = req.body;

        console.log(van)

        //check if van is already in db.

        const vehicle = await fetchVehiclebyReg(van.registration);
        if (vehicle.length) {
            res.status(403).json({ message: `${van.registration} has already been added` }

            )
        } else {
            insertVehicle(van)
            console.log(`${van.name} successfully added to DB`)
            res.status(201).json({ body: 'new vehicle added successfully' })
        }


    } catch (error) {
        next(error)
    }
}

const getVehicleByReg = async (req, res, next) => {
    const reg = req.params.registration;
    try {
        const response = await fetchVehiclebyReg(reg.trim().toUpperCase());

        res.status(200).json(response);

    } catch (error) {
        console.error(error)
    }


}

const removeVehicle = async (req, res, next) => {
    const id = req.params.reg
    //check if exists


    const vehicle = await fetchVehiclebyReg(id);
    if (vehicle.length) {
        res.status(403).json({ message: `${van.registration} has already been added` }

        )
    } else {
        insertVehicle(van)
        console.log(`${van.name} successfully added to DB`)
        res.status(201).json({ body: 'new vehicle added successfully' })
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
        console.log(van_id, driver_id, description)
        const newIssue = await createVanIssue(driver_id, van_id, description);

        res.status(201).json({ message: 'Van issue created successfully.', issue: newIssue });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to create van issue.' });
    }
};

const fetchDrivers = async (req, res) => {

    try {
        const drivers = await getAllDrivers();

        console.log('here')
        res.status(200).json({ drivers })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch drivers' });

    }
}

const fetchMyVans = async (req, res) => {
    try {
        const id = req.params.id
        const myVans = await getVansInUseByStaff(id)
        res.status(200).json({ myVans })

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vans' });

    }
}

const fetchAvailableVans = async (req, res) => {
    try {
        const vans = await getVansNotInUse();
        res.status(200).json({ data: vans })

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vans' });

    }
}

const pickUpVan = async (req, res) => {
    const { driver_id, pick_up_mileage, vanId } = req.body;

    // Validate required fields
    if (!driver_id) {
        return res.status(400).json({ error: 'driver_id is required' });
    }
    if (pick_up_mileage === undefined || pick_up_mileage === null) {
        return res.status(400).json({ error: 'pick_up_mileage is required' });
    }
    if (isNaN(Number(pick_up_mileage)) || Number(pick_up_mileage) < 0) {
        return res.status(400).json({ error: 'pick_up_mileage must be a non-negative number' });
    }

    try {
        // Attempt to assign the van to the driver
        const result = await assignVan(vanId, driver_id, Number(pick_up_mileage));
        const updateMileage = await updateLastMileage(vanId, Number(pick_up_mileage))
        // assignVan returns the newly inserted driver_history row(s)
        return res.status(201).json(result);
    } catch (err) {
        console.error('Error in pickUpVan controller:', err);
        return res.status(500).json({ error: 'Failed to assign van' });
    }
}
const dropOffVan = async (req, res) => {
    console.log(req.body)
  const {
    history_id,
    driver_id,
    mileage,
    type,
    location,
    vehicle_id,
    to_driver_name,
    to_driver_id,
  } = req.body;

  // Basic validation:
  if (!history_id || !driver_id || mileage == null || !type) {
    return res.status(400).json({
      error: "history_id, driver_id, mileage, and type are all required",
    });
  }

  const mile = Number(mileage);
  if (isNaN(mile) || mile < 0) {
    return res.status(400).json({ error: "mileage must be a non-negative number" });
  }

  if (type === "transfer" && !to_driver_id) {
    return res.status(400).json({
      error: "to_driver_id is required when type is 'transfer'",
    });
  }

  if (type === "broken" && (!location || !location.trim())) {
    return res.status(400).json({
      error: "location is required when type is 'broken'",
    });
  }

  // Construct drop-off note
  let note;
  switch (type) {
    case "office":
      note = `Dropped off at office at ${mile} miles`;
      break;
    case "transfer":
      note = `Transferred to ${to_driver_name} at ${mile} miles`;
      break;
    case "broken":
      note = `Broken down at "${location.trim()}" at ${mile} miles`;
      break;
    default:
      return res.status(400).json({ error: "Invalid drop-off type" });
  }

  try {
    const dropOff = await vanDropOff(history_id, mile, note);

    if (dropOff.length) {
      if (type === "transfer") {
        await assignVan(vehicle_id, to_driver_id, mile);
      }

      await updateLastMileage(vehicle_id, mile);

      return res.status(201).json({ message: note });
    } else {
      return res.status(500).json({ error: "Drop-off record not updated." });
    }
  } catch (error) {
    console.error("Error in dropOffVan:", error);
    return res.status(500).json({ error: "Failed to drop off van" });
  }
};

async function fetchDriverHistory(req, res) {
  const { vanId } = req.params;

  if (!vanId) {
    return res.status(400).json({ error: 'vanId parameter is required' });
  }

  try {
    const result = await getDriverHistoryForVan(vanId);
    // result is an array of history rows
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching driver history:', err);
    return res.status(500).json({ error: 'Failed to fetch driver history' });
  }
}

module.exports = {fetchDriverHistory, dropOffVan, pickUpVan, fetchAvailableVans, fetchMyVans, fetchDrivers, getAllVehicles, getVanWithReg, addNewVehicle, getVehicleByReg, getVanIssues, markIssueAsFixed, addVanIssue }