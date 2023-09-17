const express = require('express');
const router = express.Router();


//controllers
const studentReportController = require('./../../../controllers/version1/student/student-report-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');


router.get(
    '/categories',
    studentReportController.reportCategories
)
router.post(
    '/create' ,
    studentValidation.validate('report') ,
    studentReportController.store
);





module.exports = router;
