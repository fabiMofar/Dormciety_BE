const express = require('express');
const router = express.Router();


//controllers
const studentProfileController = require('./../../../controllers/version1/student/student-profile-controller');

//Middlewares (Validations)
const { uploadFile } = require('./../../../middlewares/upload');

router.get(
    '/',
    studentProfileController.index
)

router.post(
    '/update' ,
    studentProfileController.update
);

router.post(
    '/change-avatar',
    uploadFile.single('avatar'),
    studentProfileController.changeAvatar
)

router.get(
    '/profile-of-student',
    studentProfileController.profileOfStudent
)





module.exports = router;
