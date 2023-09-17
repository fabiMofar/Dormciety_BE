const Controller = require('../../controller');


class adminTakePocketController extends Controller{

    index = (req , res) => {
        const page = req.query.page || 1;
        const populate = [

            {
                path : 'owner',
                select : 'firstname lastname avatar',
            } ,
            {
                path : 'receiver',
                select : 'firstname lastname avatar',
            } ,
            {
                path : 'dormitory',
                select : 'name',
            } ,
        ]
        this.model.TakePocket.paginate(
            { },
            { page : page  , limit : 400,  sort : { createdAt: -1 } , populate }
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

module.exports = new adminTakePocketController()
