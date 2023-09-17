const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const CommentSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true },
    parent : { type : Schema.Types.ObjectId , ref : 'Comment' , default : null},
    event : { type : Schema.Types.ObjectId , ref : 'Event' , default: undefined},
    shareRide : { type : Schema.Types.ObjectId , ref : 'ShareRide' , default : undefined},
    saleArticle : { type : Schema.Types.ObjectId , ref : 'SaleArticle' , default : undefined},
    question : { type : Schema.Types.ObjectId , ref : 'Question' , default : undefined},
    experience : { type : Schema.Types.ObjectId , ref : 'Experience' , default : undefined},
    comment : { type : String , required : true },
} , { toJSON : { virtuals: true}});

CommentSchema.virtual('replays' , {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'parent',
})

CommentSchema.plugin(timestamp);
CommentSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Comment' , CommentSchema);
