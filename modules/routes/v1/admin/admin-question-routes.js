const express = require('express');
const router = express.Router();


//controllers
const adminQuestionController = require('./../../../controllers/version1/admin/admin-question-controller');

//Middlewares (Validations)
const gate = require('./../../../middlewares/permissions/gate');


router.get(
    '/',
     gate.can('show-questions'),
    adminQuestionController.index

);

router.get(
    '/single/:id',
     gate.can('show-questions'),
    adminQuestionController.single
);

router.post(
    '/delete/:id' ,
     gate.can('delete-questions'),
    adminQuestionController.destroy
);

router.post(
    '/toggle-online/:id' ,
     gate.can('activate-questions'),
    adminQuestionController.toggleOnline
);





module.exports = router;
