const express = require('express');
const router = express.Router();


//middlewares
const studentToken = require('./../../../middlewares/token/student-token');


router.get('/', function(req, res){
    res.json('welcome to version 2 student Routes')
});

// student dormitory routes
const dormitory = require('./student-dormitory-routes');
router.use('/dormitory', studentToken.token , dormitory)

// student block routes
const block = require('./student-block-routes');
router.use('/block', studentToken.token , block)

// student block routes
const feeds = require('./student-feed-routes');
router.use('/feed', studentToken.token , feeds)

// student conversation routes
const conversation = require('./student-conversation-routes');
router.use('/conversation', studentToken.token , conversation)

module.exports = router;
