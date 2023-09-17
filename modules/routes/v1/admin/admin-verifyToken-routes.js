const express = require('express');
const router = express.Router();


//controllers
const adminVerifyTokenController = require('../../../controllers/version1/admin/admin-verifyToken-controller');


//Middlewares
const gate = require('./../../../middlewares/permissions/gate');

// get all verifyTokens
router.get(
    '/',
     gate.can('show-codes'),
    adminVerifyTokenController.index
);


// generate a Token with this Route
router.post(
    '/create',
     gate.can('create-code'),
    adminVerifyTokenController.store
);



module.exports = router;
