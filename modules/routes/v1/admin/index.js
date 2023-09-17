const express = require('express');
const router = express.Router();
const Student = require('./../../../models/student');


//Middlewares
const adminToken = require('./../../../middlewares/token/admin-token');

router.get('/', function(req, res){
    res.json('welcome to version1 Admin Routes')
});

router.get('/all' , async (req, res) => {
    const result = await Student.find().select('firstname lastname email').exec();
    res.json(result)
})

// authentication Admin Routes
const auth = require('./admin-auth-routes');
router.use('/auth', auth);

// user Admin Routes
const user = require('./admin-user-routes');
router.use('/user', adminToken.token ,  user);

// city Admin Routes
const city = require('./admin-city-routes');
router.use('/city', adminToken.token ,  city);


//Dormitory Admin Routes
const dormitory = require('./admin-dormitory-routes');
router.use('/dormitory' , adminToken.token , dormitory);

//Role Admin Routes
const role = require('./admin-role-routes');
router.use('/role' , adminToken.token , role);

//Permissions admin Routes
const permission = require('./admin-permission-routes');
router.use('/permission', adminToken.token , permission);

// Admin Verification Routes
const verification = require('./admin-verification-routes');
router.use('/verification', adminToken.token , verification);

// admin question routes
const question = require('./admin-question-routes');
router.use('/feed/question', adminToken.token , question);

// admin sale Article routes
const saleArticle = require('./admin-saleArticle-routes');
router.use('/feed/saleArticle' , adminToken.token , saleArticle);

// admin share Ride routes
const shareRide = require('./admin-shareRide-routes');
router.use('/feed/shareRide',adminToken.token , shareRide);

//admin experience routes
const experience = require('./admin-experience-routes');
router.use('/feed/experience', adminToken.token , experience);

// admin memo routes
const memo = require('./admin-memo-routes');
router.use('/memo', adminToken.token , memo);

// admin report category routes
const reportCategory = require('./admin-reportCategory-routes');
router.use('/report-category', adminToken.token , reportCategory);

//admin report Routes
const report = require('./admin-report-routes');
router.use('/report', adminToken.token , report);

// admin comment Routes
const comment = require('./admin-comment-routes');
router.use('/comment', adminToken.token , comment);

// admin event Routes
const event = require('./admin-event-routes');
router.use('/feed/event', adminToken.token , event);

// admin student Routes
const student = require('./admin-student-routes');
router.use('/student' , adminToken.token , student);

// admin media routes
const media = require('./admin-media-routes');
router.use('/media', adminToken.token , media);

// admin feedback routes
const feedback = require('./admin-feedback-routes');
router.use('/feedback' , adminToken.token , feedback);

// admin user activities routes
const userActivity = require('./admin-userActivity-routes');
router.use('/userActivity', adminToken.token , userActivity);

// admin verifyToken routes
const verifyToken = require('./admin-verifyToken-routes');
router.use('/verifyToken', adminToken.token , verifyToken);

// admin home routes
const home = require('./admin-home-routes');
router.use('/home', adminToken.token , home);

// admin statusSymbol routes
const statusSymbol = require('./admin-statusSymbol-routes');
router.use('/statusSymbol', adminToken.token , statusSymbol)

// admin takePocket routes
const takePocket = require('./admin-takePockets-routes');
router.use('/takePocket', adminToken.token , takePocket)

// partner takePocket routes
const partner = require('./admin-partner-routes');
router.use('/partner', adminToken.token , partner)

// employee takePocket routes
const employee = require('./admin-employee-routes');
router.use('/employee', adminToken.token , employee)

// advertising takePocket routes
const advertising = require('./admin-advertising-routes');
router.use('/advertising', adminToken.token , advertising)


module.exports = router;
