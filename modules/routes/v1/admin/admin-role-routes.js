const express = require('express');
const router = express.Router();


//controllers
const adminRoleController = require('../../../controllers/version1/admin/admin-role-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const gate = require('./../../../middlewares/permissions/gate');

router.get(
    '/' ,
     gate.can('show-roles'),
    adminRoleController.index
);
router.post(
    '/create',
     gate.can('create-roles'),
    adminValidation.validate('role'),
    adminRoleController.store
);

router.post(
    '/update/:id',
     gate.can('edit-roles'),
    adminValidation.validate('role'),
    adminRoleController.update
);

router.post(
    '/delete/:id',
     gate.can('delete-roles'),
    adminRoleController.destroy
)

router.post(
    '/addRole/:id',
    adminRoleController.addRole
)


module.exports = router;
