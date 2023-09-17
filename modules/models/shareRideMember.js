const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const ShareRideMemberSchema = new Schema({
    shareRide : { type : Schema.Types.ObjectId , ref : 'ShareRide' , required : true },
    host : { type : Schema.Types.ObjectId , ref: 'Student' , required : true},
    guest : { type : Schema.Types.ObjectId , ref : 'Student' , required : true },
    status : { type : String}
} ,  { toJSON : { virtuals : true } });

ShareRideMemberSchema.plugin(timestamp);
ShareRideMemberSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('ShareRideMember', ShareRideMemberSchema);
