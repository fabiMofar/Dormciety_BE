const express = require('express');
const router = express.Router();


//controllers
const studentConversationController = require('./../../../controllers/version1/student/student-conversation-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');
const {uploadFile}= require('./../../../middlewares/upload');


router.get(
    '/',
    studentConversationController.index
);

router.post(
    '/create' ,
    studentConversationController.store
);

router.post(
    '/message/create',
    uploadFile.array('images'),
    studentConversationController.sendMessage
);

router.get(
    '/messages',
    studentConversationController.getMessages
);

// router.post(
//     '/online',
//     studentConversationController.online
// )
//
// router.post(
//     '/offline',
//     studentConversationController.offline
// )






module.exports = router;
