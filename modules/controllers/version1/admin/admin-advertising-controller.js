const Controller = require("../../controller");
const {validationResult} = require('express-validator');

class adminAdvertisingController extends Controller {
    index = (req, res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'partner',
                select : 'name logo'
            },
            {
                path : 'dormitories',
                select : 'name'
            }
        ]
        this.model.Advertising.paginate(
            {},
            { page , limit : 400 , populate  }
        ).then(advertising  => {

            return res.json({
                data : advertising.docs,
                current_page : advertising.page,
                pages : advertising.pages,
                total : advertising.total,
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


        let advertise = new this.model.Advertising({
            partner : req.body.partner_id,
            dormitories : req.body.dormitories,
            title : req.body.title,
            description : req.body.description,
            image : image,
            link : req.body.link
        })

        advertise.save((err  , adv)=> {
            if (err){
                return res.json({
                    data : err,
                    success : false,
                    status : 500
                })
            }

            if (req.body.dormitories.length > 0){
                let document = [];
                req.body.dormitories.map((value , index) => {
                    document.push({
                        advertise : adv._id,
                        dormitory : value,
                        type : 'advertise',
                        createdAt : new Date(),
                    })
                })
                this.model.Feed.insertMany(document , (err) => {
                    res.json({
                        data : 'Your advertise has been successfully registered.',
                        success : true,
                        status : 201
                    })
                })
            }
        })
    };


    destroy = (req , res) => {
        this.model.Advertising.findByIdAndRemove(req.params.id  ,  (err) => {
            if (err){
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            this.model.Feed.deleteMany({advertise : req.params.id} , (err) => {
                if (err){
                    return res.json({
                        data : 'server error',
                        success: false,
                        status : 500
                    })
                }
                return res.json({
                    data : 'advertise has been successfully deleted.',
                    success: true,
                    status : 200
                })
            })
        })
    };
}


module.exports = new adminAdvertisingController();



