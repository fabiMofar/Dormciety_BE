const Controller = require('../../controller');
const {validationResult} = require('express-validator');

class adminEventController extends Controller {

    eventsOfStudents = (req, res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname'
            },
            {
                path : 'dormitory',
                select : 'name'
            }
        ]
        this.model.Event.paginate(
            { deleted : false , user : null },
            { page : page , limit : 10  ,  sort : { createdAt: -1 } ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No event found',
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

    eventsOfUser = (req, res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'user',
                select : 'firstname lastname'
            },
            {
                path : 'dormitory',
                select : 'name'
            }
        ]
        this.model.Event.paginate(
            { deleted : false , student : null },
            { page : page , limit : 10  ,  sort : { createdAt: -1 } ,  populate }
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

    single = (req , res) => {
        this.model.Event.findById(req.params.id , (err , result) => {
            if (err)
                return res.json({
                    data : 'No such event found',
                    success : false,
                    status : 404
                })

            return res.json({
                data : result,
                success : true,
                status : 200
            })
        }).populate(
            [
                {
                    path : 'student',
                    select : 'firstname lastname'
                },
                {
                    path : 'dormitory',
                    select : 'name'
                },
                {
                    path : 'user',
                    select : 'firstname lastname'
                },
            ]
        )
    };

    store = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        if(req.files.images){
            var images = req.files.images.map(image => image.path.replace(/\\/g , '/'));
        }
        if(req.files.attachments){
            var attachments = req.files.attachments.map(attachment => attachment.path.replace(/\\/g , '/'));
        }
        let event = new this.model.Event({
            user : req.user._id,
            dormitory : req.body.dormitory_id,
            title  : req.body.title,
            participantCount : req.body.participantCount,
            freeCount : req.body.participantCount,
            description : req.body.description,
            withAuthorize : req.body.withAuthorize,
            eventLink : req.body.eventLink,
            showEventLink : req.body.showEventLink,
            eventDate : req.body.eventDate,
            eventTime : req.body.eventTime,
            entryPrice : req.body.entryPrice,
            type : req.body.type,
            location : req.body.location,
            showLocation : req.body.showLocation,
            images : images,
        })

        event.save((err , event) => {
            if (err)
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })


            let feed = new this.model.Feed({
                event : event._id,
                dormitory : event.dormitory,
                type : 'admin-event'
            })

            feed.save((err , feed) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                let calendar = new this.model.Calendar({
                    feed : feed._id,
                    dormitory : req.body.dormitory_id,
                    event : event._id,
                    date : event.eventDate,
                    type : 'admin-event',
                    dotColor :'#ff977a'
                });
                calendar.save((err) => {
                    if (err)
                        return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        })

                    return res.json({
                        data : 'Your event has been successfully submitted.',
                        success : true,
                        status : 201
                    })
                })

            });
        })

    };

    destroy = (req, res) => {
        this.model.Event.findByIdAndUpdate( req.params.id , {
            deleted : true,
            online : false
        } , (err , event) => {
            if (err){
                if (!event)
                    return res.json({
                        data : 'There is no such event',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndRemove({event : event._id} , (err , feed) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                this.model.Favorite.deleteMany({feed : feed._id} , (err) => {
                    if (err)
                        return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        })
                    this.model.Calendar.deleteMany({ event : event._id} , (err) => {
                        if (err)
                            return res.json({
                                data : 'server error',
                                success : false,
                                status : 500
                            });

                        return res.json({
                            data : 'event has been successfully deleted.',
                            success : true,
                            status : 200
                        })
                    })
                })
            })
        })
    };

    toggleOnline = (req , res) => {
        this.model.Event.findByIdAndUpdate( req.params.id , {
            online : req.body.online,
        } , (err , event) => {
            if (err){
                if (!event)
                    return res.json({
                        data : 'There is no such event',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndUpdate({ event : event._id} , {
                online : req.body.online,
            } ,(err) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'event has been successfully edited.',
                    success : true,
                    status : 200
                })
            })
        })
    };

    members = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'guest',
                select : 'firstname lastname avatar'
            },
        ]
        this.model.EventMember.paginate(
            { event : req.params.id },
            { page : page , limit : 10  ,  sort : { createdAt: -1 } ,  populate }
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

module.exports = new adminEventController();
