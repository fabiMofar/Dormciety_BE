const Controller = require('../../controller');
const {validationResult} = require('express-validator');
const fetch = require('node-fetch');

class studentShareRideController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        this.model.ShareRide.paginate(
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
        this.model.ShareRide.findById(req.params.id , (err , result) => {
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


        let shareRide = new this.model.ShareRide({
            student : req.student._id,
            dormitory : req.student.dormitory,
            locationFrom  : req.body.locationFrom.charAt(0).toUpperCase() + req.body.locationFrom.slice(1),
            locationTo : req.body.locationTo.charAt(0).toUpperCase() + req.body.locationTo.slice(1),
            sitCount : req.body.sitCount,
            description : req.body.description,
            smoke : req.body.smoke,
            animal : req.body.animal,
            baggage : req.body.baggage,
            departureDate : req.body.departureDate,
            departureTime : req.body.departureTime,
            price : req.body.price,
            freeSit : req.body.sitCount
        })

        shareRide.save((err , shareRide) => {
            if (err)
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })

            let feed = new this.model.Feed({
                shareRide : shareRide._id,
                dormitory : req.student.dormitory,
                student : req.student._id,
                type : 'shareRide',
            })

            feed.save((err , feed) => {
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
                    shareRide : shareRide._id,
                    date : shareRide.departureDate,
                    type : 'shareRide',
                    dotColor :'#6194c2'
                });

                calendar.save((err) => {
                    if (err)
                        return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        })

                    return res.json({
                        data : 'Your shareRide has been successfully submitted.',
                        success : true,
                        status : 201
                    })
                })
            });
        })

    };

    destroy = (req, res) => {
        this.model.ShareRide.findOneAndUpdate({_id : req.params.id , student : req.student._id }, {
            deleted : true,
            online : false
        } , (err , shareRide) => {
            if (err){
                if (!shareRide)
                    return res.json({
                        data : 'There is no such shareRide',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndRemove({shareRide : shareRide._id} , (err , feed) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                this.model.Favorite.deleteMany({feed : feed._id} , (err , ) => {
                    if (err)
                        return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        });
                    this.model.Calendar.deleteMany({ shareRide : shareRide._id} , (err) => {
                        if (err)
                            return res.json({
                                data : 'server error',
                                success : false,
                                status : 500
                            });

                        return res.json({
                            data : 'ShareRide has been successfully deleted.',
                            success : true,
                            status : 200
                        })
                    })

                })
            })
        })
    };

    // start Membership functions for shareRide =====>>>>>

    // get members of a shareRide
    members = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'guest',
                select : 'firstname lastname avatar'
            },
        ]
        this.model.ShareRideMember.paginate(
            { shareRide : req.query.shareRide_id},
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

    // register membership on a shareRide
    takeSit = async (req , res) => {
        try{
            const shareRide = await this.model.ShareRide.findById(req.body.shareRide_id).exec();
            const host = await this.model.Student.findById(shareRide.student).exec();
            const guest = await this.model.Student.findById(req.student._id).exec();
            const feed = await this.model.Feed.findOne({shareRide : shareRide._id}).exec();

            if (shareRide.student.equals(req.student._id))
                return res.json({
                    data : 'you have this shareRide created.',
                    success : false,
                    status : 202
                });
            let member = await this.model.ShareRideMember.findOne(
                { shareRide : req.body.shareRide_id , guest : req.student._id}
            ).exec();
            if (member)
                return res.json({
                    data : 'You have already submitted your request.',
                    success : false,
                    status : 202
                })


            let newMember = new this.model.ShareRideMember({
                shareRide : req.body.shareRide_id,
                host :shareRide.student,
                guest : req.student._id,
                status : 'waiting',
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
                    'title' : `Mitfahrgelegenheit: ${shareRide.locationFrom} nach ${shareRide.locationTo}`,
                    'body' : `${guest.firstname} ${guest.lastname} möchte mitfahren!`,
                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${host._id}`,
                    'notification' : notification,
                    'data': {
                        "shareRide" : shareRide._id,
                        "feed" : feed._id,
                        "type" : 'shareRide'
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
        }catch (err){
            return res.json({
                data : err,
                success : false,
                status : 500
            })
        }
    }

    //host manage guests with this Method
    manageMember = async (req , res) => {
        try {
            const shareRide = await this.model.ShareRide.findById(req.body.shareRide_id).exec();
            const host = await this.model.Student.findById(req.student._id).exec();
            const guest = await this.model.Student.findById(req.body.guest_id).exec();
            const feed = await this.model.Feed.findOne({ shareRide : shareRide._id})

            switch (req.body.status) {
                case 'reject' : {
                    let member = await this.model.ShareRideMember.findOne({
                        shareRide : req.body.shareRide_id,
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

                    //send Notification
                    var notification = {
                        'title' : `Mitfahrgelegenheit: ${shareRide.locationFrom} nach ${shareRide.locationTo}`,
                        'body' : `${host.firstname} ${host.lastname} hat deine Anfrage abgelehnt.`,
                    }

                    var notification_body = {
                        'to' : `/topics/pushNotification-${guest._id}`,
                        'notification' : notification,
                        'data': {
                            "shareRide" : shareRide._id,
                            "feed" : feed._id,
                            "type" : 'shareRide'
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
                    if (!shareRide)
                        return res.json({
                            data : 'shareRide not found',
                            success : false,
                            status : 404
                        })
                    if (0 < shareRide.freeSit && shareRide.freeSit <= shareRide.sitCount){
                        let member = await this.model.ShareRideMember.findOne({
                            shareRide : req.body.shareRide_id,
                            host : req.student._id,
                            guest : req.body.guest_id,
                        }).exec();

                        if (!member)
                            return res.json({
                                data : 'member not found',
                                success : false,
                                status : 404
                            })


                        member.status = 'accept'
                        await member.save();

                        shareRide.freeSit = shareRide.freeSit -1;
                        await shareRide.save();



                        //send Notification
                        var notification = {
                            'title' : `Mitfahrgelegenheit: ${shareRide.locationFrom} nach ${shareRide.locationTo}`,
                            'body' : `${host.firstname} ${host.lastname} hat deine Anfrage akzeptiert.`,
                        }

                        var notification_body = {
                            'to' : `/topics/pushNotification-${guest._id}`,
                            'notification' : notification,
                            'data': {
                                "shareRide" : shareRide._id,
                                "feed" : feed._id,
                                "type" : 'shareRide'
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
                    let member = await this.model.ShareRideMember.findOne({ shareRide : req.body.shareRide_id , guest : req.body.guest_id}).exec();
                    if (!member)
                        return res.json({
                            data : 'no member found',
                            success : false,
                            status : 404
                        });
                    if (!shareRide)
                        return res.json({
                            data : 'no shareRide found',
                            success : false,
                            status : 404
                        })
                    member.status = 'cancel'
                    shareRide.freeSit = shareRide.freeSit + 1;

                    await member.save();
                    await shareRide.save();

                    //send Notification
                    var notification = {
                        'title' :`Mitfahrgelegenheit: ${shareRide.locationFrom} nach ${shareRide.locationTo}`,
                        'body' : `${host.firstname} ${host.lastname} hat dich entfernt.`,
                    }

                    var notification_body = {
                        'to' : `/topics/pushNotification-${guest._id}`,
                        'notification' : notification,
                        'data': {
                            "shareRide" : shareRide._id,
                            "feed" : feed._id,
                            "type" : 'shareRide'
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
            let member = await this.model.ShareRideMember.findOne({ shareRide : req.body.shareRide_id , guest : req.student._id}).exec();
            let shareRide = await this.model.ShareRide.findById(req.body.shareRide_id).exec();
            const host = await this.model.Student.findById(shareRide.student).exec();
            const guest = await this.model.Student.findById(req.student._id).exec();
            const feed = await this.model.Feed.findOne({ shareRide : shareRide._id}).exec()

            if (!member)
                return res.json({
                    data : 'no member found',
                    success : false,
                    status : 404
                });
            if (!shareRide)
                return res.json({
                    data : 'no shareRide found',
                    success : false,
                    status : 404
                })
            member.status = 'cancel'
            shareRide.freeSit = shareRide.freeSit + 1;

            await member.save();
            await shareRide.save();
            //send Notification
            var notification = {
                'title' :`Mitfahrgelegenheit: ${shareRide.locationFrom} nach ${shareRide.locationTo}`,
                'body' : `${guest.firstname} ${guest.lastname} fährt  nicht mehr mit!`,
            }

            var notification_body = {
                'to' : `/topics/pushNotification-${host._id}`,
                'notification' : notification,
                'data': {
                    "shareRide" : shareRide._id,
                    "feed" : feed._id,
                    "type" : 'shareRide'
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

    // status of student Application
    applicationStatus = (req , res) => {
        this.model.ShareRideMember.findOne({
            shareRide : req.query.shareRide_id ,
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

module.exports = new studentShareRideController();
