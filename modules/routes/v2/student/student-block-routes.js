const express = require('express');
const router = express.Router();


//controllers
const studentBlockController = require('./../../../controllers/version2/student/student-block-controller');

//Middlewares (Validations)


router.get(
    '/',
    studentBlockController.index
);

router.post(
    '/create/:id',
    studentBlockController.store
);

router.post(
    '/unblock/:id',
    studentBlockController.destroy
);







module.exports = router;
