const { staffValidation} = require('../middlewares/staffValidator.js');
const {addNewStaff, getAllUsersController, editUser, deleteUser, getStaffDetails} = require(`../controllers/staffController.js`);

const express = require(`express`);
const router = express.Router();



router.route('/').post(staffValidation,addNewStaff).get(getAllUsersController);
router.route('/:id').patch(editUser).delete(deleteUser).get(getStaffDetails);



module.exports = router