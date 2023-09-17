const express = require('express');
const router = express.Router();


//controllers
const studentQuestionController = require('./../../../controllers/version1/student/student-question-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');
const { uploadFile } = require('./../../../middlewares/upload');

router.get(
    '/',
    studentQuestionController.index
);

router.post(
    '/create' ,
    uploadFile.array('images')  ,
    studentValidation.validate('question') ,
    studentQuestionController.store
);

router.get(
    '/single/:id',
    studentQuestionController.single
);

router.post(
    '/update/:id' ,
    studentValidation.validate('question') ,
    studentQuestionController.update
);

router.post(
     '/delete/:id' ,
    studentQuestionController.destroy
);





module.exports = router;
