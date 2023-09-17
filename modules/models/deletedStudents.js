const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const DeletedStudentSchema = new Schema({
    student : { type : Schema.Types.ObjectId ,  ref : 'Student' , required : true},
    deleted_at : { type : String , required : true },
    delete_reason : { type : String , required : true},
})

DeletedStudentSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('DeletedStudent' , DeletedStudentSchema);

