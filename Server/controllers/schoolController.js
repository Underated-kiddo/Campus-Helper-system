const User = require("../models/User");
const Announcement = require("../models/Announcement"); // if you have it

// GET /api/school/dashboard
exports.getDashboard = async (req, res) => {
    try {
        // Only school role allowed
        if (req.user.role !== "school") {
            return res.status(403).json({ message: "Access denied. School only." });
        }

        // Fake stats or replace with real logic
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalTeachers = await User.countDocuments({ role: "teacher" });
        const totalCourses = 12; // Replace with Course.countDocuments() if you have that model
        const announcementsCount = await Announcement.countDocuments();

        const recentActivity = [
            { description: "Student John joined Math 101", date: "2025-11-06" },
            { description: "New announcement: Exam schedule released", date: "2025-11-07" },
        ];

        const topCourses = [
            { name: "Physics 101", instructor: "Prof. Kim", averageGrade: 89 },
            { name: "Math 201", instructor: "Dr. Smith", averageGrade: 85 },
        ];

        res.json({
            schoolName: req.user.name,
            totalStudents,
            totalTeachers,
            totalCourses,
            announcementsCount,
            recentActivity,
            topCourses,
        });
    } catch (err) {
        console.error("Error in school dashboard:", err);
        res.status(500).json({ message: "Failed to load dashboard data" });
    }
};
