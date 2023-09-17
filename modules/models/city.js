const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const CitySchema = new Schema({
    name : { type : String, required : true , unique : true },
    active : { type : Boolean, default : true},
    deleted : { type : Boolean, default : false},
});

CitySchema.plugin(timestamps);
CitySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('City', CitySchema);
