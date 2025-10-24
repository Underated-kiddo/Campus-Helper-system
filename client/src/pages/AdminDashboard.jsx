import React, { useState, useEffect } from "react";
import {
    BarChart3,
    Users,
    School,
    Bell,
    MessageSquare,
    Settings,
    Menu,
    LogOut,
    User,
} from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [adminName, setAdminName] = useState("Admin Brad");
    const [stats, setStats] = useState({
        students: 0,
        schools: 0,
        logins: 0,
        tickets: 0,
    });
    const [activities, setActivities] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Fetch dashboard data from backend
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/admin/dashboard"); 
                const data = res.data;

                setStats({
                    students: data.totalStudents,
                    schools: data.totalSchools,
                    logins: data.recentLogins,
                    tickets: data.supportTickets,
                });
                setActivities(data.recentActivities);
                setChartData(data.userRegistrations);
                setAdminName(data.adminName || "Admin Brad");
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div
            className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
                }`}
        >
            {/* Sidebar */}
            <motion.aside
                animate={{ width: sidebarOpen ? 220 : 80 }}
                className={`h-screen fixed left-0 top-0 shadow-lg p-4 transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white"
                    }`}
            >
                <div className="flex justify-between items-center mb-8">
                    {sidebarOpen && <h1 className="text-xl font-bold">Campus Helper</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu />
                    </button>
                </div>

                <nav className="space-y-4">
                    {[
                        { icon: <BarChart3 />, label: "Overview" },
                        { icon: <Users />, label: "Manage Students" },
                        { icon: <School />, label: "Manage Schools" },
                        { icon: <Bell />, label: "Announcements" },
                        { icon: <MessageSquare />, label: "Messages" },
                        { icon: <Settings />, label: "Settings" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                        </motion.div>
                    ))}
                </nav>
            </motion.aside>

            {/* Main Section */}
            <main
                className={`flex-1 ml-${sidebarOpen ? "56" : "20"} p-6 transition-all duration-300`}
            >
                {/* Navbar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Welcome, {adminName}</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>

                        <div className="relative group">
                            <img
                                src="/admin-avatar.png"
                                alt="Admin Avatar"
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
                            />
                            <div className="absolute hidden group-hover:block right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg w-32">
                                <ul className="text-sm">
                                    <li className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center gap-2 cursor-pointer">
                                        <User size={16} /> Account
                                    </li>
                                    <li className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center gap-2 cursor-pointer">
                                        <LogOut size={16} /> Logout
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Students", value: stats.students },
                        { title: "Total Schools", value: stats.schools },
                        { title: "Recent Logins", value: stats.logins },
                        { title: "Support Tickets", value: stats.tickets },
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`rounded-2xl shadow-lg p-5 ${darkMode ? "bg-gray-800" : "bg-white"
                                }`}
                        >
                            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                            <p className="text-3xl font-bold text-blue-500">{card.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Chart Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl shadow-lg p-6 mb-8 ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <h3 className="text-lg font-semibold mb-4">
                        User Registrations Over Time
                    </h3>
                    {/* Placeholder for chart */}
                    <div className="h-40 flex items-center justify-center text-gray-400">
                        (Chart will render here)
                    </div>
                </motion.div>

                {/* Recent Activity Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b border-gray-300 dark:border-gray-700">
                                <th className="p-2">User</th>
                                <th className="p-2">Action</th>
                                <th className="p-2">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.length > 0 ? (
                                activities.slice(0, 5).map((act, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-gray-200 dark:border-gray-700"
                                    >
                                        <td className="p-2">{act.user}</td>
                                        <td className="p-2">{act.action}</td>
                                        <td className="p-2">{act.time}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-400">
                                        No recent activity found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
