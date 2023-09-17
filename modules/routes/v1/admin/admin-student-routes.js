const express = require('express');
const router = express.Router();


//controllers
const adminStudentController = require('../../../controllers/version1/admin/admin-student-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const gate = require('./../../../middlewares/permissions/gate');

router.get(
    '/' ,
     gate.can('show-students'),
    adminStudentController.index
);

router.get(
    '/single/:id',
     gate.can('show-students'),
    adminStudentController.single
);


router.get(
    '/profile/:id',
     gate.can('show-students'),
    adminStudentController.profile
);

router.post(
    '/update/:id',
     gate.can('edit-students'),
    adminValidation.validate('update-student'),
    adminStudentController.update
)

router.post(
    '/delete/:id',
     gate.can('delete-students'),
    adminStudentController.destroy
);

router.post(
    '/toggle-active-student/:id',
     gate.can('activate-students'),
    adminStudentController.toggleActiveUser
);

module.exports = router;
