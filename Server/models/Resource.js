const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        unit: { type: String, default: "" },
        description: { type: String, default: "" },
        author: { type: String, default: "" },
        filePath: { type: String, required: true }, // path on disk
        filename: { type: String, required: true }, // original file name
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
