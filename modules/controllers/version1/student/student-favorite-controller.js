const Controller = require('../../controller');
const {validationResult} = require('express-validator');

class studentFavoriteController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'feed',
                populate : [
                    {
                        path : 'student',
                        select : 'firstname lastname avatar'
                    },
                    {
                        path : 'event',
                        select : 'showEventLink withAuthorize images attachments showLocation title participantCount student description eventDate eventTime entryPrice type',
                        populate : {
                            path : 'student',
                            select : 'firstname lastname avatar'
                        }
                    } ,
                    {
                        path : 'saleArticle',
                        select : 'negotiable sold images student title description price ',
                        populate : {
                            path : 'student',
                            select : 'firstname lastname avatar'
                        }
                    } ,
                    {
                        path : 'shareRide',
                        select : 'smoke animal baggage student locationFrom locationTo sitCount description departureDate departureTime price freeSit ',
                        populate : {
                            path : 'student',
                            select : 'firstname lastname avatar'
                        }
                    } ,
                    {
                        path : 'question',
                        select : 'images student description',
                        populate : {
                            path : 'student',
                            select : 'firstname lastname avatar'
                        }
                    } ,
                    {
                        path : 'experience',
                        select : 'images student description',
                        populate : {
                            path : 'student',
                            select : 'firstname lastname avatar'
                        }
                    } ,
                ]
            }
        ]
        this.model.Favorite.paginate(
            { student : req.student._id},
            { page : page , limit : 20  ,  sort : { createdAt: -1 } ,  populate }
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

    store = async (req , res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.json({
                    errors: errors.array(),
                    success: false,
                    status : 422
                })
            };

            let favorite = await this.model.Favorite.findOne(
                {
                    student : req.student._id,
                    feed : req.body.feed_id
                }
            ).exec();

            if (favorite)
                return res.json({
                    data : 'is submitted',
                    success : false,
                    status : 202
                })

            let newFavorite = new this.model.Favorite({
                student : req.student._id,
                feed : req.body.feed_id
            })

            newFavorite.save(err => {
                if (err)
                    return res.json({
                        data : 'Operation failed',
                        success: false,
                        status: 500
                    })

                return res.json({
                    data : 'favorite has successfully created.',
                    success: true,
                    status: 201
                })
            })

        }catch (e) {
            return res.json({
                data : 'server error',
                success : false,
                status : 500
            })
        }
    };

    destroy = (req, res) => {
        this.model.Favorite.findOneAndRemove(req.params.id , (err , favorite) => {
            if (err){
                if (!favorite)
                    return res.json({
                        data : 'favorite not found',
                        success: false,
                        status: 404
                    })

                return res.json({
                    data : 'operation failed',
                    success: false,
                    status: 500
                })
            }

            return res.json({
                data : 'favorite has successfully deleted.',
                success: true,
                status: 200
            })
        })
    };

    checkFavorite = (req , res) => {
        this.model.Favorite.findOne({
            student : req.student._id ,
            feed : req.query.feed_id
        } , (err , favorite) => {
            if (!favorite){
                return res.json({
                    data : null,
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : favorite,
                success : true,
                status : 200
            })
        })
    }

}


module.exports = new studentFavoriteController();
