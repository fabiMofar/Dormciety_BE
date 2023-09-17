const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');

const FavoriteSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true },
    feed : { type : Schema.Types.ObjectId , ref : 'Feed' , required : true },
})

FavoriteSchema.plugin(timestamp);
FavoriteSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Favorite' , FavoriteSchema);
