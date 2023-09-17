const express = require('express');
const router = express.Router();


//controllers
const adminReportCategoryController  = require('../../../controllers/version1/admin/admin-reportCategory-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');


router.get(
    '/' ,
    adminReportCategoryController.index
);

router.get(
    '/single/:id' ,
    adminReportCategoryController.single
);

router.post(
    '/create',
    adminValidation.validate('report-category'),
    adminReportCategoryController.store
);

router.post(
    '/update/:id',
    adminValidation.validate('report-category'),
    adminReportCategoryController.update
);

router.post(
    '/delete/:id',
    adminReportCategoryController.destroy
);

module.exports = router;
