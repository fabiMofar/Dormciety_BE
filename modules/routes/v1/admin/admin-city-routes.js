const express = require('express');
const router = express.Router();


//controllers
const adminCityController  = require('../../../controllers/version1/admin/admin-city-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const gate = require('./../../../middlewares/permissions/gate');


// get all cities
router.get(
    '/' ,
    gate.can('show-cities'),
    adminCityController.index
);

// create a City
router.post(
    '/create',
    gate.can('create-cities'),
    adminValidation.validate('city'),
    adminCityController.store
);

// update a city

router.post(
    '/update/:id',
     gate.can('edit-cities'),
    adminValidation.validate('city'),
    adminCityController.update
);


//delete a city
router.post(
    '/delete/:id',
     gate.can('delete-cities'),
    adminCityController.destroy
);

// change activity of city
router.post(
    '/activity/:id',
    gate.can('activate-cities'),
    adminCityController.change_activity
)


module.exports = router;
