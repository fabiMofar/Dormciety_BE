const Controller = require('../../controller');
const {validationResult} = require('express-validator');
const fetch = require('node-fetch');

class studentCommentController extends Controller {

    questionComment = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'avatar firstname lastname'
            },
            {
                path : 'replays',
                populate : {
                    path : 'student',
                    select : 'avatar firstname lastname'
                }
            }
        ]
        this.model.Comment.paginate(
            {question : req.params.id , parent : null},
            { page : page , limit : 40  , populate }
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

    saleArticleComment = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname avatar'
            },
            {
                path : 'replays',
                populate : {
                    path : 'student',
                    select : 'avatar firstname lastname'
                }
            }
        ]
        this.model.Comment.paginate(
            { saleArticle : req.params.id , parent : null},
            { page : page , limit : 20  ,   populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No saleArticle found',
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

    experienceComment = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname avatar'
            },
            {
                path : 'replays',
                populate : {
                    path : 'student',
                    select : 'avatar firstname lastname'
                }
            }
        ]
        this.model.Comment.paginate(
            {  experience : req.params.id , parent : null},
            { page : page , limit : 20   ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No experience found',
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

    store = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        const comment = new this.model.Comment({
            student : req.student._id,
            ...req.body
        });

        comment.save(err => {
            if (err)
                return res.json({
                    data : 'Operation failed',
                    success : false,
                    status : 500
                })

            return res.json({
                data : 'your comment has been successfully submitted.',
                success : true,
                status : 201
            })
        })
    };

    mentions = async (req ,res) => {
        try {
            const mentions = await this.model.Student.find({ dormitory : req.student.dormitory}).select('firstname lastname').exec();
            res.json({
                data : mentions,
                success : true,
                status : 200
            })
        }catch (e) {
            console.log(e)
        }
    }

    storeCommentExperience = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.json({
                    errors: errors.array(),
                    success: false,
                    status : 422
                })
            }

            const experience = await this.model.Experience.findById(req.body.experience).populate('student').exec();
            const feed = await this.model.Feed.findOne({experience: experience._id}).exec();
            const student = await this.model.Student.findById(req.student._id).exec();


            const comment = new this.model.Comment({
                student : req.student._id,
                ...req.body
            });
            comment.save();

            if(req.body.parent){
                const parent = await this.model.Comment.findById(req.body.parent).populate('student').exec();
                if (parent.student._id.equals(req.student._id)){
                    return res.json({
                        data : 'your comment has been successfully submitted.',
                        success : true,
                        status : 201
                    })
                }
                var notification = {
                    'title' : `${student.firstname} ${student.lastname} hat kommentiert:`,
                    'body' : `${req.body.comment.substr(0, 30)}....`,

                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${parent.student._id}`,
                    'notification' : notification,
                    'data': {
                        "experience" : experience._id,
                        "feed" : feed._id,
                        "type" : 'experience'
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

            }else{
                var notification = {
                    'title' : `${student.firstname} ${student.lastname} hat kommentiert:`,
                    'body' : `${req.body.comment.substr(0, 30)}....`,

                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${experience.student._id}`,
                    'notification' : notification,
                    'data': {
                        "experience" : experience._id,
                        "feed" : feed._id,
                        "type" : 'experience'
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
            }



            return res.json({
                data : 'your comment has been successfully submitted.',
                success : true,
                status : 201
            })


        }catch (e) {
            return res.json({
                data : 'server error',
                success : false,
                status : 500
            })
        }

    }

    storeCommentQuestion = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.json({
                    errors: errors.array(),
                    success: false,
                    status : 422
                })
            }

            const question = await this.model.Question.findById(req.body.question).populate('student').exec();
            const feed = await this.model.Feed.findOne({ question: question._id}).exec();
            const student = await this.model.Student.findById(req.student._id).exec();

            const comment = new this.model.Comment({
                student : req.student._id,
                ...req.body
            });
            comment.save();

            if(req.body.parent){
                const parent = await this.model.Comment.findById(req.body.parent).populate('student').exec();
                if (parent.student._id.equals(req.student._id)){
                    return res.json({
                        data : 'your comment has been successfully submitted.',
                        success : true,
                        status : 201
                    })
                }

                var notification = {
                    'title' : `${student.firstname} ${student.lastname} hat kommentiert:`,
                    'body' : `${req.body.comment.substr(0, 30)}....`,

                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${parent.student._id}`,
                    'notification' : notification,
                    'data': {
                        "question" : question._id,
                        "feed" : feed._id,
                        "type" : 'question'
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

            }else{
                var notification = {
                    'title' : `${student.firstname} ${student.lastname} hat kommentiert:`,
                    'body' : `${req.body.comment.substr(0, 30)}....`,

                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${question.student._id}`,
                    'notification' : notification,
                    'data': {
                        "question" : question._id,
                        "feed" : feed._id,
                        "type" : 'question'
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
            }



            return res.json({
                data : 'your comment has been successfully submitted.',
                success : true,
                status : 201
            })

        }catch (e) {
            return res.json({
                data : 'server error',
                success : false,
                status : 500
            })
        }

    }

    storeCommentSaleArticle = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.json({
                    errors: errors.array(),
                    success: false,
                    status : 422
                })
            }

            const saleArticle = await this.model.SaleArticle.findById(req.body.saleArticle).populate('student').exec();
            const feed = await this.model.Feed.findOne({saleArticle: saleArticle._id}).exec();
            const student = await this.model.Student.findById(req.student._id).exec();

            const comment = new this.model.Comment({
                student : req.student._id,
                ...req.body
            });
            comment.save();

            if(req.body.parent){
                const parent = await this.model.Comment.findById(req.body.parent).populate('student').exec();
                if (parent.student._id.equals(req.student._id)){
                    return res.json({
                        data : 'your comment has been successfully submitted.',
                        success : true,
                        status : 201
                    })
                }

                var notification = {
                    'title' : `${student.firstname} ${student.lastname} hat kommentiert:`,
                    'body' : `${req.body.comment.substr(0, 30)}....`,

                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${parent.student._id}`,
                    'notification' : notification,
                    'data': {
                        "saleArticle" : saleArticle._id,
                        "feed" : feed._id,
                        "type" : 'saleArticle'
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

            }else{
                var notification = {
                    'title' : `${student.firstname} ${student.lastname} hat kommentiert:`,
                    'body' : `${req.body.comment.substr(0, 30)}....`,

                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${saleArticle.student._id}`,
                    'notification' : notification,
                    'data': {
                        "saleArticle" : saleArticle._id,
                        "feed" : feed._id,
                        "type" : 'saleArticle'
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
            }

            return res.json({
                data : 'your comment has been successfully submitted.',
                success : true,
                status : 201
            })

        }catch (e) {
            return res.json({
                data : 'server error',
                success : false,
                status : 500
            })
        }

    }

}


module.exports = new studentCommentController();
