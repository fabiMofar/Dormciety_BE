const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class studentFeedController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'event',
                select : 'showEventLink withAuthorize images attachments showLocation title participantCount student description eventDate eventLink eventTime entryPrice type location',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
            {
                path : 'saleArticle',
                select : 'negotiable sold images student title description price ',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar images'
                }
            } ,
            {
                path : 'shareRide',
                select : 'smoke animal baggage student locationFrom locationTo sitCount description departureDate departureTime price freeSit ',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
            {
                path : 'question',
                select : 'images student description',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
            {
                path : 'experience',
                select : 'images student description',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
            {
                path : 'advertise',
                populate : {
                    path : 'partner',
                    select : 'name logo'
                }
            } ,
        ]
        this.model.Feed.paginate(
            {
                online : true,
                dormitory: req.student.dormitory
            },
            { page : page  , limit  : 10000,  sort : { createdAt: -1 } , populate }
        ).then( (result) => {

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    };

    experiences = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'experience',
                select : 'images student description',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
        ]
        this.model.Feed.paginate(
            {
                online : true,
                dormitory: req.student.dormitory,
                experience : { $exists: true }
            },
            { page : page  , limit  : 10000,  sort : { createdAt: -1 } , populate }
        ).then( (result) => {

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    };

    questions = (req , res) => {
        const page = req.query.page || 1;
        const populate = [

            {
                path : 'question',
                select : 'images student description',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
        ]
        this.model.Feed.paginate(
            {
                online : true,
                dormitory: req.student.dormitory,
                question : { $exists: true }
            },
            { page : page  , limit  : 10000,  sort : { createdAt: -1 } , populate }
        ).then( (result) => {

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    }

    events = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'event',
                select : 'showEventLink withAuthorize images attachments showLocation title participantCount student description eventDate eventLink eventTime entryPrice type location',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
        ]
        this.model.Feed.paginate(
            {
                online : true,
                dormitory: req.student.dormitory,
                event : { $exists: true }
            },
            { page : page  , limit  : 10000,  sort : { createdAt: -1 } , populate }
        ).then( (result) => {

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    }

    shareRides = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'shareRide',
                select : 'smoke animal baggage student locationFrom locationTo sitCount description departureDate departureTime price freeSit ',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
        ]
        this.model.Feed.paginate(
            {
                online : true,
                dormitory: req.student.dormitory,
                shareRide : { $exists: true }
            },
            { page : page  , limit  : 10000,  sort : { createdAt: -1 } , populate }
        ).then( (result) => {

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    }

    saleArticles = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'saleArticle',
                select : 'negotiable sold images student title description price ',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar images'
                }
            } ,
        ]
        this.model.Feed.paginate(
            {
                online : true,
                dormitory: req.student.dormitory,
                saleArticle : { $exists: true }
            },
            { page : page  , limit  : 10000,  sort : { createdAt: -1 } , populate }
        ).then( (result) => {

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    }

    memos = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'user',
                select : 'firstname lastname'
            },
            {
                path : 'dormitories',
                select : 'name'
            }
        ]
        this.model.Memo.paginate(
            { deleted : false },
            { page : page , limit : 10  ,  sort : { createdAt: -1 }  ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No Memo found',
                    success : false,
                    status : 404
                })

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    };

    myFeeds = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'event',
                select : 'showEventLink withAuthorize images attachments showLocation title participantCount student description eventDate eventTime entryPrice type',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
            {
                path : 'saleArticle',
                select : 'negotiable sold images student title description price ',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
            {
                path : 'shareRide',
                select : 'smoke animal baggage student locationFrom locationTo sitCount description departureDate departureTime price freeSit ',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
            {
                path : 'question',
                select : 'images student description',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
            {
                path : 'experience',
                select : 'images student description',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            } ,
        ]
        this.model.Feed.paginate(
            {  online : true , student : req.student._id},
            { page : page  ,  sort : { createdAt: -1 } , populate }
        ).then( (result) => {

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    }



}

module.exports = new studentFeedController();
