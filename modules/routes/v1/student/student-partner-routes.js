const express = require('express');
const router = express.Router();


//controllers
const studentPartnerController = require('./../../../controllers/version1/student/student-partner-controller');


router.get(
    '/' ,
    studentPartnerController.index
);

router.get(
    '/employees',
    studentPartnerController.employeesOfPartners
)





module.exports = router;
