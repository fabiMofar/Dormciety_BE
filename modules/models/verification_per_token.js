const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');



const VerificationPerTokenSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true , unique : true},
    verifyToken : { type : Schema.Types.ObjectId , ref : 'VerifyToken' },
    verified_at : { type : Date},
    verification_type : { type : String },
    post_send : { type : Boolean , default : false},
});

VerificationPerTokenSchema.plugin(timestamp);
VerificationPerTokenSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('VerificationPerToken', VerificationPerTokenSchema);
