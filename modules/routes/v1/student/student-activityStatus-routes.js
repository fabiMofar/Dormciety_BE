const express = require('express');
const router = express.Router();


//controllers
const studentActivityStatusController = require('./../../../controllers/version1/student/student-activityStatus-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');
const {uploadFile}= require('./../../../middlewares/upload');



router.get(
    '/symbols',
    studentActivityStatusController.getSymbol
)
router.get(
    '/',
    studentActivityStatusController.index
);

router.post(
    '/create' ,
    studentActivityStatusController.store
);

router.post(
    '/delete/:id',
    studentActivityStatusController.destroy
)





module.exports = router;
