const express = require('express');
const router = express.Router();


//controllers
const adminAdvertisingController = require('../../../controllers/version1/admin/admin-advertising-controller');
const {uploadFile} = require("../../../middlewares/upload");


router.get(
    '/' ,
    adminAdvertisingController.index
);
router.post(
    '/create',
    uploadFile.single('image'),
    adminAdvertisingController.store
);

router.post(
    '/delete/:id',
    adminAdvertisingController.destroy
);


module.exports = router;
