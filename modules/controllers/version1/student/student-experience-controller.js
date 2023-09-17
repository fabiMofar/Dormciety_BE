const Controller = require('../../controller');
const {validationResult} = require('express-validator');

class studentExperienceController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        this.model.Experience.paginate(
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

    single = (req , res) => {
        this.model.Experience.findById(req.params.id , (err , result) => {
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

        if (req.files){
            var images = req.files.map(image => image.path.replace(/\\/g , '/'));
        }

        let experience = new this.model.Experience({
            student : req.student._id,
            description  : req.body.description,
            images : images,
            dormitory : req.student.dormitory
        });

        experience.save((err , experience) => {
            if (err)
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })


            this.storeAttachments(req.files);

            let feed = new this.model.Feed({
                experience : experience._id,
                dormitory : req.student.dormitory,
                student : req.student._id,
                type : 'experience',

            })

            feed.save((err) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'Your experience has been successfully submitted.',
                    success : true,
                    status : 201
                })
            });
        })
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

        this.model.Experience.findOneAndUpdate({_id : req.params.id , student : req.student._id } , {
            description : req.body.description
        } , (err , experience) => {
            if (err){
                if (!experience)
                    return res.json({
                        data : 'There is no such experience',
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
                data : 'Your experience has been successfully updated.',
                success : true,
                status : 201
            })

        })
    }

    destroy = (req, res) => {
        this.model.Experience.findOneAndUpdate({_id : req.params.id , student : req.student._id }, {
            deleted : true,
            online : false
        } , (err , experience) => {
            if (err){
                if (!experience)
                    return res.json({
                        data : 'There is no such experience',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndRemove({experience : experience._id} , (err , feed) => {
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
                    return res.json({
                        data : 'experience has been successfully deleted.',
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

module.exports = new studentExperienceController();
