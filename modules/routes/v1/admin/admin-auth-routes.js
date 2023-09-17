const express = require('express');
const router = express.Router();


//controllers
const adminAuthController = require('../../../controllers/version1/admin/admin-auth-controller');

// Middlewares
const adminAuthValidation = require('../../../middlewares/validation/admin-validation');
const { uploadFile } = require('../../../middlewares/upload');
const adminToken = require('./../../../middlewares/token/admin-token')


// register a user
router.post(
    '/register',
    adminToken.token,
    uploadFile.single('organisation_logo'),
    adminAuthValidation.validate('register'),
    adminAuthController.register
);

// login user to admin panel with this Route

router.post(
    '/login',
    adminAuthValidation.validate('login'),
    adminAuthController.login,
);

// check token of user is valid or not

router.post(
    '/check-token',
    adminAuthController.checkToken
);


module.exports = router;
