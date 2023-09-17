const express = require('express');
const router = express.Router();


//controllers
const adminVerificationController = require('../../../controllers/version1/admin/admin-verification-controller');

// Middlewares
const adminValidation = require('../../../middlewares/validation/admin-validation');
const gate = require('./../../../middlewares/permissions/gate');



// get a;; verifications
router.get(
    '/',
    adminVerificationController.index
)
// get all verifications Request by post
router.get(
    '/by-post',
     gate.can('show-post-verification'),
    adminVerificationController.postVerification
);

router.get(
    '/by-post/single/:id',
     gate.can('show-post-verification'),
    adminVerificationController.singlePostVerification
)


// this Route is for admins and generate Code for Posts Verifications
router.post(
    '/generate-token-post',
     gate.can('create-code'),
    adminVerificationController.registerTokenForPost
);

// send Letter to student Dormitory
router.post(
    '/send-letter/:id',
    adminVerificationController.sendLetter
);

router.get(
    '/council-verification/all',
     gate.can('show-councils'),
    adminVerificationController.verificationsByCouncil
);

router.get(
    '/council-verification/single/:id',
     gate.can('show-councils'),
    adminVerificationController.singleVerificationsByCouncil
);

router.post(
    '/review-verification-council/:id',
     gate.can('review-council'),
    adminValidation.validate('review-council'),
    adminVerificationController.reviewCouncilVerification
);



module.exports = router;
