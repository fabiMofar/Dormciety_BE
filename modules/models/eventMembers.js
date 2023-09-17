const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const EventMemberSchema = new Schema({
    event : { type : Schema.Types.ObjectId , ref : 'Event' , required : true },
    host : { type : Schema.Types.ObjectId , ref: 'Student' , required : true},
    guest : { type : Schema.Types.ObjectId , ref : 'Student' , required : true },
    status : { type : String}
} ,  { toJSON : { virtuals : true } });

EventMemberSchema.plugin(timestamp);
EventMemberSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('EventMember', EventMemberSchema);
