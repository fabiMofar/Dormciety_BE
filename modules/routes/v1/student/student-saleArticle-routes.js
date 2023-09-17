const express = require('express');
const router = express.Router();


//controllers
const studentSaleArticleController = require('./../../../controllers/version1/student/student-saleArticle-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');
const { uploadFile } = require('./../../../middlewares/upload');


router.get(
    '/',
    studentSaleArticleController.index
)

router.get(
    '/single/:id',
    studentSaleArticleController.single
)

router.post(
    '/create' ,
    uploadFile.array('images')  ,
    studentValidation.validate('saleArticle') ,
    studentSaleArticleController.store
);

router.post(
    '/update/:id' ,
    studentSaleArticleController.update
);

router.post(
    '/delete/:id' ,
    studentSaleArticleController.destroy
);





module.exports = router;
