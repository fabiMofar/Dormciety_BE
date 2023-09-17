const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');



const CouncilVerificationSchema = new Schema({
    student : { type : Schema.Types.ObjectId , ref : 'Student' , required : true , unique : true},
    protocol_image : { type :Object  },
    protocol_attachment : { type : String},
    review : { type : String  },
    reviewed_by : { type :Schema.Types.ObjectId , ref : 'User' },
    review_note : { type : String },
    review_date : { type : String },
});

CouncilVerificationSchema.plugin(timestamp);
CouncilVerificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('CouncilVerification', CouncilVerificationSchema);
