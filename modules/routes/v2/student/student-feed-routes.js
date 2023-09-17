const express = require('express');
const router = express.Router();


//controllers
const studentFeedController = require('./../../../controllers/version2/student/student-feeds-controller');

//Middlewares (Validations)


router.get(
    '/',
    studentFeedController.index
);



module.exports = router;
