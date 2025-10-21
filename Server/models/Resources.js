const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    unit : {type: String , required: true},
    title : {type: String , required: true},
    description:String ,
    ownership : { type : mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Resources", resourceSchema);