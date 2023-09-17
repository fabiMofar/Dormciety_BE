const express = require('express');
const router = express.Router();


//controllers
const adminPartnerController = require('../../../controllers/version1/admin/admin-partner-controller');
const {uploadFile} = require("../../../middlewares/upload");


router.get(
    '/' ,
    adminPartnerController.index
);
router.post(
    '/create',
    uploadFile.single('image'),
    adminPartnerController.store
);

router.post(
    '/update/:id',
    adminPartnerController.update
);

router.post(
    '/delete/:id',
    adminPartnerController.destroy
)


module.exports = router;
