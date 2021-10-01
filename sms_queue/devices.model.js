const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DevicesSchema = new Schema({
    number:String,
    message:String,
    alert:mongoose.Schema.Types.ObjectId,
    date:Date,
    created: {
        type: Date,
        default: Date.now, 
        required:true
    }
});


module.exports = mongoose.model('devicesSms', DevicesSchema);