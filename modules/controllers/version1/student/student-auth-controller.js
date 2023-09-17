const Controller = require('../../controller');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const mail = require('./../../../helpers/mail');

class studentAuthController extends Controller {

    register = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        //hash password
        let salt = bcrypt.genSaltSync(15);
        let hash = bcrypt.hashSync(req.body.password, salt);



        let student = this.model.Student({
            firstname: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
            lastname : req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1),
            email : req.body.email,
            password : hash,
            city : req.body.city_id,
            dormitory : req.body.dormitory_id
        });

        student.save((err , student) => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'Diese E-Mail-Adresse wird schon von einem anderen Nutzer verwendet.',
                        success : false,
                        status : 11000
                    })
                }else {
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })
                }
            };

            // send mail with defined transport object


            //Create Profile of this Student
            let profile = new this.model.Profile({
                student : student._id,
                birthday : req.body.birthday
            });
            profile.save();

            //Create Token for Login
            let token = jwt.sign({id : student.id } , config.secret);

            //finish Register Process and return this student
            return res.json({
                data : student,
                token : token,
                success : true,
                status : 201
            })
        })
    };

    login = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        this.model.Student.findOne({email : req.body.email , deleted : false , active : true} , (err , student) => {
            if (student === null)
                return res.json({
                    data : 'Deine Zugangsdaten stimmen nicht. Bitte versuche es nochmal',
                    success: false,
                    status : 404
                })

            bcrypt.compare(req.body.password, student.password , (err , status) => {
                if (!status)
                    return res.json({
                        data : 'Deine Zugangsdaten stimmen nicht. Bitte versuche es nochmal',
                        success : false,
                        status : 401
                    })

                let token = jwt.sign({id : student.id} , config.secret);
                return res.json({
                    data : student,
                    token : token,
                    success : true,
                    status : 200
                })
            })
        }).populate([
            {
                path : 'status',
                select : 'symbol',
                populate : {
                    path : 'symbol',
                    select : 'symbol',
                }
            },
            {
                path : 'dormitory',
                populate : {
                    path : 'city',
                    select : 'name',
                }
            },
        ])
    };

    checkToken = (req ,res ) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token){
            return jwt.verify(token , config.secret , ((err, decoded) => {
                if (err){
                    return res.json({
                        data : 'Student Not Found',
                        success : false,
                        status : 404
                    })
                }

                this.model.Student.findOne({_id : decoded.id , deleted : false , active : true} , (err , student) => {
                    if (!student){
                        return res.json({
                            data : 'Student Not Found',
                            success : false,
                            status : 404
                        })
                    }
                    if (err){
                        return res.json({
                            data : 'Student Not Found',
                            success : false,
                            status : 404
                        })
                    }

                    return res.json({
                        data : student,
                        success : true,
                        status : 200
                    })
                }).populate([
                    {
                        path : 'status',
                        select : 'symbol',
                        populate : {
                            path : 'symbol',
                            select : 'symbol',
                        }
                    },
                    {
                        path : 'dormitory',
                        populate : {
                            path : 'city',
                            select : 'name',
                        }
                    },
                ])
            }))
        }
    };

    delete = async ( req , res) => {
        try{
            const student = await this.model.Student.findOne({email : req.body.email}).exec();
            if (!student){
                return res.json({
                    data : 'student not found',
                    success : false,
                    status : 404
                })
            }
            bcrypt.compare(req.body.password, student.password , (err , status) => {
                if (!status)
                    return res.json({
                        data : 'The password entered is incorrect',
                        success : false,
                        status : 401
                    })
            })

            student.deleted = true;
            student.active = false;
            student.deleted_reason = req.body.deleted_reason;

            await student.save((err) => {
                return res.json({
                    data : 'student has been successfully deleted',
                    success: true,
                    status : 200
                })
            });


        }catch (e){
            return res.json({
                data : 'server Error',
                success: false,
                status : 500
            })
        }
    };

    getStudent = (req , res) => {
        this.model.Student.findById(req.student._id, (err, result) => {
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
                path : 'status',
                select : 'symbol',
                populate : {
                    path : 'symbol',
                    select : 'symbol',
                }
            },
            {
                path : 'dormitory',
                populate : {
                    path : 'city',
                    select : 'name',
                }
            },
        ])
    }
}


module.exports = new studentAuthController()
