const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const FeedbackSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true},
    satisfaction_level : { type : String , required : true },
    description : { type : String , required : true },
});

FeedbackSchema.plugin(timestamps);
FeedbackSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Feedback', FeedbackSchema);
