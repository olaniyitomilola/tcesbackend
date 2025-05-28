const express = require('express');
const { insertProjectController, getClientProjects, getClientProjectsByDate, getProjectsByDate, insertAssignment } = require('../controllers/projectController');
const router = express.Router();


router.route('/').post(insertProjectController);
router.route(`/all`).get(getProjectsByDate)
router.route('/assignshifts').post(insertAssignment);

router.route(`/:id`).get(getClientProjects);
router.route(`/:id/filter`).get(getClientProjectsByDate);


module.exports = router;
