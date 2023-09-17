const express = require('express');
const router = express.Router();


//controllers
const studentVerificationController = require('../../../controllers/version1/student/student-verification-controller');

// Middlewares
const studentValidation = require('./../../../middlewares/validation/student-validation');
const { uploadFile } = require('./../../../middlewares/upload');


//get information for letter screen

router.get(
    '/letter/information',
    studentVerificationController.informationLetter
)

// student request a verification Code By Letter
router.post(
    '/request-post',
    studentValidation.validate('request-to-verification'),
    studentVerificationController.requestToVerifyByPost
);
// student submit verified
router.post(
    '/submit-verify-letter',
    studentVerificationController.submitVerifiedByLetter
);


// Wohnheimrat can with this Route ein Code generiert for  students
router.post(
    '/register-code',
    studentVerificationController.registerToken
);

// students als wohnheimrat can with this Route verification
router.post(
    '/council-verification',
    uploadFile.fields([{name : 'image' , maxCount : 1} , { name : 'attachment' , maxCount : 1}]),
    studentVerificationController.councilVerification
);

// student with this Route verified Code by CouncilCode
router.post(
    '/submit-verify-councilCode',
    studentVerificationController.submitVerifiedTokenByCouncil
)

module.exports = router;
