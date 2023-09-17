const express = require('express');
const router = express.Router();


//controllers
const adminDormitoryController  = require('../../../controllers/version1/admin/admin-dormitory-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const { uploadFile } = require('../../../middlewares/upload');

router.get(
    '/' ,
    adminDormitoryController.index
);

router.get(
    '/single/:id' ,
    adminDormitoryController.single
);

router.post(
    '/create',
    adminValidation.validate('dormitory'),
    adminDormitoryController.store
);

router.post(
    '/update/:id',
    adminValidation.validate('dormitory'),
    adminDormitoryController.update
);

router.post(
    '/delete/:id',
    adminDormitoryController.destroy
);

router.post(
    '/activity/:id',
    adminDormitoryController.change_activity
)


router.post(
    '/change',
    adminDormitoryController.changeDormitory
)

module.exports = router;
