const Controller = require('../../controller');

class adminExperienceController extends Controller {

    index = (req, res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname'
            },
            {
                path : 'dormitory',
                select : 'name'
            },
            {
                path: 'media'
            }
        ]
        this.model.Experience.paginate(
            { deleted : false },
            { page : page , limit : 10  ,  sort : { createdAt: -1 }  ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No experience found',
                    success : false,
                    status : 404
                })

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
        this.model.Experience.findById(req.params.id , (err , result) => {
            if (err)
                return res.json({
                    data : 'No such experience found',
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
                },
                {
                    path : 'media',
                }
            ]
        )
    };

    destroy = (req, res) => {
        this.model.Experience.findByIdAndUpdate( req.params.id , {
            deleted : true,
            online : false
        } , (err , experience) => {
            if (err){
                if (!experience)
                    return res.json({
                        data : 'There is no such experience',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndRemove({experience : experience._id} , (err , feed) => {
                if (err)
                    return res.json({
                        data : 'server error',
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
                        data : 'experience has been successfully deleted.',
                        success : true,
                        status : 200
                    })
                })
            })
        })
    };

    toggleOnline = (req , res) => {
        this.model.Experience.findByIdAndUpdate( req.params.id , {
            online : req.body.online,
        } , (err , experience) => {
            if (err){
                if (!experience)
                    return res.json({
                        data : 'There is no such experience',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            this.model.Feed.findOneAndUpdate({ experience : experience._id} , {
                online : req.body.online,
            } ,(err , feed) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'experience has been successfully edited.',
                    success : true,
                    status : 200
                })
            })
        })
    }

}

module.exports = new adminExperienceController();
