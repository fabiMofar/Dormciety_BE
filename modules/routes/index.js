const express = require('express');
const router = express.Router();
const v1Routes = require('./v1/index');
const v2Routes = require('./v2/index');


router.get('/', function(req, res){
    res.json('welcome to Api Routes')
});

router.use('/v1' , v1Routes);
router.use('/v2' , v2Routes);


module.exports = router;
