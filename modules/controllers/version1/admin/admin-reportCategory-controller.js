const Controller = require('../../controller');
const { validationResult } = require('express-validator');


class adminReportCategoryController extends Controller {

    index = (req, res) => {
        const page = req.query.page || 1;
        this.model.ReportCategory.paginate(
            {  },
            { page , limit : 10 , sort : { createdAt : -1 }}
        ).then(result => {
            if (!result){
                return res.json({
                    data : 'No categories found',
                    success : false,
                    status : 404
                })
            }

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success: true,
                status: 200
            })
        })
            .catch(err => {
                return res.json({
                    data : err,
                    success: false,
                    status: 500
                })
            })
    };

    single = (req , res) => {
        this.model.ReportCategory.findById(req.params.id , (err , result) => {
            if (err){
                return res.json({
                    data : 'no such category found',
                    success: false,
                    status: 404
                })
            }

            return res.json({
                data : result,
                success: true,
                status: 200
            })
        })
    };

    store = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        let category = new this.model.ReportCategory({
            user : req.user._id,
            label : req.body.label
        })

        category.save(err => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'The category has already registered on the site',
                        success : false,
                        status : 11000
                    })
                }
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            return res.json({
                data : 'Your category has been successfully registered.',
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


        this.model.ReportCategory.findByIdAndUpdate(req.params.id , {
            label : req.body.label,
        } , (err , category) => {
            if (err) {
                if (!category){
                    return res.json({
                        data : 'There is no such category',
                        success : false,
                        status : 404
                    })
                }

                return res.json({
                    data : 'Server error',
                    success : false,
                    status : 500
                })
            }
            return res.json({
                data : 'category has been successfully edited.',
                success : true,
                status : 201
            })
        })
    };

    destroy = (req , res) => {
        this.model.ReportCategory.findByIdAndRemove(req.params.id ,  (err , category) => {
            if (err) {
                if (!category){
                    return res.json({
                        data : 'There is no such category',
                        success : false,
                        status : 404
                    })
                }

                return res.json({
                    data : 'Server error',
                    success : false,
                    status : 500
                })
            }

            return res.json({
                data : 'category has been successfully deleted.',
                success : true,
                status : 200
            })
        })
    };


}


module.exports = new adminReportCategoryController();
