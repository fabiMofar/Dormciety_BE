const express = require('express');
const router = express.Router();


//controllers
const adminEventController = require('./../../../controllers/version1/admin/admin-event-controller');

//Middlewares (Validations)
const adminValidation = require('./../../../middlewares/validation/admin-validation');
const { uploadFile } = require('./../../../middlewares/upload');
const gate = require('./../../../middlewares/permissions/gate');


router.get(
    '/student',
    gate.can('show-events'),
    adminEventController.eventsOfStudents
);

router.get(
    '/user',
    gate.can('show-admin-events'),
    adminEventController.eventsOfUser
);

router.get(
    '/members/:id',
     gate.can('show-admin-events'),
    adminEventController.members
);

router.get(
    '/single/:id',
     gate.can('show-admin-events'),
    adminEventController.single
);


router.post(
    '/create',
     gate.can('create-admin-events'),
    uploadFile.fields([{name : 'images'} , {name : 'attachments' }]),
    adminValidation.validate('event'),
    adminEventController.store
);

router.post(
    '/delete/:id' ,
     gate.can('delete-admin-events'),
    adminEventController.destroy
);

router.post(
    '/toggle-online/:id',
     gate.can('activate-admin-events'),
    adminEventController.toggleOnline
)





module.exports = router;
