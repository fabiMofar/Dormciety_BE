const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const ReportSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true},
    description : { type : String , required: true},
    type : { type : String},
    review : { type : Boolean , default : false},
    reviewed_by : { type : Schema.Types.ObjectId , ref : 'User'},
    review_note : { type : String },
    review_date : { type : Date },
    question : { type : Schema.Types.ObjectId , ref : 'Question' , default : undefined},
    saleArticle : { type : Schema.Types.ObjectId , ref : 'SaleArticle' , default : undefined},
    shareRide : { type : Schema.Types.ObjectId , ref : 'ShareRide' , default : undefined},
    experience : { type : Schema.Types.ObjectId , ref : 'Experience' , default : undefined},
    event : { type : Schema.Types.ObjectId , ref : 'Event' , default : undefined},
})

ReportSchema.plugin(timestamp);
ReportSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Report', ReportSchema);
