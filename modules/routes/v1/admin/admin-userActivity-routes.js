const express = require('express');
const router = express.Router();


//controllers
const adminUserActivityController = require('../../../controllers/version1/admin/admin-userActivity-controller');


// get all activities
router.get(
    '/' ,
    adminUserActivityController.index
);

module.exports = router;
