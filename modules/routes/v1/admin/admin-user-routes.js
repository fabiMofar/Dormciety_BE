const express = require('express');
const router = express.Router();


//controllers
const adminUserController = require('../../../controllers/version1/admin/admin-user-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const { uploadFile } = require('../../../middlewares/upload');
const gate = require('./../../../middlewares/permissions/gate');

// get all users
router.get(
    '/' ,
     gate.can('show-users'),
    adminUserController.index
);

// get single of user

router.get(
    '/single/:id',
     gate.can('show-users'),
    adminUserController.single
)

router.get(
    '/profile',
    adminUserController.profile
)

router.post(
    '/update/:id',
     gate.can('edit-users'),
    uploadFile.single('organisation_logo'),
    adminValidation.validate('update-user'),
    adminUserController.update
)

router.post(
    '/delete/:id',
     gate.can('delete-users'),
    adminUserController.destroy
);

router.post(
    '/update-profile',
    adminValidation.validate('update-profile'),
    adminUserController.updateProfile
);

router.post(
    '/change-avatar',
    uploadFile.single('avatar'),
    adminUserController.changeAvatar
);

router.post(
    '/toggle-active-user/:id',
     gate.can('delete-users'),
    adminValidation.validate('toggle-active'),
    adminUserController.toggleActiveUser
);

module.exports = router;
