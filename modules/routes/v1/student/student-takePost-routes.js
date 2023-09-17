const express = require('express');
const router = express.Router();


//controllers
const studentTakePostController = require('./../../../controllers/version1/student/student-takePost-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');



router.get(
    '/',
    studentTakePostController.index
);

router.post(
    '/create' ,
    studentValidation.validate('takePost') ,
    studentTakePostController.store
);





module.exports = router;
