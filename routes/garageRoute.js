const express = require('express');
const router = express.Router();

const {
  bookAppointmentController,viewGarageAppointments, addGarageController, getGaragesController,
  getGarageController
} = require('../controllers/garageController');

// GET all garages
router.get('/', getGaragesController);

// POST a new garage
router.post('/', addGarageController);

// POST book an appointment
router.post('/appointments', bookAppointmentController);

// GET all garage appointments
router.get('/appointments', viewGarageAppointments);

router.get('/appointments/:id',getGarageController)

module.exports = router;
