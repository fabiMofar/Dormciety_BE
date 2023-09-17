const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const MessageSchema = new Schema({
    conversation : { type : Schema.Types.ObjectId , ref : 'Conversation', required : true},
    user : { type: Schema.Types.ObjectId , ref : 'Student', required: true},
    images : {type : Array},
    text  : { type: String, required: true },
});




MessageSchema.plugin(timestamp);
MessageSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Message', MessageSchema)
