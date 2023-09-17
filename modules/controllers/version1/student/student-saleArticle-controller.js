const Controller = require('../../controller');
const {validationResult} = require('express-validator');


class studentSaleArticleController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        this.model.SaleArticle.paginate(
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
        this.model.SaleArticle.findById(req.params.id , (err , result) => {
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

        let saleArticle = new this.model.SaleArticle({
            student : req.student._id,
            dormitory : req.student.dormitory,
            title : req.body.title,
            description  : req.body.description,
            price : req.body.price,
            negotiable : req.body.negotiable,
            images : images,
        })

        saleArticle.save((err , article) => {
            if (err)
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })

            this.storeAttachments(req.files)

            let feed = new this.model.Feed({
                saleArticle : article._id,
                dormitory : req.student.dormitory,
                student : req.student._id,
                type : 'saleArticle',
            })

            feed.save((err) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'Your saleArticle has been successfully submitted.',
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
        this.model.SaleArticle.findOneAndUpdate({_id : req.params.id , student : req.student._id }, {
            title : req.body.title,
            description  : req.body.description,
            price : req.body.price,
            negotiable : req.body.negotiable,

        } , (err , article) => {
            if (err){
                if (!article)
                    return res.json({
                        data : 'There is no such saleArticle',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            return res.json({
                data : 'sale article has been successfully updated.',
                success : true,
                status : 201
            })


        })
    }

    destroy = (req, res) => {
        this.model.SaleArticle.findOneAndUpdate({_id : req.params.id , student : req.student._id }, {
            deleted : true,
            online : false
        } , (err , article) => {
            if (err){
                if (!article)
                    return res.json({
                        data : 'There is no such saleArticle',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndRemove({saleArticle : article._id} , (err , feed) => {
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
                        data : 'sale article has been successfully deleted.',
                        success : true,
                        status : 200
                    })
                })
            })
        })
    }

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


module.exports = new studentSaleArticleController();
