const express = require('express');
const router = express.Router();


//controllers
const studentFavoriteController  = require('./../../../controllers/version1/student/student-favorite-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');



router.get(
    '/',
    studentFavoriteController.index
)

router.post(
    '/create' ,
    studentValidation.validate('favorite') ,
    studentFavoriteController.store
);

router.post(
    '/delete/:id',
    studentFavoriteController.destroy
);

router.get(
    '/check-favorite',
    studentFavoriteController.checkFavorite
)








module.exports = router;
