const Controller = require('../../controller');
const {validationResult} = require('express-validator');
const moment = require('moment');


class adminStudentController extends Controller {
    index = ( req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'dormitory',
                select : 'name'
            },
            {
                path : 'city',
                select : 'name'
            }
        ]
        const select = 'verified council active firstname lastname email city dormitory image avatar'
        this.model.Student.paginate(
            { deleted : false  } ,
            { page : page , limit : 100000  ,  sort : { createdAt: -1 } , select , populate }
        ).then( result => {
            if ( !result ){
                return res.json({
                    data : 'No student found',
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
                    data : 'Server Error',
                    success: false,
                    status: 500
                })
            })
    };

    single = (req, res) => {
        this.model.Student.findById(req.params.id , (err, result) => {
            if (err){
                return res.json({
                    data : 'no such student found',
                    success: false,
                    status: 404
                })
            }
            return res.json({
                data : result,
                success: true,
                status: 200
            })
        }).populate([
            {
                path : 'dormitory',
                select : 'name'
            },
            {
                path : 'city',
                select : 'name'
            }
        ])
    };

    profile = (req , res) => {
        this.model.Profile.findOne({student : req.params.id}, (err, result) => {
            if (err){
                return res.json({
                    data : 'no such Profile found',
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
    }

    update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        this.model.Student.findByIdAndUpdate(req.params.id , {
            firstname: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
            lastname: req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1),
            email : req.body.email,
        } , (err , student) => {
            if (err){
                if (!student){
                    return res.json({
                        data : 'There is no such student',
                        success : false ,
                        status : 404
                    })
                }else {
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })
                }
            }

            return res.json({
                data : 'student has been successfully edited.',
                success : true,
                status : 200
            })
        })
    };

    destroy = (req , res) => {
        this.model.Student.findByIdAndUpdate(req.params.id , {
            deleted : true,
            active : false
        } , (err , student) => {
            if (err){
                if (!student){
                    return res.json({
                        data : 'There is no such student',
                        success : false ,
                        status : 404
                    })
                }else {
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })
                }
            }

            return res.json({
                data : 'student has been successfully deleted.',
                success : true,
                status : 200
            })
        })
    };

    toggleActiveUser = (req , res) => {
        this.model.Student.findByIdAndUpdate(req.params.id , {
            active : req.body.active
        } , (err , student) => {
            if (err){
                if (!student){
                    return res.json({
                        data : 'There is no such Student',
                        success : false ,
                        status : 404
                    })
                }else {
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })
                }
            }

            return res.json({
                data : 'Activity of user has been successfully edited.',
                success : true,
                status : 201
            })
        })
    };
}


module.exports = new adminStudentController();
