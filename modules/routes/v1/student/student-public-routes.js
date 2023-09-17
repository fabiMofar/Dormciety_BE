const express = require('express');
const router = express.Router();


//controllers
const studentPublicController = require('./../../../controllers/version1/student/student-public-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');
const { uploadFile } = require('./../../../middlewares/upload');

router.get(
    '/cities' ,
    studentPublicController.cities
);
router.get(
    '/dormitories' ,
    studentPublicController.dormitories
);






module.exports = router;
