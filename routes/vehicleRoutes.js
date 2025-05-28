const express = require(`express`);
const router = express.Router();
const vehicleController =  require(`../controllers/vehicleController`);
const driveHistoryController = require('../controllers/driveHistoryController')
const {validateVehicle} = require("../middlewares/vehicleValidator");

router.route(`/reg/:id/issues`).get(vehicleController.getVanIssues).patch(vehicleController.markIssueAsFixed).post(vehicleController.addVanIssue)
router.get('/reg/:registration', vehicleController.getVanWithReg);
router.route('/reg/:registration/history').get(driveHistoryController.DriverHistoryByVan).post(driveHistoryController.createDriverHistory).put(driveHistoryController.returnVanController);
router.route(`/:registration`).get(vehicleController.getVehicleByReg);
router.route('/').get(vehicleController.getAllVehicles).post(validateVehicle,vehicleController.addNewVehicle)


module.exports = router