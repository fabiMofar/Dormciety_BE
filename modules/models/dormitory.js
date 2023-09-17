const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');

const DormitorySchema = new Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' , required : true},
    city : { type : Schema.Types.ObjectId , ref : 'City' , required : true},
    name : { type : String , required : true },
    street : { type : String , required : true},
    houseNumber : { type : String , required : true},
    postalCode : { type : String , required : true},
    active : { type : Boolean , default : true},
    deleted : { type : Boolean , default : false},
} , { toJSON : { virtuals : true }});


DormitorySchema.plugin(timestamp);
DormitorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Dormitory' , DormitorySchema);
