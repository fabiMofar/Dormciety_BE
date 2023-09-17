const express = require('express');
const router = express.Router();


//controllers
const adminMediaController = require('./../../../controllers/version1/admin/admin-media-controller');


//middlewares
const gate = require('./../../../middlewares/permissions/gate');


router.get(
    '/',
    gate.can('show-fileManagers'),
    adminMediaController.index

);






module.exports = router;
