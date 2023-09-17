const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');

const PasswordForgottenSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true},
    token : { type : String , required: true},
    used : { type : Boolean , default : false},
    resetDate : { type : Date }
});

PasswordForgottenSchema.plugin(timestamp);
PasswordForgottenSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('PasswordForgotten', PasswordForgottenSchema);
