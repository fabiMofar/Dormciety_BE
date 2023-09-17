const express = require('express');
const router = express.Router();


//middlewares
const studentToken = require('./../../../middlewares/token/student-token');


router.get('/', function(req, res){
    res.json('welcome to version1 student Routes')
});

//public Routes
const public = require('./student-public-routes');
router.use('/public', public);

// student Auth Routes
const auth =  require('./student-auth-routes');
router.use('/auth', auth);

// student Verification Routes
const verification = require('./student-verification-routes');
router.use('/verification' , studentToken.token  , verification);

// student Questions Routes
const question = require('./student-question-routes');
router.use('/question', studentToken.token  ,  question);

// student Sale Article Routes
const saleArticle = require('./student-saleArticle-routes');
router.use('/saleArticle', studentToken.token  , saleArticle);

// student Experience routes
const experience = require('./student-experience-routes');
router.use('/experience', studentToken.token  ,  experience);

// student ShareRide routes
const shareRide = require('./student-shareRide-routes');
router.use('/shareRide', studentToken.token  ,  shareRide);

// student Events Routes
const event = require('./student-event-routes');
router.use('/event', studentToken.token , event);

// student Feeds Routes
const feed = require('./student-feed-routes');
router.use('/feed', studentToken.token ,  feed);

// student report Routes
const report = require('./student-report-routes');
router.use('/report' , studentToken.token , report);

// student comment routes
const comment = require('./student-comment-routes');
router.use('/comment', studentToken.token , comment);

// student favorite routes
const favorite = require('./student-favorite-routes');
router.use('/favorite', studentToken.token , favorite);

// student profile routes
const profile = require('./student-profile-routes');
router.use('/profile', studentToken.token ,  profile);

// student feedback routes
const feedback = require('./student-feedback-routes');
router.use('/feedback', studentToken.token , feedback)

// student dormitory routes
const dormitory = require('./student-dormitory-routes');
router.use('/dormitory', studentToken.token , dormitory)

// student take post routes
const takePost = require('./student-takePost-routes');
router.use('/takePost', studentToken.token , takePost);

// student conversation routes
const conversation = require('./student-conversation-routes');
router.use('/conversation', studentToken.token , conversation);


// student activityStatus routes
const activityStatus = require('./student-activityStatus-routes');
router.use('/activityStatus' , studentToken.token , activityStatus)

// student passwordForgotten routes
const passwordForgotten = require('./student-passwordForgotten-routes');
router.use('/passwordForgotten', passwordForgotten);


//Student Calendar routes
const calendar = require('./student-calendar-routes');
router.use('/calendar', studentToken.token ,  calendar)

//Student partner routes
const partner = require('./student-partner-routes');
router.use('/partner', studentToken.token ,  partner)

module.exports = router;
