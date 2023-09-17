const express = require('express')
const router = express.Router();
const student = require('./student/index');


router.get('/', function(req, res){
    res.json('welcome to version 2 of Routes')
});



router.use('/student' , student);



module.exports = router;
