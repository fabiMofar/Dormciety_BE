const Controller = require("../../controller");
const {validationResult} = require('express-validator');

class adminPartnerController extends Controller {
    index = (req, res) => {
        const page = req.query.page || 1;
        this.model.Partner.paginate(
            {
                deleted : false ,

            },
            { page , limit : 400 , populate : ('dormitories') }
        ).then(partners => {
            if (!partners){
                return res.json({
                    data : 'No Partner found for display',
                    success : false,
                    status : 404
                })
            }

            return res.json({
                data : partners.docs,
                current_page : partners.page,
                pages : partners.pages,
                total : partners.total,
                success : true,
                status : 200
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

        if (req.file){
            var image = req.file.path.replace(/\\/g , '/');
        }



        let partner = new this.model.Partner({
            dormitories : req.body.dormitories,
            name : req.body.name,
            logo : image
        })

        partner.save(err => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'The partner has already registered on the site',
                        success : false,
                        status : 11000
                    })
                }


                return res.json({
                    data : err,
                    success : false,
                    status : 500
                })
            }

            res.json({
                data : 'Your partner has been successfully registered.',
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

        this.model.Partner.findByIdAndUpdate(req.params.id , {
            name : req.body.name,
        } , (err , role) => {
            if (err){
                if (!role){
                    return res.json({
                        data : 'there is no such Partner',
                        success: false,
                        status: 404
                    })
                }

                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            return res.json({
                data : 'Partner has been successfully edited',
                success: true,
                status : 200
            })
        })
    };

    destroy = (req , res) => {
        this.model.Partner.findByIdAndRemove(req.params.id  , (err) => {
            if (err){
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            this.model.Employee.deleteMany({partner : req.params.id} , (err) => {
                if (err){
                    return res.json({
                        data : 'server error',
                        success: false,
                        status : 500
                    })
                }
                return res.json({
                    data : 'Partner has been successfully deleted.',
                    success: true,
                    status : 200
                })
            })
        })
    };
}


module.exports = new adminPartnerController();



