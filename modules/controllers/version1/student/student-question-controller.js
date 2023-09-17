const Controller = require('../../controller');
const {validationResult} = require('express-validator');

class studentQuestionController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        this.model.Question.paginate(
            { deleted : false , online : true , dormitory: req.student.dormitory },
            { page : page , limit : 1000  ,  sort : { createdAt: -1 }  }
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
    }

    store = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        if (req.files){
            var images = req.files.map(image => image.path.replace(/\\/g , '/'));
        }

        let question = new this.model.Question({
            student : req.student._id,
            description  : req.body.description,
            images : images,
            dormitory : req.student.dormitory
        })

        question.save((err , question) => {
            if (err)
                return res.json({
                    data : 'operation failed',
                    success : false,
                    status : 500
                })

            this.storeAttachments(req.files)

            let feed = new this.model.Feed({
                question : question._id,
                dormitory : req.student.dormitory,
                student : req.student._id,
                type : 'question',

            })

            feed.save((err) => {
                if (err)
                    return res.json({
                        data : 'operation failed',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'Your question has been successfully submitted.',
                    success : true,
                    status : 201
                })
            });
        })

    };

    single = (req , res) => {
        this.model.Question.findById(req.params.id , (err , result) => {
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

    update = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        this.model.Question.findOneAndUpdate({_id : req.params.id , student : req.student._id } , {
            description : req.body.description
        } , (err , question) => {
            if (err){
                if (!question)
                    return res.json({
                        data : 'There is no such question',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'operation failed',
                    success : false,
                    status : 202
                })
            }

            return res.json({
                data : 'Your question has been successfully updated.',
                success : true,
                status : 201
            })

        })
    }

    destroy = (req, res) => {
        this.model.Question.findOneAndUpdate({_id : req.params.id , student : req.student._id } , {
            deleted : true,
            online : false
        } , (err , question) => {
            if (err){
                if (!question)
                    return res.json({
                        data : 'There is no such question',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'operation failed',
                    success : false,
                    status : 202
                })
            }

            this.model.Feed.findOneAndRemove({question : question._id} , (err , feed) => {
                if (err)
                    return res.json({
                        data : 'operation failed',
                        success : false,
                        status : 202
                    })
                this.model.Favorite.deleteMany({feed : feed._id} , (err) => {
                    if (err)
                        return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        })
                    return res.json({
                        data : 'question has been successfully deleted.',
                        success : true,
                        status : 200
                    })
                })
            })
        })
    };

    storeAttachments(files){
        if (files){
            files.map((file , index) => {
                const media = new this.model.Media({
                    url : file.path.replace(/\\/g , '/'),
                    type : file.mimetype,
                    size : file.size
                })

                media.save((err , media) => {
                    if (err) return console.log(err)
                });
            })
        }
    };

}

module.exports = new studentQuestionController();
