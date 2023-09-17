const Controller = require('../../controller');


class studentActivityStatusController extends Controller{

    index = (req , res) => {
        const page = req.query.page || 1;
        this.model.ActivityStatus.paginate(
            {   },
            { page , sort : { createdAt : -1 }  }
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

    store = async (req , res) => {
        try {
            const activityStatus = await this.model.ActivityStatus.findOne({student : req.student._id}).exec();
            if (activityStatus){
                await activityStatus.remove()
            }

            let newStatus  = new this.model.ActivityStatus({
                student : req.student._id,
                symbol : req.body.symbol_id,
                createdAt: new Date()
            });


            newStatus.save((err) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'Status für 4 Stunden gesetzt',
                    success : true,
                    status : 201
                })
            })

        }catch (e){
            console.log(e)
        }
    };

    getSymbol = (req , res) => {
        const page = req.query.page || 1;
        const select = 'symbol label'
        this.model.Symbol.paginate(
            {  },
            { page , limit : 20 , sort : { createdAt : -1 } , select }
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


    destroy = (req , res) => {

        this.model.ActivityStatus.findByIdAndRemove(req.params.id , (err , status) => {
            if (err){
                if (!status){
                    return res.json({
                        data : 'there is no such status',
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
                data : 'status has been successfully deleted',
                success: true,
                status : 200
            })
        })
    }



}


module.exports = new studentActivityStatusController()
