const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        unit: { type: String },
        description: { type: String },
        author: { type: String },
        fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
        filename: { type: String, required: true },
        contentType: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
