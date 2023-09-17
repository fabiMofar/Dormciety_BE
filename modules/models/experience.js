const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const ExperienceSchema = new Schema({
    student : { type: Schema.Types.ObjectId , ref : 'Student', required: true},
    dormitory : { type : Schema.Types.ObjectId , ref : 'Dormitory' , required: true},
    images : {type : Array},
    description  : { type: String, required: true },
    deleted : { type : Boolean , default : false},
    online : { type : Boolean , default: true}
})

ExperienceSchema.plugin(timestamp);
ExperienceSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Experience', ExperienceSchema)
