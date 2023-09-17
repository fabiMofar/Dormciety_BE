const Controller = require('../../controller');


class adminMediaController extends Controller {
    index = (req, res) => {
        const page = req.query.page || 1;
        this.model.Media.paginate(
            {  },
            { page : page , limit : 10  ,  sort : { createdAt: -1 }  }
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
    };
}


module.exports = new adminMediaController();
