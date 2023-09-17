const Controller = require('../../controller');
const {validationResult} = require('express-validator');
const Pusher = require('pusher')
const fetch = require('node-fetch');

const pusher = new Pusher({
    appId: "1190175",
    key: "1b4283a5330783ca9f7b",
    secret: "ea2c48fba998c99af819",
    cluster: "eu",
    useTLS : true
});


class studentTakePostController extends Controller {

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
        ]
        this.model.TakePocket.paginate(
            { owner : req.student._id},
            { page : page  ,  sort : { createdAt: -1 } , populate }
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

            let receiver = await this.model.Student.findById(req.student._id).exec();


            let takePocket = new this.model.TakePocket({
                owner : req.body.owner_id,
                dormitory : req.student.dormitory,
                receiver : req.student._id
            })



            takePocket.save((err , pocket) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    });

                this.sendMessage(req.student._id.toString() , req.body.owner_id);

                var notification = {
                    'title' : `${receiver.firstname} hat dein Paket erhalten`,
                    'body' : 'Hey! Ich habe dein Paket erhalten. Melde dich bei mir, damit wir die Übergabe planen können.',
                }

                var notification_body = {
                    'to' : `/topics/pushNotification-${req.body.owner_id}`,
                    'notification' : notification,
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
                    data : 'Die Nachricht, dass du das Paket angenommen hast, wurde versendet',
                    success : true,
                    status : 201
                })

            })
        }catch (err){
            console.log(err)
        }
    };

    sendMessage = async (sender , receiver) => {
        try{
            if (sender === receiver){
                return res.json({
                    data : 'conversation with 2 same ids',
                    success: false,
                    status: 202
                })
            }
            const  members = [sender , receiver]
            let conversation = await this.model.Conversation.findOne({members : { $all : members}}).exec();
            if (conversation){

                conversation.lastMessageText = 'Hey! Ich habe dein Paket erhalten. Melde dich bei mir, damit wir die Übergabe planen können.';
                conversation.lastMessageDate = new Date();

                await conversation.save();
                let message = new this.model.Message({
                    conversation : conversation._id,
                    user : sender,
                    text :'Hey! Ich habe dein Paket erhalten. Melde dich bei mir, damit wir die Übergabe planen können.',
                });
                message.save((err , message) => {
                    if (err) {console.log(err)}

                    pusher.trigger(`conversation-${message.conversation}` , 'inserted' ,{
                        _id : message.id,
                        conversation : message.conversation,
                        user: {
                            _id : message.user
                        },
                        text : message.text,
                        images : message.images,
                        createdAt : message.createdAt
                    })
                })

            }else{
                let newConversation = new this.model.Conversation({
                    members : members,
                    type : 'one-to-one',
                    lastMessageText : 'Hey! Ich habe dein Paket erhalten. Melde dich bei mir, damit wir die Übergabe planen können.',
                    lastMessageDate : new Date(),
                });

                newConversation.save((err , conversation) => {
                    if (err){
                        console.log(err)
                    }

                    let message = new this.model.Message({
                        conversation : conversation._id,
                        user : sender,
                        text : 'Hey! Ich habe dein Paket erhalten. Melde dich bei mir, damit wir die Übergabe planen können.',
                    });
                    message.save((err , message) => {

                        pusher.trigger(`conversation-${message.conversation}` , 'inserted' ,{
                            _id : message.id,
                            conversation : message.conversation,
                            user: {
                                _id : message.user
                            },
                            text : message.text,
                            images : message.images,
                            createdAt : message.createdAt
                        })
                    })
                })
            }




        }catch (e){
            console.log(e)
        }
    }

}


module.exports = new studentTakePostController();
