const express = require('express');
const router = express.Router();


//controllers
const adminTakePocketsController = require('./../../../controllers/version1/admin/admin-takePocket-controller');

//Middlewares (Validations)
const gate = require('./../../../middlewares/permissions/gate');

router.get(
    '/' ,
     gate.can('show-take-pocket'),
    adminTakePocketsController.index
);




module.exports = router;
