const express = require('express');
const router = express.Router();


//controllers
const adminEmployeeController = require('../../../controllers/version1/admin/admin-employee-controller');

//middleWare
const { uploadFile } = require('../../../middlewares/upload');


router.get(
    '/' ,
    adminEmployeeController.index
);
router.post(
    '/create',
    uploadFile.single('image'),
    adminEmployeeController.store
);

router.post(
    '/update/:id',
    adminEmployeeController.update
);

router.post(
    '/delete/:id',
    adminEmployeeController.destroy
)


module.exports = router;
