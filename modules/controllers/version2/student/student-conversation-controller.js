const Controller = require('../../controller');


class studentConversationController extends Controller {

    index = async (req , res) => {
        const blockUsers = await this.model.Block.find({ student : req.student._id}).select('blocker').exec();
        const users = []
        blockUsers.map((usr) =>{
            users.push(usr.blocker.toString());
        })

        const populate = [
            {
                path : 'members',
                select : 'firstname lastname avatar'
            },
            {
                path: 'messages',
            }
        ];
        this.model.Conversation.paginate(
            {
                $and : [
                    {
                        members : {$all : req.student._id},
                        lastMessageText : {$exists: true, $ne: null},
                    },
                    {
                        members: { $nin : users}
                    }
                ]
            } ,
            {  sort : { lastMessageDate: -1 } , populate  }
        ).then(async (result) => {
            return res.json({
                data : result.docs,
                total : result.total,
                success: true,
                status: 200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'Server Error',
                    success: false,
                    status: 500
                })
            })
    };


}


module.exports = new studentConversationController();
