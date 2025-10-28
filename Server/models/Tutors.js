import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        unit: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Tutor", tutorSchema);
