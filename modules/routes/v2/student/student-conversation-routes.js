const express = require('express');
const router = express.Router();


//controllers
const studentConversationController = require('./../../../controllers/version2/student/student-conversation-controller');

//Middlewares (Validations)


router.get(
    '/',
    studentConversationController.index
);








module.exports = router;
