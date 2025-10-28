import express from "express";
import Tutor from "../models/Tutor.js";

const router = express.Router();

//save the student info
router.post("/", async (req, res) => {
    try {
        const newTutor = await Tutor.create(req.body);
        res.status(201).json(newTutor);
    } catch (error) {
        res.status(500).json({ message: "Error saving tutor", error: error.message });
    }
});

//retrieves the info
router.get("/", async (req, res) => {
    try {
        const tutors = await Tutor.find().sort({ createdAt: -1 });
        res.status(200).json(tutors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tutors", error: error.message });
    }
});

export default router;
