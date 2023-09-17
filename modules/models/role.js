const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


const RoleSchema = new Schema({
    name : { type: String, required: true , unique: true},
    label : { type : String, required: true },
    permissions : [{ type : Schema.Types.ObjectId , ref : 'Permission'}]
} , {toJSON: {virtuals: true}});

RoleSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Role', RoleSchema);
