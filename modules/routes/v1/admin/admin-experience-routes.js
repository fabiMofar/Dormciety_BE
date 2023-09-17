const express = require('express');
const router = express.Router();


//controllers
const adminExperienceController = require('./../../../controllers/version1/admin/admin-experience-controller');

//Middlewares (Validations)
const gate = require('./../../../middlewares/permissions/gate');


router.get(
    '/',
    gate.can('show-experiences'),
    adminExperienceController.index
);

router.get(
    '/single/:id',
    gate.can('show-experiences'),
    adminExperienceController.single
);

router.post(
    '/delete/:id' ,
    gate.can('delete-experiences'),
    adminExperienceController.destroy
);

router.post(
    '/toggle-online/:id' ,
    gate.can('activate-experiences'),
    adminExperienceController.toggleOnline
);





module.exports = router;
