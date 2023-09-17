const express = require('express')
const router = express.Router();
const admin = require('./admin/index');
const student = require('./student/index');


router.get('/', function(req, res){
    res.json('welcome to version1 Routes')
});



router.use('/admin' , admin);
router.use('/student' , student);



module.exports = router;
