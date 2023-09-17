const express = require('express');
const router = express.Router();


//controllers
const studentFeedController = require('./../../../controllers/version1/student/student-feed-Controller');


router.get(
    '/' ,
    studentFeedController.index
);

router.get(
    '/memos',
    studentFeedController.memos
)

router.get(
    '/my-feeds',
    studentFeedController.myFeeds
)

router.get(
    '/experiences',
    studentFeedController.experiences
)

router.get(
    '/questions',
    studentFeedController.questions
)

router.get(
    '/saleArticles',
    studentFeedController.saleArticles
)

router.get(
    '/shareRides',
    studentFeedController.shareRides
)

router.get(
    '/events',
    studentFeedController.events
)




module.exports = router;
