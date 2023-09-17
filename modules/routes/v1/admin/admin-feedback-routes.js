const express = require('express');
const router = express.Router();


//controllers
const adminFeedbackController = require('./../../../controllers/version1/admin/admin-feedback-controller');

//Middlewares (Validations)
const gate = require('./../../../middlewares/permissions/gate');

router.get(
    '/' ,
    gate.can('show-feedbacks'),
    adminFeedbackController.index
);




module.exports = router;
