const { staffValidation} = require('../middlewares/staffValidator.js');
const {addNewStaff, getAllUsersController, editUser} = require(`../controllers/staffController.js`);

const express = require(`express`);
const router = express.Router();



router.route('/').post(staffValidation,addNewStaff).get(getAllUsersController);
router.route('/:id').post(editUser);



module.exports = router