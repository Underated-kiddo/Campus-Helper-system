const mongoose = require("mongoose");

const lostnfoundSchema = new mongoose.Schema(
    {
        Full_name: {
            name: {
                type: String,
                required: [true, "Finder's name is required"],
                trim: true,
            },
            phone_number: {
                type: String,
                required: [true, "Phone number is required"],
                trim: true,
            },
        },
        item_found: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
        },
        item_description: {
            type: String,
            required: [true, "Item description is required"],
            trim: true,
        },

        uploaded_image: {
            data: Buffer,
            contentType: String,
            // default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lostnfound", lostnfoundSchema);
