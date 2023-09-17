const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');

const EventSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , default : undefined},
    user : { type : Schema.Types.ObjectId , ref : 'User' , default : undefined},
    dormitory : { type : Schema.Types.ObjectId , ref : 'Dormitory' , required : true},
    type : { type : String , required : true},
    eventDate : { type : Date , required : true},
    eventTime : { type : String , required : true},
    showEventLink : { type : Boolean , default : false},
    title : { type : String , required : true},
    description : { type : String , required : true},
    participantCount : { type : Number , required : true},
    freeCount : { type : Number },
    entryPrice : { type : String , required : true},
    withAuthorize : { type : Boolean , default : false},
    images : { type : Array},
    attachments : { type : Array},
    location : { type : String , default : undefined },
    showLocation : { type : Boolean , default : false},
    eventLink : { type : String , default : undefined},
    deleted : { type : Boolean , default : false},
    online : { type : Boolean , default : true},

});

EventSchema.plugin(timestamp);
EventSchema.plugin(mongoosePaginate);




module.exports = mongoose.model('Event', EventSchema);
