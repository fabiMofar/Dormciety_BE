const Controller = require("../../controller");
const {validationResult} = require('express-validator');

class adminPartnerController extends Controller {
    index = (req, res) => {
        const page = req.query.page || 1;
        this.model.Employee.paginate(
            {
                deleted : false,
                partner : req.query.partner,
            } ,
            { page , limit : 400 , }
        ).then(employees => {

            return res.json({
                data : employees.docs,
                current_page : employees.page,
                pages : employees.pages,
                total : employees.total,
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

        let employee = new this.model.Employee({
            partner : req.body.partner_id,
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            title : req.body.title,
            email : req.body.email,
            mobile : req.body.mobile,
            meetingTime : req.body.meetingTime,
            link : req.body.link,
            bio : req.body.bio,
            avatar : image
        })

        employee.save(err => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'The employee has already registered on the site',
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
                data : 'Your employee has been successfully registered.',
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

        this.model.Employee.findByIdAndUpdate(req.params.id , {
            firstname : req.body.firtsname,
            lastname : req.body.lastname,
            email : req.body.email,
            mobile : req.body.mobile,
            meetingTime : req.body.meetingTime,
            bio : req.body.bio,
            link : req.body.link
        } , (err , role) => {
            if (err){
                if (!role){
                    return res.json({
                        data : 'there is no such Employee',
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
                data : 'Employee has been successfully edited',
                success: true,
                status : 200
            })
        })
    };

    destroy = (req , res) => {
        this.model.Employee.findByIdAndDelete(req.params.id , {
            deleted : true
        } , err => {
            if (err){
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            return res.json({
                data : 'Employee has been successfully deleted.',
                success: true,
                status : 200
            })
        })
    };
}


module.exports = new adminPartnerController();



