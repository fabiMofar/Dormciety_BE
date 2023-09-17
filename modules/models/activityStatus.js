const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


const ActivityStatusSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true},
    symbol : { type : Schema.Types.ObjectId , ref : 'StatusSymbol' , required : true},
    createdAt : { type : Date  , default : Date.now , expires : '240m'}
}, { toJSON : { virtuals : true}});

ActivityStatusSchema.plugin(mongoosePaginate)


module.exports = mongoose.model('ActivityStatus' , ActivityStatusSchema);
