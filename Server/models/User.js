const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "school", "admin"], default: "student" },

    // Optional fields for settings
    bio: { type: String, default: "" },
    contact: { type: String, default: "" },
    notifications: { type: Boolean, default: true },
    privateMode: { type: Boolean, default: false },
    profilePic: { type: String, default: null }, 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
