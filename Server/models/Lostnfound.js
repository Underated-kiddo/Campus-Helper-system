const mongoose = require("mongoose");

const lostnfoundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    contact: { type: String },
    picture: { type: String } // path or URL of uploaded image
});

module.exports = mongoose.model("LostNFound", lostnfoundSchema);