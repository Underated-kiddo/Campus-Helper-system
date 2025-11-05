const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: {
        type: String,
        enum: ["admin", "student", "school"],
        required: true,
    },
    bio: String,
    contact: String,
    notifications: { type: Boolean, default: true },
    privateMode: { type: Boolean, default: false },
    profilePic: String,
    password: String,
},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
