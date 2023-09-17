const express = require('express');
const router = express.Router();


//controllers
const studentExperienceController = require('./../../../controllers/version1/student/student-experience-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');
const { uploadFile } = require('./../../../middlewares/upload');


router.get(
    '/',
    studentExperienceController.index
)

router.get(
    '/single/:id',
    studentExperienceController.single
)

router.post(
    '/create' ,
    uploadFile.array('images'),
    studentValidation.validate('experience') ,
    studentExperienceController.store
);

router.post(
    '/update/:id' ,
    studentValidation.validate('experience') ,
    studentExperienceController.update
);

router.post(
    '/delete/:id' ,
    studentExperienceController.destroy
);





module.exports = router;
