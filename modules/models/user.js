const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate');


const UserSchema = new Schema({
    roles : [{ type : Schema.Types.ObjectId , ref : 'Role'}],
    firstname: { type : String, required : true },
    lastname: { type : String, required : true },
    emailWork : { type : String, required : true },
    emailPrivate : { type : String , required : true },
    password : { type : String , required : true },
    username : { type : String , required : true},
    mobile : { type : String , required : true},
    birthday : { type : String , required : true},
    title : { type : String , required : true},
    avatar : { type : Object },
    additional : { type : String },
    street : { type : String , required : true},
    houseNumber : { type : String , required : true},
    postalCode : { type : String , required : true},
    city : { type : String , required : true },
    sex : { type : String , required : true},
    organisation_name : { type : String , required : true},
    organisation_logo : { type : String , required : true},
    active : { type : Boolean , default : true },
    deleted : { type : Boolean , default : false },
});

UserSchema.plugin(timestamp);
UserSchema.plugin(mongoosePaginate);



UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password , this.password);
};

UserSchema.methods.hasRole = function(roles) {
    let result = roles.filter(role => {
        return this.roles.indexOf(role) > -1;
    })

    return !! result.length;
}


module.exports = mongoose.model('User', UserSchema);
