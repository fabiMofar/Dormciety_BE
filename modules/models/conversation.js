const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


const ConversationSchema = new Schema({
    members : [{ type : Schema.Types.ObjectId , ref : 'Student'}],
    type : { type : String , required : true},
    lastMessageText : { type : String},
    lastMessageDate : { type : Date ,}
} ,  {toJSON: {virtuals: true}, toObject : {virtuals : true}});

ConversationSchema.virtual('messages' , {
    ref : 'Message',
    localField : '_id',
    foreignField : 'conversation'
});


ConversationSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Conversation', ConversationSchema);
