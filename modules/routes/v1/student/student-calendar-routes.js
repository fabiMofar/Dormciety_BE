const express = require('express');
const router = express.Router();


//controller
const studentCalendarController = require('../../../controllers/version1/student/student-calendar-controller');


router.get(
    '/',
    studentCalendarController.index
);

router.get(
    '/check-event',
    studentCalendarController.checkEvent
)




module.exports = router
