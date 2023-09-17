const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');


const StudentSchema = new Schema({
    dormitory : { type : Schema.Types.ObjectId , ref : 'Dormitory' , required : true},
    city : { type : Schema.Types.ObjectId , ref : 'City' , required : true},
    firstname : { type : String , required : true },
    lastname : { type : String , required : true },
    email : { type : String , required : true , index: { unique: true }},
    password : { type : String , required : true},
    avatar : { type : Object },
    verified : { type : Boolean  , default : false },
    verified_at : { type : Date },
    council : { type : Boolean , default : false },
    deleted : { type : Boolean  , default : false},
    active : { type : Boolean , default: true},
    deleted_reason : { type : String},
}, { toJSON : { virtuals : true} , toObject : {virtuals : true}});

StudentSchema.plugin(timestamp);
StudentSchema.plugin(mongoosePaginate);

StudentSchema.virtual('status' , {
    ref : 'ActivityStatus',
    localField : '_id',
    foreignField : 'student',
})



StudentSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password , this.password);
}

module.exports = mongoose.model('Student', StudentSchema);
