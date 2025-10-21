const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title : {type: String , required: true},
    description:String ,
    ownership : { type : mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Requests", requestSchema);