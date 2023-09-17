const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const BlockSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student'},
    blocker : { type : Schema.Types.ObjectId , ref : 'Student' , unique : true},
});

BlockSchema.plugin(timestamps);
BlockSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Block', BlockSchema);
