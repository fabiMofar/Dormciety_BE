const express = require('express');
const router = express.Router();


//controllers
const studentPasswordForgottenController = require('./../../../controllers/version1/student/student-passwordForgotten-controller');

//Middlewares (Validations)


router.post(
    '/create',
    studentPasswordForgottenController.store
);

router.post(
    '/reset-password',
    studentPasswordForgottenController.resetPassword
);





module.exports = router;
