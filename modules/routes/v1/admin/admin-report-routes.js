const express = require('express');
const router = express.Router();


//controllers
const adminReportController  = require('../../../controllers/version1/admin/admin-report-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const gate = require('./../../../middlewares/permissions/gate');


router.get(
    '/' ,
     gate.can('show-reports'),
    adminReportController.index
);

router.get(
    '/single/:id' ,
     gate.can('show-reports'),
    adminReportController.single
);


router.post(
    '/review',
     gate.can('review-reports'),
    adminValidation.validate('report-review'),
    adminReportController.review
);

router.get(
    '/group',
     gate.can('show-reports'),
    adminReportController.group
)

router.get(
    '/archive',
     gate.can('show-reports'),
    adminReportController.archive
)

module.exports = router;
