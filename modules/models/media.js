const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const MediaSchema = new Schema({
    url : { type : Object},
    type : { type : String},
    size : { type : String},
})

MediaSchema.plugin(timestamp);
MediaSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Media', MediaSchema);
