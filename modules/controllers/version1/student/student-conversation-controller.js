const Controller = require('../../controller');
const Pusher = require('pusher')
const fetch = require('node-fetch');

const pusher = new Pusher({
    appId: "1204194",
    key: "19fd09fcf34df3e66e86",
    secret: "6456db6e7c5ebe825917",
    cluster: "eu",
    useTLS : true
});


class studentConversationController extends Controller{
    index = async (req , res) => {

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
                members : {$all : req.student._id},
                lastMessageText : {$exists: true, $ne: null},
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

    store = async (req , res) => {
        try{
            if (req.body.member === req.student._id.toString()){
                return res.json({
                    data : 'conversation with 2 same ids',
                    success: false,
                    status: 202
                })
            }
            const  members = [req.body.member , req.student._id.toString()]
            let conversation = await this.model.Conversation.findOne({members : { $all : members}}).exec();
            if (conversation){
                return res.json({
                    data : conversation,
                    success: true,
                    status : 201
                })
            }
            let newConversation = new this.model.Conversation({
                members : members,
                type : 'one-to-one'
            });

            newConversation.save((err , conversation) => {
                if (err){
                    return res.json({
                        data : err,
                        success: false,
                        status : 500
                    })
                }
                return res.json({
                    data : conversation,
                    success: true,
                    status : 201
                })
            })

        }catch (e){
            console.log(e)
        }

    };

    sendMessage = async (req , res) => {
        try {

            const conversation = await this.model.Conversation.findById(req.body.conversation_id).exec();
            if (!conversation){
                return res.json({
                    data : 'conversation not found',
                    success: false,
                    status : 404
                })
            }

            conversation.lastMessageText = req.body.text;
            conversation.lastMessageDate = new Date();

            await conversation.save();


            const receiverId = conversation.members.find(member => member != req.student._id.toString())
            const receiver = await this.model.Student.findById(receiverId).exec();
            const sender = await this.model.Student.findById(req.student._id).exec()


            if(req.files){
                var images = req.files.map(image => image.path.replace(/\\/g , '/'));
            }

            let message = new this.model.Message({
                conversation : req.body.conversation_id,
                user : req.student._id,
                text : req.body.text,
                images : images
            });

            message.save((err , message) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })


                pusher.trigger(`conversation-${message.conversation}` , 'inserted' ,{
                    _id : message.id,
                    conversation : message.conversation,
                    user: {
                        _id : message.user,
                        name : `${sender.firstname}`,
                        avatar : `https://dev-api.dormciety.de/${sender.avatar}`
                    },
                    text : message.text,
                    images : message.images,
                    createdAt : message.createdAt
                });


                var notification = {
                    'title' : `${sender.firstname} ${sender.lastname}`,
                    'body' : `${message.text.substr(0, 30)}....`,

                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${receiver._id}`,
                    'notification' : notification,
                    'data': {
                        "id" : message.conversation,
                        "type" : 'conversation'
                    }
                }

                fetch('https://fcm.googleapis.com/fcm/send' , {
                    'method' : 'POST',
                    'headers' : {
                        'Authorization' : `key=${config.pushNotificationServerKey}`,
                        'Content-Type':'application/json'
                    },
                    'body' : JSON.stringify(notification_body)
                }).then(() => {
                    console.log('success')
                }).catch((err) => {
                    console.log(err)
                })


                return res.json({
                    data : 'your message has been submitted',
                    success : true,
                    status: 201
                })
            })

        }catch (e){
            console.log(e)
        }

    };

    getMessages = async (req ,res) =>{
        try {
            const messages = await this.model.Message.find({conversation : req.query.conversation_id})
                .sort({createdAt : -1})
                .populate([
                    {
                        path : 'user',
                        select : 'firstname lastname avatar'
                    }
                ])
                .exec();

            return res.json({
                data: messages,
                success : true,
                status : 200
            })
        }catch (e) {
            console.log(e)
        }
    }
}


module.exports = new studentConversationController();
