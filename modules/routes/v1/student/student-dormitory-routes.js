const express = require('express');
const router = express.Router();


//controllers
const studentDormitoryController = require('./../../../controllers/version1/student/student-dormitory-controller');

//Middlewares (Validations)


router.get(
    '/students',
    studentDormitoryController.studentsOfDormitory
);

router.get(
    '/filterOfStatus',
    studentDormitoryController.filterOfStatus
)

router.get(
    '/search',
    studentDormitoryController.searchStudent
)

router.get(
    '/councils',
    studentDormitoryController.councils
)





module.exports = router;
