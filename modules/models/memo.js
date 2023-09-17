const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');

const MemoSchema = new Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' , required : true},
    dormitories : [{type: Schema.Types.ObjectId , ref : 'Dormitory' , required : true}],
    title : { type : String , required : true},
    description : { type : String , required : true},
    validFrom : { type : Date , required : true},
    validUntil : { type : Date , required : true},
    images : { type : Array},
    attachments : { type : Array},
    deleted : { type : Boolean , default : false},
});

MemoSchema.plugin(timestamp);
MemoSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Memo', MemoSchema);
