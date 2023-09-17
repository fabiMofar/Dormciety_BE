const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const PartnerSchema = new Schema({
    dormitories : [{ type : Schema.Types.ObjectId , ref : 'Dormitory'}],
    name : { type : String, unique : true , required : true},
    logo : { type : Object},
    deleted : { type : Boolean , default : false}
});




PartnerSchema.plugin(timestamp);
PartnerSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Partner', PartnerSchema)
