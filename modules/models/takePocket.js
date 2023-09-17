const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const TakePacketSchema = new Schema({
    receiver: {type : Schema.Types.ObjectId, ref: 'Student' , required : true},
    owner : { type : Schema.Types.ObjectId,ref: 'Student' , required : true},
    dormitory : { type : Schema.Types.ObjectId , ref : 'Dormitory' , required : true},
}, { toJSON : { virtuals : true}});

TakePacketSchema.plugin(timestamp);
TakePacketSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('TakePacket', TakePacketSchema);
