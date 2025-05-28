
const express = require(`express`);
const { createClientController, getAllClientsController } = require("../controllers/clientController");
const router = express.Router();

router.route('/').post(createClientController).get(getAllClientsController)



module.exports = router