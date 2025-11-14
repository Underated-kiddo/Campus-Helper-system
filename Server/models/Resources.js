const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },          // Topic Name
        unit: { type: String, required: true },          // Unit Name
        description: { type: String, required: true },   // Description
        author: { type: String, required: true },        // Author
        fileUrl: { type: String, required: true },       // File path
        fileName: { type: String, required: true },      // Original file name
        fileType: { type: String, required: true },      // MIME type
        fileSize: { type: Number, required: true },      // File size in bytes
        available: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
