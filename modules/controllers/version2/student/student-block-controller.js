const Controller = require('../../controller');
const {validationResult} = require("express-validator");



class studentBlockController extends Controller{
    index = (req , res) => {
        const page = req.query.page || 1;
        this.model.Block.paginate(
            { student: req.student._id },
            { page , sort : { createdAt : -1 } , limit : 1000 , populate : ('blocker') }
        ).then(result => {
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
                    data : err,
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

        let block = new this.model.Block({
            student : req.student._id,
            blocker : req.params.id
        })

        block.save( err => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'The block has already saved on the database',
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
                data : 'student is block',
                success: true,
                status : 201
            })
        })
    };

    destroy = (req , res) => {
        this.model.Block.findByIdAndRemove(req.params.id, {
            description : req.body.description
        } , (err , block) => {
            if (err){
                if (!block)
                    return res.json({
                        data : 'There is no such block',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'operation failed',
                    success : false,
                    status : 202
                })
            }

            return res.json({
                data : 'Your block has been successfully deleted.',
                success : true,
                status : 201
            })

        })
    }






}


module.exports = new studentBlockController()
