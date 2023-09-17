const Controller = require('../../controller');
const {validationResult} = require('express-validator');
const moment = require('moment');

class adminUserController extends Controller {
    index = ( req , res) => {
        const page = req.query.page || 1;
        const select = 'emailPrivate emailWork firstname lastname username mobile birthday title street houseNumber postalCode city sex organisation_name organisation_logo avatar'
        this.model.User.paginate(
            { deleted : false  } ,
            { page : page , limit : 400  ,  sort : { createdAt: -1 } , select  }
        ).then( users => {
            return res.json({
                data : users.docs,
                current_page : users.page,
                pages : users.pages,
                total : users.total,
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
        this.model.User.findById(req.params.id , (err, user) => {
            if (err){
                return res.json({
                    data : 'no such user found',
                    success: false,
                    status: 404
                })
            }
            return res.json({
                data : user,
                success: true,
                status: 200
            })
        })
    };

    update = (req, res) => {
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

        this.model.User.findByIdAndUpdate(req.params.id , {
            emailPrivate: req.body.emailPrivate,
            emailWork: req.body.emailWork,
            firstname: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
            lastname: req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1),
            username : req.body.username,
            mobile: req.body.mobile,
            birthday: moment(req.body.birthday).format('LL'),
            title : req.body.title.charAt(0).toUpperCase() + req.body.title.slice(1),
            street : req.body.street,
            houseNumber: req.body.houseNumber,
            postalCode : req.body.postalCode,
            city : req.body.city.charAt(0).toUpperCase() + req.body.city.slice(1),
            sex : req.body.sex,
            organisation_name : req.body.organisation_name.charAt(0).toUpperCase() + req.body.organisation_name.slice(1),
            organisation_logo : image,
            additional : req.body.additional,
        } , (err , user) => {
            if (err){
                if (!user){
                    return res.json({
                        data : 'There is no such user',
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
                data : 'user has been successfully edited.',
                success : true,
                status : 200
            })
        })
    };

    destroy = (req , res) => {
        this.model.User.findByIdAndUpdate(req.params.id , {
            deleted : true
        } , (err , user) => {
            if (err){
                if (!user){
                    return res.json({
                        data : 'There is no such user',
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
                data : 'user has been successfully deleted.',
                success : true,
                status : 200
            })
        })
    };

    profile = (req ,res) => {
        this.model.User.findById(req.user._id , (err, user) => {
            if (err){
                return res.json({
                    data : 'no such user found',
                    success: false,
                    status: 404
                })
            }
            return res.json({
                data : user,
                success: true,
                status: 200
            })
        })
    }

    updateProfile = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }


        this.model.User.findByIdAndUpdate(req.user._id , {
            emailPrivate: req.body.emailPrivate,
            mobile: req.body.mobile,
            street : req.body.street,
            houseNumber: req.body.houseNumber,
            postalCode : req.body.postalCode,
            city : req.body.city,
            birthday : req.body.birthday
        } , (err , user) => {
            if (err){
                if (!user){
                    return res.json({
                        data : 'There is no such user',
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
                data : 'Your Profile has been successfully edited.',
                success : true,
                status : 201
            })
        })
    };

    changeAvatar = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        if (req.file){
            var avatar = req.file.path.replace(/\\/g , '/');
        }

        this.model.User.findByIdAndUpdate(req.user._id , {
            avatar : avatar
        } , (err , user) => {
            if (err){
                if (!user){
                    return res.json({
                        data : 'There is no such user',
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
            };
            return res.json({
                data : 'Your Avatar has been successfully edited.',
                success : true,
                status : 201
            })
        })
    };

    toggleActiveUser = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }
        this.model.User.findByIdAndUpdate(req.params.id , {
            active : req.body.active
        } , (err , user) => {
            if (err){
                if (!user){
                    return res.json({
                        data : 'There is no such user',
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
    }
}




module.exports = new adminUserController();
