const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');



const VerifyTokenSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , default: undefined },
    user : { type : Schema.Types.ObjectId , ref : 'User' , default : undefined},
    value : { type : String , required : true },
    valid_from : { type : Date},
    valid_until : { type : Date},
    used : { type : Boolean , default : false},
});

VerifyTokenSchema.plugin(timestamp);
VerifyTokenSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('VerifyToken', VerifyTokenSchema);
