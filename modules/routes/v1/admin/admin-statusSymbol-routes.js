const express = require('express');
const router = express.Router();


//controllers
const adminStatusSymbolController = require('../../../controllers/version1/admin/admin-statusSymbol-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const {uploadFile} = require('./../../../middlewares/upload');
const gate = require('./../../../middlewares/permissions/gate');

router.get(
    '/' ,
     gate.can('show-symbols'),
    adminStatusSymbolController.index
);

router.post(
    '/create',
     gate.can('create-symbol'),
    uploadFile.single('symbol'),
    // adminValidation.validate('update-student'),
    adminStatusSymbolController.store
)

router.post(
    '/delete/:id',
     gate.can('delete-symbol'),
    adminStatusSymbolController.destroy
);

module.exports = router;
