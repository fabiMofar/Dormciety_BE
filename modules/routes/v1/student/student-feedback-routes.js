const express = require('express');
const router = express.Router();


//controllers
const studentFeedbackController = require('./../../../controllers/version1/student/student-feedback-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');

router.get(
    '/' ,
    studentFeedbackController.index
);

router.post(
    '/create',
    studentValidation.validate('feedback'),
    studentFeedbackController.store
)





module.exports = router;
