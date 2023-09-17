const express = require('express');
const router = express.Router();


//controllers
const studentEventController = require('./../../../controllers/version1/student/student-event-Controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');
const { uploadFile } = require('./../../../middlewares/upload');


router.get(
    '/',
    studentEventController.index
)

router.get(
    '/single/:id',
    studentEventController.single
)

router.post(
    '/create' ,
    studentValidation.validate('event') ,
    studentEventController.store
);

router.post(
    '/delete/:id' ,
    studentEventController.destroy
);

router.get(
    '/members',
    studentEventController.members
);

router.post(
    '/take-sit',
    studentEventController.takeSit
);

router.post(
    '/manage-member',
    studentEventController.manageMember
);

router.post(
    '/cancel-application',
    studentEventController.cancelApplication
);

router.get(
    '/check-application',
    studentEventController.applicationStatus
);

router.post(
    '/take-sit-admin-event',
    studentEventController.takeSitAdminEvent
)

router.post(
    '/cancel-application-admin-event',
    studentEventController.cancelApplicationAdminEvent
)




module.exports = router;
