const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProfileSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true},
    mobile : { type : String },
    showMobileNr : { type : Boolean , default : false},
    birthday : { type : Date },
    showBirthday : { type : Boolean , default : false},
    sex : { type : String },
    showSex : { type : Boolean , default : false},
    subject : { type : String },
    showSubject : { type : Boolean , default : false},
    inDorm : { type : String},
    showInDorm : { type : Boolean , default : false},
    degree : { type : String },
    showDegree : { type : Boolean , default : false},
    hobbies : { type : String },
    showHobbies : { type : Boolean , default : false},
    statement : { type : String },
    showStatement : { type : Boolean , default : false},
    roomNr : { type : String},
    showRoomNr : { type : Boolean , default : false},
    languages : { type : String },
    showLanguages : { type : Boolean , default : false}
});


module.exports = mongoose.model('Profile', ProfileSchema);
