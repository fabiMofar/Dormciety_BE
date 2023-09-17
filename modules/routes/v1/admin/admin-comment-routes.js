const express = require('express');
const router = express.Router();


//controllers
const adminCommentController  = require('../../../controllers/version1/admin/admin-comment-controller');

// Middlewares
const gate = require('./../../../middlewares/permissions/gate');

router.get(
    '/question' ,
    gate.can('show-comments'),
    adminCommentController.questionComments
);

router.get(
    '/experience' ,
     gate.can('show-comments'),
    adminCommentController.experienceComments
);
router.get(
    '/saleArticle' ,
     gate.can('show-comments'),
    adminCommentController.saleArticleComments
);
router.get(
    '/event' ,
     gate.can('show-comments'),
    adminCommentController.eventComments
);
router.get(
    '/shareRide' ,
    gate.can('show-comments'),
    adminCommentController.shareRideComments
);

router.post(
    '/delete/:id',
    gate.can('delete-comments'),
    adminCommentController.destroy
);



module.exports = router;
