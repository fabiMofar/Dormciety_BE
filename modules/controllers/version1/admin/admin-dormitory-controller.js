const Controller = require('../../controller');
const { validationResult } = require('express-validator');


class adminDormitoryController extends Controller {

    index = (req, res) => {
        const page = req.query.page || 1;
        const select = 'street houseNumber postalCode city phone name active';
        const populate = [
            {
                path : 'city',
                select : 'name'
            },
        ]
        this.model.Dormitory.paginate(
            { deleted : false  },
            { page , limit : 100000 , sort : { createdAt : -1 } , populate , select}
        ).then(dormitories => {

            return res.json({
                data : dormitories.docs,
                current_page : dormitories.page,
                pages : dormitories.pages,
                total : dormitories.total,
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
        this.model.Dormitory.findById(req.params.id , (err , dormitory) => {
            if (err){
                return res.json({
                    data : 'no such dormitory found',
                    success: false,
                    status: 404
                })
            }

            return res.json({
                data : dormitory,
                success: true,
                status: 200
            })
        }).populate({ path : 'city' , select : 'name'})
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

        let dormitory = new this.model.Dormitory({
            user : req.user._id,
            street : req.body.street,
            houseNumber : req.body.houseNumber,
            postalCode : req.body.postalCode,
            city : req.body.city_id,
            name : req.body.name,
        })

        dormitory.save(err => {
            if (err)
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })


            return res.json({
                data : 'Your dormitory has been successfully registered.',
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


        this.model.Dormitory.findByIdAndUpdate(req.params.id , {
            street : req.body.street,
            houseNumber : req.body.houseNumber,
            postalCode : req.body.postalCode,
            city : req.body.city_id,
            name : req.body.name,
        } , (err , dormitory) => {
            if (err) {
                if (!dormitory){
                    return res.json({
                        data : 'There is no such dormitory',
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
                data : 'dormitory has been successfully edited.',
                success : true,
                status : 200
            })
        })
    };

    destroy = (req , res) => {
        this.model.Dormitory.findByIdAndUpdate(req.params.id , {
            deleted : true,
            active : false
        } , (err , dormitory) => {
            if (err) {
                if (!dormitory){
                    return res.json({
                        data : 'There is no such dormitory',
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
                data : 'dormitory has been successfully deleted.',
                success : true,
                status : 200
            })
        })
    };

    change_activity  = async (req , res) => {
        try {
            const dormitory = await this.model.Dormitory.findById(req.params.id).exec();
            if (!dormitory)
                return res.json({
                    data : 'dormitory not Found',
                    success : false,
                    status : 404
                })

            const students = await this.model.Student.find({dormitory : dormitory._id}).exec();

            dormitory.active = req.body.active;
            await dormitory.save()

            students.map((student) => {
                student.active = req.body.active
                student.save()
            })

            return res.json({
                data : 'dormitory is edited',
                success : true,
                status : 200
            })

        }catch (err){
            return res.json({
                data : 'server error',
                success : false,
                status : 500
            })
        }

        // this.model.Dormitory.findByIdAndUpdate(req.params.id , {
        //     active : req.body.active,
        // } , (err , dormitory) => {
        //     if (err) {
        //         if (!dormitory){
        //             return res.json({
        //                 data : 'There is no such dormitory',
        //                 success : false,
        //                 status : 404
        //             })
        //         }
        //
        //         return res.json({
        //             data : 'Server error',
        //             success : false,
        //             status : 500
        //         })
        //     }
        //
        //     return res.json({
        //         data : 'dormitory has been successfully edited.',
        //         success : true,
        //         status : 200
        //     })
        // })
    };

    changeDormitory = (req , res) => {
        this.model.Student.updateMany({ dormitory : req.body.dormitory_id} , {
            dormitory : req.body.newDormitory
        } , (err ) => {
            if (err){
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            return res.json({
                data : 'success',
                success : true,
                status : 200
            })
        })
    }

}


module.exports = new adminDormitoryController();
