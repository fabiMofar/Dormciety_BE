const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');

const FeedSchema = new Schema({
    shareRide : { type : Schema.Types.ObjectId , ref : 'ShareRide' , default : undefined},
    saleArticle : { type : Schema.Types.ObjectId , ref : 'SaleArticle' , default : undefined},
    event : { type : Schema.Types.ObjectId , ref : 'Event' , default : undefined},
    experience : { type : Schema.Types.ObjectId , ref : 'Experience' , default : undefined},
    question : { type : Schema.Types.ObjectId , ref : 'Question' , default : undefined},
    advertise : { type : Schema.Types.ObjectId , ref : 'Advertising' , default : undefined},
    type : { type : String , require : true},
    dormitory : {type : Schema.Types.ObjectId , ref : 'Dormitory' , default : undefined},
    student : { type : Schema.Types.ObjectId , ref : 'Student' , default : undefined},
    online : { type : Boolean , default : true},
})

FeedSchema.plugin(timestamps);
FeedSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Feed', FeedSchema);
