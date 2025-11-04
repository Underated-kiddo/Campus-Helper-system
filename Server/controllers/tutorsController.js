const Tutor = require("../models/Tutor");

// Create a new tutor
const createTutor = async (req, res) => {
    try {
        const { name, unit, email, phone } = req.body;
        if (!name || !unit || !email || !phone) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const tutor = await Tutor.create({ name, unit, email, phone });
        res.status(201).json(tutor);
    } catch (error) {
        console.error("Error creating tutor:", error);
        res.status(500).json({ message: "Error saving tutor", error: error.message });
    }
};

// Get all tutors
const getTutors = async (_req, res) => {
    try {
        const tutors = await Tutor.find().sort({ createdAt: -1 });
        res.status(200).json(tutors);
    } catch (error) {
        console.error("Error fetching tutors:", error);
        res.status(500).json({ message: "Error fetching tutors", error: error.message });
    }
};

// Get a tutor by ID
const getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) return res.status(404).json({ message: "Tutor not found." });
        res.status(200).json(tutor);
    } catch (error) {
        console.error("Error fetching tutor:", error);
        res.status(500).json({ message: "Error fetching tutor", error: error.message });
    }
};

// Update a tutor
const updateTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!tutor) return res.status(404).json({ message: "Tutor not found." });
        res.status(200).json(tutor);
    } catch (error) {
        console.error("Error updating tutor:", error);
        res.status(500).json({ message: "Error updating tutor", error: error.message });
    }
};

// Delete a tutor
const deleteTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findByIdAndDelete(req.params.id);
        if (!tutor) return res.status(404).json({ message: "Tutor not found." });
        res.status(200).json({ message: "Tutor deleted successfully." });
    } catch (error) {
        console.error("Error deleting tutor:", error);
        res.status(500).json({ message: "Error deleting tutor", error: error.message });
    }
};

module.exports = {
    createTutor,
    getTutors,
    getTutorById,
    updateTutor,
    deleteTutor,
};
