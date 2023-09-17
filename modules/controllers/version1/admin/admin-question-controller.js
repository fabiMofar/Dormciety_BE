const Controller = require('../../controller');

class adminQuestionController extends Controller {

    index = (req, res) => {
        const page = req.query.page || 1;
        const select = 'description images student dormitory online createdAt';
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
        this.model.Question.paginate(
            { deleted : false },
            { page : page , limit : 10  ,  sort : { createdAt: -1 } , select ,  populate }
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

    single = (req , res) => {
        this.model.Question.findById(req.params.id , (err , result) => {
            if (err)
                return res.json({
                    data : 'No such Question found',
                    success : false,
                    status : 404
                })

            return res.json({
                data : result,
                success : true,
                status : 200
            })
        }).populate(
            [
                {
                    path : 'student',
                    select : 'firstname lastname'
                },
                {
                    path : 'dormitory',
                    select : 'name'
                }
            ]
        )
    };

    destroy = (req, res) => {
        this.model.Question.findByIdAndUpdate( req.params.id , {
            deleted : true,
            online : false
        } , (err , question) => {
            if (err){
                if (!question)
                    return res.json({
                        data : 'There is no such question',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server Error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndRemove({question : question._id} , (err , feed) => {
                if (err)
                    return res.json({
                        data : 'server Error',
                        success : false,
                        status : 500
                    })

                this.model.Favorite.deleteMany({feed : feed._id} , (err) => {
                    if (err)
                        return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        })
                    return res.json({
                        data : 'question has been successfully deleted.',
                        success : true,
                        status : 200
                    })
                })
            })
        })
    };

    toggleOnline = (req , res) => {
        this.model.Question.findByIdAndUpdate( req.params.id , {
            online : req.body.online,
        } , (err , question) => {
            if (err){
                if (!question)
                    return res.json({
                        data : 'There is no such question',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndUpdate({ question : question._id} , {
                online : req.body.online,
            } ,(err , feed) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'event has been successfully edited.',
                    success : true,
                    status : 200
                })
            })
        })
    }
}

module.exports = new adminQuestionController();
