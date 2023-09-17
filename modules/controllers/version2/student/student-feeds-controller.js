const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class studentFeedController extends Controller {

    index = async (req , res) => {
        const blockUsers = await this.model.Block.find({ student : req.student._id}).select('blocker').exec();
        const users = []
        blockUsers.map((usr) =>{
            users.push(usr.blocker.toString());
        })
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'event',
                select : 'showEventLink withAuthorize images attachments showLocation title participantCount student description eventDate eventLink eventTime entryPrice type location',
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
                    select : 'firstname lastname avatar images'
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
            {
                path : 'advertise',
                populate : {
                    path : 'partner',
                    select : 'name logo'
                }
            } ,
        ]
        this.model.Feed.paginate(
            {
                online : true,
                dormitory: req.student.dormitory,
                student : {$nin : users}
            },
            { page : page  , limit  : 10000,  sort : { createdAt: -1 } , populate }
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

module.exports = new studentFeedController();
