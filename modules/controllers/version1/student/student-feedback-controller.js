const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class studentFeedbackController extends Controller {


    //get Feedbacks of student
    index = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname'
            },
            {
                path : 'dormitory',
                select : 'name'
            }
        ]
        this.model.Feedback.paginate(
            { student : req.student._id},
            { page : page , limit : 10  ,  sort : { createdAt: -1 } , populate }
        ).then( (result) => {
            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    }


    // store a Feedback by Student in database
    store = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        let feedback = new this.model.Feedback({
            student : req.student._id,
            description : req.body.description,
            satisfaction_level : req.body.satisfaction_level
        });

        feedback.save( err => {
            if (err)
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })


            return res.json({
                data : 'The Feedback has been successfully created.',
                success: true,
                status : 201
            })
        })
    };

}

module.exports = new studentFeedbackController();
