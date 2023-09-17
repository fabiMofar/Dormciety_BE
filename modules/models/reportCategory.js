const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const ReportCategorySchema = new Schema({
    label : { type : String, required : true , unique : true },
})

ReportCategorySchema.plugin(timestamp);
ReportCategorySchema.plugin(mongoosePaginate);



module.exports = mongoose.model('ReportCategory', ReportCategorySchema);
