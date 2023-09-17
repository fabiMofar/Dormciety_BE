const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const UserActivitySchema = new Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' , required : true},
    type : { type : String , required : true },
    title : { type : String , required : true },
    activity_body : { type : String , required : true },
});

UserActivitySchema.plugin(timestamps);
UserActivitySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('UserActivity', UserActivitySchema);
