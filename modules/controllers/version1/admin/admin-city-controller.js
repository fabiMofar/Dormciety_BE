const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class adminCityController extends Controller {
    index = (req, res) => {
        const select = 'name active';
        this.model.City.paginate(
            { deleted : false  } ,
            {  sort : { createdAt: -1 } , select }
        ).then(cities => {
            return res.json({
                data : cities.docs,
                total : cities.total,
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

    store = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        let city = new this.model.City({
            name : req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1),
        })

        city.save( err => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'The city has already saved on the database',
                        success: false,
                        status : 11000
                    })
                }
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            return res.json({
                data : 'The City has been successfully created.',
                success: true,
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

        this.model.City.findByIdAndUpdate(req.params.id , {
            name : req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1),
        } , (err , city) => {
            if (err){
                if (!city){
                    return res.json({
                        data : 'this is no such City',
                        success: false,
                        status : 404
                    })
                }else {
                    return res.json({
                        data : 'server Error',
                        success: false,
                        status : 500
                    })
                }
            }

            return res.json({
                data : 'City has been successfully edited',
                success: true,
                status : 200
            })
        })
    };

    destroy = (req, res) => {
        this.model.City.findByIdAndUpdate(req.params.id , {
            deleted : true
        } , (err , city) => {
            if (err){
                if (!city){
                    return res.json({
                        data : 'there is no such city',
                        success: false,
                        status : 404
                    })
                }else {
                    return res.json({
                        data : 'server error',
                        success: false,
                        status : 500
                    })
                }
            }

            return res.json({
                data : 'city has been successfully deleted',
                success: true,
                status : 200
            })
        })
    };

    change_activity = async (req , res) => {
        try {
            const city = await this.model.City.findById(req.params.id).exec();
            if (!city){
               return res.json({
                   data : 'city is not found',
                   success: false,
                   status : 404
               })
            }
            const dormitories = await this.model.Dormitory.find({city : city._id}).exec();
            const students = await this.model.Student.find({ city : city._id}).exec();


            city.active = req.body.active;
            await city.save();

            await dormitories.map((dormitory) => {
                dormitory.active = req.body.active;
                dormitory.save();
            });


            await students.map((student) => {
                student.active = req.body.active;
                student.save()
            })


            return res.json({
                data : 'city has been successfully edited',
                success: true,
                status : 200
            })


        }catch (e) {
           res.json({
               data : 'server error',
               success: false,
               status : 500
           })
        }
    }
}

module.exports = new adminCityController();
