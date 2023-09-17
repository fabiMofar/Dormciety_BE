const Controller = require('../../controller');
const {validationResult} = require('express-validator');


class adminMemoController extends Controller {
    index = (req, res) => {
        const page = req.query.page || 1;
        const date = new Date();
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
            { deleted : false , },
            { page : page , limit : 10  ,  sort : { createdAt: -1 }  ,  populate }
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
        this.model.Memo.findById(req.params.id , (err , result) => {
            if (err)
                return res.json({
                    data : 'No such Memo found',
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
                    path : 'user',
                    select : 'firstname lastname'
                },
                {
                    path : 'dormitories',
                    select : 'name'
                }
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
        if(req.files.attachment){
            var attachments = req.files.attachments.map(image => image.path.replace(/\\/g , '/'));
        }


        let memo = new this.model.Memo({
            user : req.user._id,
            dormitories : req.body.dormitories,
            title : req.body.title,
            description : req.body.description,
            validFrom : req.body.validFrom,
            validUntil : req.body.validUntil,
            images : images,
            attachments : attachments
        })

        memo.save((err , memo) => {
            if (err)
                return res.json({
                    data : err,
                    success : false,
                    status : 500
                })

            return res.json({
                data : 'Your Memo has been successfully submitted.',
                success : true,
                status : 201
            })
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

        if(req.files.images){
            var images = req.files.images.map(image => image.path.replace(/\\/g , '/'));
        }
        if(req.files.attachment){
            var attachments = req.files.attachments.map(image => image.path.replace(/\\/g , '/'));
        }
        this.model.Memo.findByIdAndUpdate(req.params.id , {
            dormitories : req.body.dormitories,
            title : req.body.title,
            description : req.body.description,
            validFrom : req.body.validFrom,
            validUntil : req.body.validUntil,
            images : images,
            attachments : attachments
        } , (err , memo) => {
            if (err){
                if (!memo)
                    return res.json({
                        data : 'There is no such Memo',
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
                data : 'Memo has been successfully edited.',
                success : true,
                status : 200
            })
        })
    }

    destroy = (req, res) => {
        this.model.Memo.findByIdAndUpdate(req.params.id , {
            deleted : true,
        } , (err , memo) => {
            if (err){
                if (!memo)
                    return res.json({
                        data : 'There is no such Memo',
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
                data : 'Memo has been successfully deleted.',
                success : true,
                status : 200
            })
        })
    };

}

module.exports = new adminMemoController()
