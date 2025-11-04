const Announcement = require("../models/Announcement");

// Create a new announcement
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: "Title and message are required." });
        }

        const announcement = new Announcement({ title, message });
        await announcement.save();

        res.status(201).json({ message: "Announcement created successfully.", announcement });
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ message: "Server error while creating announcement." });
    }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Server error while fetching announcements." });
    }
};

// Get a single announcement by ID
exports.getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found." });
        }
        res.status(200).json(announcement);
    } catch (error) {
        console.error("Error fetching announcement:", error);
        res.status(500).json({ message: "Server error while fetching announcement." });
    }
};

// Update an announcement
exports.updateAnnouncement = async (req, res) => {
    try {
        const { title, message } = req.body;

        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { title, message },
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found." });
        }

        res.status(200).json({ message: "Announcement updated successfully.", announcement });
    } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({ message: "Server error while updating announcement." });
    }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found." });
        }
        res.status(200).json({ message: "Announcement deleted successfully." });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ message: "Server error while deleting announcement." });
    }
};
