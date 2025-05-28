const {validateEmail, updatePassword, authenticateUser} = require(`../controllers/authController`);

const express = require(`express`);
const router = express.Router();



router.route('/').post(validateEmail).put(updatePassword);
router.route(`/login`).post(authenticateUser)



module.exports = router