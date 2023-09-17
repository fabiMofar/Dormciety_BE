const Controller = require("../../controller");
const {validationResult} = require('express-validator');

class adminRoleController extends Controller {
    index = (req, res) => {
        const page = req.query.page || 1;
        this.model.Role.paginate(
            {} ,
            { page , limit : 400 , populate : ('permissions')  }
        ).then(roles => {
            if (!roles){
                return res.json({
                    data : 'No roles found for display',
                    success : false,
                    status : 404
                })
            }

            return res.json({
                data : roles.docs,
                current_page : roles.page,
                pages : roles.pages,
                total : roles.total,
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

        let role = new this.model.Role({
            name : req.body.name,
            label : req.body.label,
            permissions : req.body.permissions
        })

        role.save(err => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'The role has already registered on the site',
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

            res.json({
                data : 'Your Role has been successfully registered.',
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

        this.model.Role.findByIdAndUpdate(req.params.id , {
            name : req.body.name,
            label : req.body.label,
            permissions : req.body.permissions,
        } , (err , role) => {
            if (err){
                if (!role){
                    return res.json({
                        data : 'there is no such Role',
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
                data : 'Role has been successfully edited',
                success: true,
                status : 200
            })
        })
    };

    destroy = (req , res) => {
        this.model.Role.findByIdAndDelete(req.params.id , err => {
            if (err){
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            return res.json({
                data : 'role has been successfully deleted.',
                success: true,
                status : 200
            })
        })
    };

    addRole = (req , res) => {
        this.model.User.findByIdAndUpdate(req.params.id , {
            roles : req.body.roles
        } , (err , user) => {
            if (!user)
                return res.json({
                    data : 'user not found',
                    success: false,
                    status : 404
                })
            if (err)
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })

            return res.json({
                data : 'success',
                success: true,
                status : 200
            })
        })
    }


}


module.exports = new adminRoleController();



