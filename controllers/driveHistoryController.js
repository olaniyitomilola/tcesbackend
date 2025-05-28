const getDriverHistoryByVan = require('../config/dbops')
const DriverHistoryByVan = async (req, res) => {
  const { id: vanId } = req.params;

  try {
    const history = await getDriverHistoryByVan(vanId);
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching driver history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const createDriverHistory = async (req, res) => {
    const { driver_id, van_id } = req.body;
  
    // Simple validation
    if (!driver_id || !van_id) {
      return res.status(400).json({ error: 'driver_id and van_id are required' });
    }
  
    try {
      const [newHistory] = await addDriverHistory(driver_id, van_id);
      res.status(201).json({
        message: 'Driver history created successfully',
        data: newHistory
      });
    } catch (error) {
      console.error('Error creating driver history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

const returnVanController = async (req, res) => {
    const { driver_id, van_id } = req.body;
  
    if (!driver_id || !van_id) {
      return res.status(400).json({ error: 'driver_id and van_id are required' });
    }
  
    try {
      const [updatedRecord] = await returnVan(driver_id, van_id);
  
      if (!updatedRecord) {
        return res.status(404).json({ error: 'No active assignment found to update' });
      }
  
      res.status(200).json({
        message: 'Van successfully returned',
        data: updatedRecord
      });
    } catch (error) {
      console.error('Error returning van:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
  DriverHistoryByVan, createDriverHistory, returnVanController
};