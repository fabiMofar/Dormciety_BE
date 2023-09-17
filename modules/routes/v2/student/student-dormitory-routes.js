const express = require('express');
const router = express.Router();


//controllers
const studentDormitoryController = require('./../../../controllers/version2/student/student-dormitory-controller');

//Middlewares (Validations)


router.get(
    '/students',
    studentDormitoryController.students
);

router.get(
    '/search',
    studentDormitoryController.searchStudent
);

router.get(
    '/councils',
    studentDormitoryController.councils
);





module.exports = router;
