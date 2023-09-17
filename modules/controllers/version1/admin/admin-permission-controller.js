const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class adminPermissionController extends Controller {
    index = (req, res) => {
        const page = req.query.page || 1;
        this.model.Permission.paginate(
            {} ,
            { page , limit : 150 }
        ).then(permissions => {

            return res.json({
                data : permissions.docs,
                current_page : permissions.page,
                pages : permissions.pages,
                total : permissions.total,
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

        let permission = new this.model.Permission({
            name : req.body.name,
            label : req.body.label,
        })

        permission.save(err => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'The permission has already registered on the site',
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
                data : 'Your permission has been successfully registered.',
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

        this.model.Permission.findByIdAndUpdate(req.params.id , {
            name : req.body.name,
            label : req.body.label,
        } , (err , permission) => {
            if (err){
                if (!permission){
                    return res.json({
                        data : 'there is no such permission',
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
                data : 'permission has been successfully edited',
                success: true,
                status : 200
            })
        })
    };

    destroy = (req , res) => {
        this.model.Permission.findByIdAndDelete(req.params.id , err => {
            if (err){
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            return res.json({
                data : 'Permission has been successfully deleted.',
                success: true,
                status : 200
            })
        })
    };
}


module.exports = new adminPermissionController();
