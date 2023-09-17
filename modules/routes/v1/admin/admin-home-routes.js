const express = require('express');
const router = express.Router();


//controllers
const adminHomeController = require('./../../../controllers/version1/admin/admin-home-controller');

//Middlewares (Validations)

router.get(
    '/' ,
    adminHomeController.countModules
);




module.exports = router;
