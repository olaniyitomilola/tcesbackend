const { createClient, getAllClients } = require("../config/dbops");

const createClientController = async (req, res, next) => {
    try {
      const { name } = req.body;
  
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Client name is required' });
      }
  
      const newClient = await createClient(name.trim());
      res.status(201).json(newClient);
    } catch (error) {
      next(error);
    }
  };

  const getAllClientsController = async (req, res, next) => {
    try {
      const clients = await getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  };

  module.exports = {getAllClientsController, createClientController}