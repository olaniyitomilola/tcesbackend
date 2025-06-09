const express = require(`express`);
const router = express.Router();
const vehicleController =  require(`../controllers/vehicleController`);
const driveHistoryController = require('../controllers/driveHistoryController')
const {validateVehicle} = require("../middlewares/vehicleValidator");

router.route(`/reg/:id/issues`).get(vehicleController.getVanIssues).patch(vehicleController.markIssueAsFixed).post(vehicleController.addVanIssue)
router.get('/reg/:registration', vehicleController.getVanWithReg);
router.route('/reg/:vanId/history').get(vehicleController.fetchDriverHistory).post(driveHistoryController.createDriverHistory).put(driveHistoryController.returnVanController);
router.route('/drivers').get(vehicleController.fetchDrivers)
router.route('/drivers/:id').get(vehicleController.fetchMyVans);
router.route('/available').get(vehicleController.fetchAvailableVans)
router.route('/pickup').post(vehicleController.pickUpVan)
router.route('/dropoff').post(vehicleController.dropOffVan);
router.route(`/:registration`).get(vehicleController.getVehicleByReg);
router.route('/').get(vehicleController.getAllVehicles).post(validateVehicle,vehicleController.addNewVehicle)

module.exports = router