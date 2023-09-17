const Controller = require('../../controller');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const moment = require('moment');


class adminAuthController extends Controller {

    register = (req, res) => {

        // check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()){
           return res.json({
               errors: errors.array(),
               success: false,
               status : 422
           })
        }

        if(req.file){
            var image = req.file.path.replace(/\\/g , '/');
        }

        //hash password
        let salt = bcrypt.genSaltSync(15);
        let hash = bcrypt.hashSync(req.body.password, salt);

        let user = this.model.User({
            emailPrivate : req.body.emailPrivate,
            emailWork : req.body.emailWork,
            password : hash,
            firstname : req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
            lastname : req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1),
            username : req.body.username,
            mobile : req.body.mobile,
            birthday : moment(req.body.birthday).format('LL'),
            title : req.body.title.charAt(0).toUpperCase() + req.body.title.slice(1),
            additional : req.body.additional,
            street : req.body.street,
            houseNumber : req.body.houseNumber,
            postalCode : req.body.postalCode,
            city : req.body.city.charAt(0).toUpperCase() + req.body.city.slice(1),
            sex : req.body.sex,
            organisation_name : req.body.organisation_name.charAt(0).toUpperCase() + req.body.organisation_name.slice(1),
            organisation_logo : image
        });

        user.save((err, user) => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'The user with this profile has already registered on the site',
                        success : false,
                        status : 11000
                    })
                } else {
                    return res.json({
                        data : err,
                        success : false,
                        status : 500
                    })
                }
            };


            return res.json({
                data : user,
                success : true,
                status : 201
            })
        })
    };

    login = (req, res) => {

        // check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        this.model.User.findOne({
            username: req.body.username ,
            deleted : false ,
            active : true
        } ,  (err , user) => {
            if (user == null)
                return res.json({
                    data : 'No user with this profile was found',
                    success : false,
                    status : 404
                });

            bcrypt.compare(req.body.password , user.password , (err , status) => {
                if (!status)
                    return res.json({
                        data : 'The password entered is incorrect',
                        success : false,
                        status : 401
                    });

                let token = jwt.sign({ id : user.id} , config.secret);
                res.json({
                    data : user,
                    token : token,
                    success : true,
                    status : 200
                })
            })
        })
    };

    checkToken = (req, res) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token){
            return jwt.verify(token , config.secret , ((err, decoded) => {
                if (err){
                    return res.json({
                        data : 'User Not Found',
                        success : false,
                        status : 404
                    })
                }

                this.model.User.findById(decoded.id , (err , user) => {
                    if (err){
                        return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        })
                    }

                    return res.json({
                        data : user,
                        success : true,
                        status : 200
                    })
                }).populate('roles')
            }))
        }
    };



}


module.exports = new adminAuthController();
