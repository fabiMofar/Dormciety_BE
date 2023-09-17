const express = require('express');
const router = express.Router();


//controllers
const adminMemoController = require('./../../../controllers/version1/admin/admin-memo-controller');

//Middlewares (Validations)
const adminValidation = require('../../../middlewares/validation/admin-validation');
const { uploadFile } = require('./../../../middlewares/upload');


router.get(
    '/',
    adminMemoController.index

);

router.get(
    '/single/:id',
    adminMemoController.single
);

router.post(
    '/create',
    uploadFile.fields([{name : 'images'} , {name : 'attachments' }]),
    adminValidation.validate('memo'),
    adminMemoController.store
);

router.post(
    '/update/:id',
    uploadFile.fields([{name : 'images'} , {name : 'attachments' }]),
    adminValidation.validate('memo'),
    adminMemoController.update
)
router.post(
    '/delete/:id' ,
    adminMemoController.destroy
);





module.exports = router;
