const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const AdvertisingSchema = new Schema({
    partner : { type : Schema.Types.ObjectId , ref : 'Partner' , required : true},
    dormitories : [{ type : Schema.Types.ObjectId, ref : 'Dormitory' , required : true}],
    title : { type : String, required : true  },
    description : { type : String , required : true},
    image : { type : Object ,  required : true},
    link : { type : String }
});

AdvertisingSchema.plugin(timestamps);
AdvertisingSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Advertising', AdvertisingSchema);
