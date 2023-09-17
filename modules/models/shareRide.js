const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const ShareRideSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true},
    dormitory : { type : Schema.Types.ObjectId , ref : 'Dormitory' , required : true},
    locationFrom : { type : String , required : true},
    locationTo : { type : String , required : true},
    sitCount : { type : Number , required : true},
    description : { type : String },
    smoke : { type : Boolean  , default : false},
    animal : { type : Boolean , default : false},
    baggage : { type : Boolean , default : false},
    departureDate : { type : Date , required : true},
    departureTime : { type : String , required : true},
    freeSit : { type : Number  },
    price : { type : String , required : true},
    deleted : { type : Boolean , default : false},
    online : { type : Boolean , default : true},
});

ShareRideSchema.plugin(timestamp);
ShareRideSchema.plugin(mongoosePaginate);

ShareRideSchema.virtual('members' , {
    ref : 'Member',
    localField : '_id',
    foreignField : 'shareRide'
})


module.exports = mongoose.model('ShareRide', ShareRideSchema);
