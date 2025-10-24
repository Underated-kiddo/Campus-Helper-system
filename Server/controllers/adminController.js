import User from "../models/User.js";
import Activity from "../models/Activity.js";

export const getAdminDashboardData = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "Student" });
        const totalSchools = await User.countDocuments({ role: "School" });
        const recentLogins = await User.find().sort({ lastLogin: -1 }).limit(10);
        const supportTickets = 12; // Replace with actual collection later

        const recentActivity = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("action createdAt");

        const userRegistrations = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);

        const formattedRegistrations = userRegistrations.map((r) => ({
            month: new Date(0, r._id - 1).toLocaleString("default", { month: "short" }),
            users: r.count,
        }));

        res.status(200).json({
            totalStudents,
            totalSchools,
            recentLogins: recentLogins.length,
            supportTickets,
            recentActivity,
            userRegistrations: formattedRegistrations,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch dashboard data", error: err.message });
    }
};
