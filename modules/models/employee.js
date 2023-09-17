const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const EmployeeSchema = new Schema({
    partner : { type : Schema.Types.ObjectId , ref : 'Partner' , required : true},
    firstname : { type : String , required : true},
    lastname : { type : String , required : true},
    title : { type : String , required : true},
    email : { type : String , required : true},
    mobile : { type : String , required : true},
    meetingTime : { type : String , required : true},
    bio : { type : String , required : true},
    link : { type : String },
    avatar : { type : Object},
    deleted : { type : Boolean , default : false}
});


EmployeeSchema.plugin(timestamp);
EmployeeSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Employee', EmployeeSchema)
