const express = require('express');
const router = express.Router();


//controllers
const adminShareRideController = require('./../../../controllers/version1/admin/admin-shareRide-controller');

//Middlewares (Validations)
const gate = require('./../../../middlewares/permissions/gate');


router.get(
    '/',
     gate.can('show-shareRides'),
    adminShareRideController.index
);

router.get(
    '/single/:id',
     gate.can('show-shareRides'),
    adminShareRideController.single
);

router.post(
    '/delete/:id' ,
     gate.can('delete-shareRides'),
    adminShareRideController.destroy
);
router.post(
    '/toggle-online/:id' ,
     gate.can('activate-shareRides'),
    adminShareRideController.toggleOnline
);


module.exports = router;
