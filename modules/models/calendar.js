const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timeStamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const CalendarSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student'},
    dormitory : { type : Schema.Types.ObjectId , ref : 'Dormitory'},
    date : { type : Date, required : true},
    feed : { type : Schema.Types.ObjectId , ref : 'Feed' , required : true},
    event : { type : Schema.Types.ObjectId , ref : 'Event' , default : undefined},
    shareRide : { type : Schema.Types.ObjectId , ref : 'ShareRide' , default : undefined},
    type : { type : String , required : true},
    dotColor : { type : String , required : true}
});

CalendarSchema.plugin(timeStamps);
CalendarSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Calendar' , CalendarSchema)
