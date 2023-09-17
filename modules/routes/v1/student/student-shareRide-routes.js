const express = require('express');
const router = express.Router();


//controllers
const studentShareRideController = require('./../../../controllers/version1/student/student-shareRide-cotroller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');

router.get(
    '/',
    studentShareRideController.index
)

router.get(
    '/single/:id',
    studentShareRideController.single
)

router.post(
    '/create' ,
    studentValidation.validate('shareRide') ,
    studentShareRideController.store
);
router.post(
    '/delete/:id' ,
    studentShareRideController.destroy
);

router.get(
    '/members',
    studentShareRideController.members
);

router.post(
    '/take-sit',
    studentShareRideController.takeSit
);

router.post(
    '/manage-member',
    studentShareRideController.manageMember
);

router.post(
    '/cancel-application',
    studentShareRideController.cancelApplication
);

router.get(
    '/check-application',
    studentShareRideController.applicationStatus
);





module.exports = router;
