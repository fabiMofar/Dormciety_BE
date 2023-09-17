const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class studentReportController extends Controller {

    reportCategories = (req , res) => {
        const page = req.query.page || 1;
        this.model.ReportCategory.paginate(
            {  },
            { page , limit : 20 , sort : { createdAt : -1 } , select : 'label'}
        ).then(result => {
            if (!result){
                return res.json({
                    data : 'No categories found',
                    success : false,
                    status : 404
                })
            }

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
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.json({
                    errors: errors.array(),
                    success: false,
                    status : 422
                })
            }

            let newReport = new this.model.Report({
                student : req.student._id,
                description : req.body.description,
                question : req.body.question_id,
                saleArticle : req.body.saleArticle_id,
                shareRide : req.body.shareRide_id,
                event : req.body.event_id,
                experience : req.body.experience_id,
                type : req.body.type
            })

            newReport.save(err => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'Your Report has been successfully registered.',
                    success : true,
                    status : 201
                })
            })



        }catch (e) {
            console.log(e)
        }

    };

}


module.exports = new studentReportController();
