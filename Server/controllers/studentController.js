const Announcement = require("../models/Announcement"); // if you have it

// GET /api/student/dashboard
exports.getDashboard = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Access denied. Students only." });
        }

        // Dummy values — replace with real data later
        const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(5);
        const newAnnouncements = announcements.length;
        const performancePercentage = 78; // example: calculate from student records later

        res.json({
            newAnnouncements,
            performancePercentage,
            announcements: announcements.map((a) => ({
                title: a.title,
                message: a.message,
                date: a.createdAt,
            })),
        });
    } catch (err) {
        console.error("Error in student dashboard:", err);
        res.status(500).json({ message: "Failed to load dashboard data" });
    }
};
