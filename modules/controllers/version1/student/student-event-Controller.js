const Controller = require('../../controller');
const {validationResult} = require('express-validator');
const fetch = require('node-fetch');

class studentEventController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        this.model.Event.paginate(
            { deleted : false , online : true , dormitory: req.student.dormitory },
            { page : page , limit : 1000  ,  sort : { createdAt: -1 }  }
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
                    select : 'firstname lastname avatar'
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

        let event = new this.model.Event({
            student : req.student._id,
            dormitory : req.student.dormitory,
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
                dormitory : req.student.dormitory,
                student : req.student._id,
                type : 'student-event'
            })

            feed.save((err ,feed) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                let calendar = new this.model.Calendar({
                    student : req.student._id,
                    dormitory : req.student.dormitory,
                    feed : feed._id,
                    event : event._id,
                    date : event.eventDate,
                    type : 'student-event',
                    dotColor : '#1b6573'
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
        this.model.Event.findOneAndUpdate({_id : req.params.id , student : req.student._id } , {
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
                            })

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


    // start Membership functions for shareRide =====>>>>>

    // get members of an Event
    members = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'guest',
                select : 'firstname lastname avatar'
            },
        ]
        this.model.EventMember.paginate(
            { event : req.query.event_id},
            { page : page , limit : 20  ,  sort : { createdAt: -1 } ,  populate }
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

    // register membership on an Event
    takeSit = async (req , res) => {
        try{
            const event  = await this.model.Event.findById(req.body.event_id).exec();
            const host = await this.model.Student.findById(event.student).exec();
            const guest = await this.model.Student.findById(req.student._id).exec();
            const feed = await this.model.Feed.findOne({event : event._id}).exec();

            // check event
            if (!event)
                return res.json({
                    data : 'event not found',
                    success : false,
                    status : 404
                })


            // host can not join!
            if (event.student && event.student.equals(req.student._id))
                return res.json({
                    data : 'you created this Event .',
                    success : false,
                    status : 202
                });


            //student did joined?

            let member = await this.model.EventMember.findOne({ event : req.body.event_id , guest : req.student._id}).exec();

            if (member)
                return res.json({
                    data : 'You have already submitted your request.',
                    success : false,
                    status : 202
                })


            // event with authorize

            if (event.withAuthorize === true){
                let newMember = new this.model.EventMember({
                    event : req.body.event_id,
                    host : event.student,
                    guest : req.student._id,
                    status : 'waiting'
                })

                newMember.save(err => {
                    if (err)
                        return res.json({
                            data : err,
                            success : false,
                            status : 500
                        })

                    //send Notification
                    var notification = {
                        'title' : `${event.title}`,
                        'body' : `${guest.firstname} ${guest.lastname} möchte an deiner Veranstaltung teilnehmen.`,
                    }

                    var notification_body = {
                        'to' : `/topics/pushNotification-${host._id}`,
                        'notification' : notification,
                        'data': {
                            "student_event" : event._id,
                            "feed" : feed._id,
                            "type" : 'student-event'
                        }

                    }

                    fetch('https://fcm.googleapis.com/fcm/send' , {
                        'method' : 'POST',
                        'headers' : {
                            'Authorization' : `key=${config.pushNotificationServerKey}`,
                            'Content-Type':'application/json'
                        },
                        'body' : JSON.stringify(notification_body)
                    }).then(() => {
                        console.log('success')
                    }).catch((err) => {
                        console.log(err)
                    })


                    return res.json({
                        data : 'membership application submitted',
                        success : true,
                        status : 201
                    })
                })
            }else {
                //event without authorize
                //check free count
                if (0 < event.freeCount && event.freeCount <= event.participantCount){


                    event.freeCount = event.freeCount - 1;
                    await event.save();


                    let newMember = new this.model.EventMember({
                        event : req.body.event_id,
                        host : event.student,
                        guest : req.student._id,
                        status : 'accept'
                    })

                    newMember.save(err => {
                        if (err)
                            return res.json({
                                data : err,
                                success : false,
                                status : 500
                            })

                        //send Notification
                        var notification = {
                            'title' :  `${event.title}`,
                            'body' : `${guest.firstname} ${guest.lastname} hat an deiner Veranstaltung teilgenommen.`,
                        }

                        var notification_body = {
                            'to' : `/topics/pushNotification-${host._id}`,
                            'notification' : notification,
                            'data': {
                                "student_event" : event._id,
                                "feed" : feed._id,
                                "type" : 'student-event'
                            }
                        }

                        fetch('https://fcm.googleapis.com/fcm/send' , {
                            'method' : 'POST',
                            'headers' : {
                                'Authorization' : `key=${config.pushNotificationServerKey}`,
                                'Content-Type':'application/json'
                            },
                            'body' : JSON.stringify(notification_body)
                        }).then(() => {
                            console.log('success')
                        }).catch((err) => {
                            console.log(err)
                        })

                        return res.json({
                            data : 'membership application submitted',
                            success : true,
                            status : 201
                        })
                    })
                }else{

                    //capacity is full
                    return res.json({
                        data : 'capacity is full',
                        success : false,
                        status : 202
                    })
                }
            }
        }catch (err){
            return res.json({
                data : err,
                success : false,
                status : 500
            })
        }
    };

    // register membership on an Admin Event
    takeSitAdminEvent = async (req , res) => {
        try{
            let event = await this.model.Event.findById(req.body.event_id).exec();

            //check event
            if (!event)
                return res.json({
                    data : 'event not found',
                    success : false,
                    status : 404
                })


            // member did joined?
            let member = await this.model.EventMember.findOne(
                { event : req.body.event_id , guest : req.student._id}
            ).exec();
            if (member)
                return res.json({
                    data : 'You have already submitted your request.',
                    success : false,
                    status : 202
                })


            // join to Event
            if (0 < event.freeCount && event.freeCount <= event.participantCount){

                event.freeCount = event.freeCount -1;
                await event.save();

                let newMember = new this.model.EventMember({
                    event : req.body.event_id,
                    host : event.user._id,
                    guest : req.student._id,
                    status : 'accept',
                })
                newMember.save(err => {
                    if (err)
                        return res.json({
                            data : err,
                            success : false,
                            status : 500
                        })
                    return res.json({
                        data : 'membership application submitted',
                        success : true,
                        status : 201
                    })
                })
            }

        }catch (err){
            return res.json({
                data : err,
                success : false,
                status : 500
            })
        }
    };

    //host manage guests with this Method
    manageMember = async (req , res) => {
        try {
            const event = await this.model.Event.findById(req.body.event_id).exec();
            const host = await this.model.Student.findById(req.student._id).exec();
            const guest = await this.model.Student.findById(req.body.guest_id).exec();
            const feed = await this.model.Feed.findOne({event : event._id}).exec()

            switch (req.body.status) {
                case 'reject' : {
                    let member = await this.model.EventMember.findOne({
                        event : req.body.event_id,
                        host : req.student._id,
                        guest : req.body.guest_id
                    }).exec();
                    if (!member)
                        return res.json({
                            data : 'no member found',
                            success : false,
                            status : 404
                        })

                    member.status = 'reject';
                    await member.save();

                    ///email ^^ notification ^^ chat
                    //send Notification
                    var notification = {
                        'title' :  `${event.title}`,
                        'body' : `${host.firstname} ${host.lastname} hat deine Anfrage abgelehnt.`,
                    }

                    var notification_body = {
                        'to' : `/topics/pushNotification-${guest._id}`,
                        'notification' : notification,
                        'data': {
                            "student_event" : event._id,
                            "feed" : feed._id,
                            "type" : 'student-event'
                        }
                    }

                    fetch('https://fcm.googleapis.com/fcm/send' , {
                        'method' : 'POST',
                        'headers' : {
                            'Authorization' : `key=${config.pushNotificationServerKey}`,
                            'Content-Type':'application/json'
                        },
                        'body' : JSON.stringify(notification_body)
                    }).then(() => {
                        console.log('success')
                    }).catch((err) => {
                        console.log(err)
                    })

                    return res.json({
                        data : 'The Application was successfully rejected',
                        success : true,
                        status : 201
                    })
                }
                    break;

                case 'accept' : {

                    //check event
                    if (!event)
                        return res.json({
                            data : 'event not found',
                            success : false,
                            status : 404
                        })

                    // join to Event
                    if (0 < event.freeCount && event.freeCount <= event.participantCount){
                        let member = await this.model.EventMember.findOne({
                            event : req.body.event_id,
                            host : req.student._id,
                            guest : req.body.guest_id,
                        }).exec();

                        //check the member
                        if (!member)
                            return res.json({
                                data : 'member not found',
                                success : false,
                                status : 404
                            })


                        member.status = 'accept'
                        await member.save();

                        event.freeCount = event.freeCount -1;
                        await event.save();


                        //send Notification
                        var notification = {
                            'title' :  `${event.title}`,
                            'body' : `${host.firstname} ${host.lastname} hat deine Anfrage akzeptiert.`,
                        }

                        var notification_body = {
                            'to' : `/topics/pushNotification-${guest._id}`,
                            'notification' : notification,
                            'data': {
                                "student_event" : event._id,
                                "feed" : feed._id,
                                "type" : 'student-event'
                            }
                        }

                        fetch('https://fcm.googleapis.com/fcm/send' , {
                            'method' : 'POST',
                            'headers' : {
                                'Authorization' : `key=${config.pushNotificationServerKey}`,
                                'Content-Type':'application/json'
                            },
                            'body' : JSON.stringify(notification_body)
                        }).then(() => {
                            console.log('success')
                        }).catch((err) => {
                            console.log(err)
                        })



                        return res.json({
                            data : 'The Application was successfully accepted.',
                            success : true,
                            status : 201
                        })
                    }else {
                        return res.json({
                            data : 'The capacity is full',
                            success : false,
                            status : 202
                        })
                    }
                }
                    break;

                case  'cancel' : {
                    let member = await this.model.EventMember.findOne({ event : req.body.event_id , guest : req.body.guest_id}).exec();
                    let event = await this.model.Event.findById(req.body.event_id).exec();

                    //check member
                    if (!member)
                        return res.json({
                            data : 'no member found',
                            success : false,
                            status : 404
                        });

                    //check event
                    if (!event)
                        return res.json({
                            data : 'no event found',
                            success : false,
                            status : 404
                        })
                    member.status = 'cancel'
                    event.freeSit = event.freeSit + 1;

                    await member.save();
                    await event.save();

                    //send Notification
                    var notification = {
                        'title' : `${event.title}`,
                        'body' : `${host.firstname} ${host.lastname} hat dich entfernt!`,
                    }

                    var notification_body = {
                        'to' : `/topics/pushNotification-${guest._id}`,
                        'notification' : notification,
                        'data': {
                            "student_event" : event._id,
                            "feed" : feed._id,
                            "type" : 'student-event'
                        }
                    }

                    fetch('https://fcm.googleapis.com/fcm/send' , {
                        'method' : 'POST',
                        'headers' : {
                            'Authorization' : `key=${config.pushNotificationServerKey}`,
                            'Content-Type':'application/json'
                        },
                        'body' : JSON.stringify(notification_body)
                    }).then(() => {
                        console.log('success')
                    }).catch((err) => {
                        console.log(err)
                    })

                    return res.json({
                        data : 'Membership canceled',
                        success : true,
                        status : 201
                    })
                }
                    break;
                default : {
                    return  res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })
                }
            }

        }catch (e) {
            console.log(e)
        }
    };

    // guest cancel Application with this method
    cancelApplication = async (req , res) => {
        try {
            const member = await this.model.EventMember.findOne({ event : req.body.event_id , guest : req.student._id}).exec();
            const event = await this.model.Event.findById(req.body.event_id).exec();
            const host = await this.model.Student.findById(event.student).exec();
            const guest = await this.model.Student.findById(req.student._id).exec();
            const feed = await this.model.Feed.findOne({ event : event._id}).exec();

            //check member
            if (!member)
                return res.json({
                    data : 'no member found',
                    success : false,
                    status : 404
                });

            //check event
            if (!event)
                return res.json({
                    data : 'no event found',
                    success : false,
                    status : 404
                })

            member.status = 'cancel'
            event.freeCount = event.freeCount + 1;

            await member.save();
            await event.save();

            //send Notification
            var notification = {
                'title' :  `${event.title}`,
                'body' : `${guest.firstname} ${guest.lastname} nimmt doch nicht teil.`,
            }

            var notification_body = {
                'to' : `/topics/pushNotification-${host._id}`,
                'notification' : notification,
                'data': {
                    "student_event" : event._id,
                    "feed" : feed._id,
                    "type" : 'student-event'
                }
            }

            fetch('https://fcm.googleapis.com/fcm/send' , {
                'method' : 'POST',
                'headers' : {
                    'Authorization' : `key=${config.pushNotificationServerKey}`,
                    'Content-Type':'application/json'
                },
                'body' : JSON.stringify(notification_body)
            }).then(() => {
                console.log('success')
            }).catch((err) => {
                console.log(err)
            })

            return res.json({
                data : 'Membership canceled',
                success : true,
                status : 201
            })


        }catch (e) {
            return res.status({
                data : 'server Error',
                success : false,
                status : 500
            })
        }
    };

    //guest cancel Application of admin event with this Route
    cancelApplicationAdminEvent = async (req , res) => {
        try {
            const member = await this.model.EventMember.findOne({ event : req.body.event_id , guest : req.student._id}).exec();
            const event = await this.model.Event.findById(req.body.event_id).exec();

            //check member
            if (!member)
                return res.json({
                    data : 'no member found',
                    success : false,
                    status : 404
                });

            //check event
            if (!event)
                return res.json({
                    data : 'no event found',
                    success : false,
                    status : 404
                })

            member.status = 'cancel'
            event.freeCount = event.freeCount + 1;

            await member.save();
            await event.save();

            return res.json({
                data : 'Membership canceled',
                success : true,
                status : 201
            })


        }catch (e) {
            return res.status({
                data : 'server Error',
                success : false,
                status : 500
            })
        }
    }

    // status of student Application
    applicationStatus = (req , res) => {
        this.model.EventMember.findOne({
            event : req.query.event_id ,
            guest : req.student._id
        } , (err , member) => {
            if (!member){
                return res.json({
                    data : null,
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : member,
                success : true,
                status : 200
            })
        })
    };

}

module.exports = new studentEventController();
