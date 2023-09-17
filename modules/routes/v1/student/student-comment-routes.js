const express = require('express');
const router = express.Router();


//controllers
const studentCommentController = require('./../../../controllers/version1/student/student-comment-controller');

//Middlewares (Validations)
const studentValidation = require('./../../../middlewares/validation/student-validation');


router.post(
    '/create' ,
    studentValidation.validate('comment') ,
    studentCommentController.store
);
router.post(
    '/experience/create' ,
    studentValidation.validate('comment') ,
    studentCommentController.storeCommentExperience
);

router.post(
    '/question/create' ,
    studentValidation.validate('comment') ,
    studentCommentController.storeCommentQuestion
);
router.post(
    '/saleArticle/create' ,
    studentValidation.validate('comment') ,
    studentCommentController.storeCommentSaleArticle
);

router.get(
    '/question/:id',
    studentCommentController.questionComment
);

router.get(
    '/experience/:id',
    studentCommentController.experienceComment
);



router.get(
    '/saleArticle/:id',
    studentCommentController.saleArticleComment
);



router.get(
    '/mentions',
    studentCommentController.mentions
)





module.exports = router;
