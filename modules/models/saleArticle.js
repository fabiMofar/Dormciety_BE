const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timeStamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const SaleArticleSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true },
    dormitory : { type : Schema.Types.ObjectId , ref : 'Dormitory' , required : true },
    title : { type : String , required : true },
    price : { type : String , required : true },
    negotiable : { type : Boolean , default : false },
    description : { type : String },
    sold : { type : Boolean , default : false},
    images : { type : Array},
    deleted : { type : Boolean , default : false},
    online : { type : Boolean , default : true},
})


SaleArticleSchema.plugin(timeStamp);
SaleArticleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SaleArticle', SaleArticleSchema);
