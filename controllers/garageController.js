const { getAllGarages, bookGarageAppointment, getAllGarageAppointments, addGarage, getGarageAppointments } = require('../config/dbops');

const getGaragesController = async (req, res, next) => {
  try {
    const garages = await getAllGarages();
    res.status(200).json(garages);
  } catch (error) {
    console.error('Error fetching garages:', error);
    res.status(500).json({ message: 'Failed to fetch garages' });
  }
};

const getGarageController = async (req, res, next) => {
    try {
        console.log(`getting appointments for ${req.params.id}`)
      const garages = await getGarageAppointments(req.params.id);
      res.status(200).json(garages);
    } catch (error) {
      console.error('Error fetching garages:', error);
      res.status(500).json({ message: 'Failed to fetch garages' });
    }
  };

const addGarageController = async (req, res) => {
    try {
      const { name, address, phone } = req.body;
        console.log(req.body)
      if (!name || !address || !phone) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newGarage = await addGarage({ name, address, phone });
      res.status(201).json(newGarage);
    } catch (error) {
      console.error('Error adding garage:', error);
      res.status(500).json({ message: 'Failed to add garage' });
    }
  };
  const bookAppointmentController = async (req, res) => {
    try {
      const { van_id, garage_id, service, appointment_date, appointment_time } = req.body;
  
      if (!van_id || !garage_id || !service || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const appointment = await bookGarageAppointment({
        van_id,
        garage_id,
        service,
        appointment_date,
        appointment_time
      });
  
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      res.status(500).json({ message: 'Failed to book appointment' });
    }
  };

  const viewGarageAppointments = async (req, res) => {
    try {
      const appointments = await getAllGarageAppointments();
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error retrieving garage appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  };
module.exports = {bookAppointmentController,viewGarageAppointments, addGarageController, getGaragesController, getGarageController};
