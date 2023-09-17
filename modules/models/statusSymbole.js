const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const StatusSymbolSchema = new Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' , required : true},
    label: {type : String, required : true , unique : true},
    symbol : { type : Object , required: true}
}, { toJSON : { virtuals : true}});


StatusSymbolSchema.plugin(timestamp);
StatusSymbolSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('StatusSymbol' , StatusSymbolSchema);
