const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : { type: String , required: true , unique: true },
    password : {type: String , required: true },
    // Normalize roles to lowercase strings: 'student', 'school', 'admin'
    role : { type: String , enum: ["student" , "school" , "admin"] , default: "student" }
});

module.exports = mongoose.model("User", userSchema );