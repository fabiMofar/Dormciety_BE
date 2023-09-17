const express = require('express');
const router = express.Router();


//controllers
const adminPermissionController = require('../../../controllers/version1/admin/admin-permission-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const gate = require('./../../../middlewares/permissions/gate');


router.get(
    '/' ,
    gate.can('show-permissions'),
    adminPermissionController.index
);
router.post(
    '/create',
    gate.can('create-permissions'),
    adminValidation.validate('permission'),
    adminPermissionController.store
);

router.post(
    '/update/:id',
     gate.can('edit-permissions'),
    adminValidation.validate('permission'),
    adminPermissionController.update
);

router.post(
    '/delete/:id',
    gate.can('delete-permissions'),
    adminPermissionController.destroy
)


module.exports = router;
