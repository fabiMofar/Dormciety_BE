const express = require('express');
const router = express.Router();


//controllers
const studentAuthController = require('../../../controllers/version1/student/student-auth-controller');

// Middlewares
const studentValidation = require('./../../../middlewares/validation/student-validation');
const studentToken = require('./../../../middlewares/token/student-token');



router.post(
    '/register',
    studentValidation.validate('register'),
    studentAuthController.register
);

router.post(
    '/login',
    studentValidation.validate('login'),
    studentAuthController.login,
);

router.post(
    '/check-token',
    studentAuthController.checkToken
);

router.post(
    '/delete-account',
    studentToken.token,
    studentAuthController.delete
);

router.get(
    '/student',
    studentToken.token,
    studentAuthController.getStudent
)

module.exports = router;
