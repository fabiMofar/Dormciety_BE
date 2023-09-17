const Controller = require('../../controller');


class adminFeedbackController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname',
                populate : {
                    path : 'dormitory',
                    select : 'name'
                }
            },
        ]
        this.model.Feedback.paginate(
            { },
            { page : page , limit : 400  ,  sort : { createdAt: -1 } , populate }
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


}

module.exports = new adminFeedbackController()
