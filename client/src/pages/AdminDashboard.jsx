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
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "@/components/ui/toast"; // fixed toast import
import PostDialog from "@/components/PostDialog";

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [adminName, setAdminName] = useState("Brad");
    const [stats, setStats] = useState({
        students: 0,
        schools: 0,
        logins: 0,
        tickets: 0,
    });
    const [activities, setActivities] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get("/admin/dashboard");
                const data = res.data;

                setStats({
                    students: data.totalStudents,
                    schools: data.totalSchools,
                    logins: data.recentLogins,
                    tickets: data.supportTickets,
                });
                setActivities(data.recentActivities);
                setAdminName(data.adminName || " Brad");
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                toast.error(
                    err.response?.data?.message || "Failed to load dashboard data"
                );
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        toast.success("Logged out successfully!");
    };

    return (
        <div
            className={`flex min-h-screen transition-all duration-300 ${darkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-[#3b2f2f] text-gray-100"
                : "bg-gradient-to-br from-blue-50 via-white to-[#e8dfd1] text-gray-900"
                }`}
        >
            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 h-screen shadow-2xl p-4 transition-all duration-300 ${darkMode
                    ? "bg-[#2c2a29] border-r border-gray-700"
                    : "bg-white border-r border-blue-100"
                    } ${sidebarOpen ? "w-56" : "w-20"}`}
            >
                <div className="flex justify-between items-center mb-8">
                    {sidebarOpen && (
                        <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-[#8b6b4c] bg-clip-text text-transparent">
                            Campus Helper
                        </h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <Menu />
                    </button>
                </div>

                <nav className="space-y-3">
                    {[
                        { icon: <BarChart3 />, label: "Overview", path: "/admin/overview" },
                        { icon: <Users />, label: "Students", path: "/admin/students" },
                        { icon: <School />, label: "Schools", path: "/admin/schools" },
                        { icon: <Bell />, label: "Announcements", path: "/admin/announcements" },
                        { icon: <Settings />, label: "Settings", path: "/admin/settings" },
                    ].map((item, i) => (
                        <Link
                            key={i}
                            to={item.path}
                            className={`flex items-center gap-3 p-2 rounded-lg transition duration-150 font-medium ${location.pathname === item.path
                                ? "bg-gradient-to-r from-blue-600 to-[#8b6b4c] text-white shadow-md"
                                : "hover:bg-blue-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main
                className={`flex-1 transition-all duration-300 p-6 ${sidebarOpen ? "ml-56" : "ml-20"
                    }`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-[#8b6b4c] bg-clip-text text-transparent">
                        Welcome, {adminName}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-[#8b6b4c] text-white hover:opacity-90 shadow-md"
                        >
                            {darkMode ? "☀️" : "🌙"}
                        </button>

                        <div className="relative group">
                            <img
                                src="/admin-avatar.png"
                                alt="Admin Avatar"
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#8b6b4c] hover:scale-105 transition-transform"
                            />
                            <div className="absolute hidden group-hover:block right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-36 z-50 border border-gray-200 dark:border-gray-700">
                                <ul className="text-sm">
                                    <li
                                        className="p-2 hover:bg-blue-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer rounded-t-lg"
                                        onClick={() => navigate("/admin/settings")}
                                    >
                                        <User size={16} /> Account
                                    </li>
                                    <li
                                        className="p-2 hover:bg-red-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer rounded-b-lg text-red-500"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} /> Logout
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Students", value: stats.students },
                        { title: "Total Schools", value: stats.schools },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl shadow-lg p-5 transform transition duration-200 hover:scale-[1.02] ${darkMode
                                ? "bg-[#2f2b28] border border-gray-700"
                                : "bg-gradient-to-br from-white to-blue-50 border border-blue-100"
                                }`}
                        >
                            <h3 className="text-lg font-semibold mb-2 text-[#8b6b4c] dark:text-blue-400">
                                {card.title}
                            </h3>
                            <p className="text-3xl font-bold text-blue-600 dark:text-[#d7b48c]">
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CHART PLACEHOLDER */}
                <div
                    className={`rounded-2xl shadow-lg p-6 mb-8 ${darkMode
                        ? "bg-[#2f2b28]"
                        : "bg-gradient-to-br from-white to-blue-50"
                        }`}
                >
                    <h3 className="text-lg font-semibold mb-4 text-[#8b6b4c] dark:text-blue-400">
                        User Registrations Over Time
                    </h3>
                    <div className="h-40 flex items-center justify-center text-gray-400 italic">
                        (Chart will render here)
                    </div>
                </div>

                {/* RECENT ACTIVITY TABLE */}
                <div
                    className={`rounded-2xl shadow-lg p-6 ${darkMode
                        ? "bg-[#2f2b28]"
                        : "bg-gradient-to-br from-white to-blue-50"
                        }`}
                >
                    <h3 className="text-lg font-semibold mb-4 text-[#8b6b4c] dark:text-blue-400">
                        Recent Activities
                    </h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b border-gray-300 dark:border-gray-700 text-blue-700 dark:text-[#d7b48c]">
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
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <td className="p-2">{act.user}</td>
                                        <td className="p-2">{act.action}</td>
                                        <td className="p-2">{act.time}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center py-4 text-gray-400 italic"
                                    >
                                        No recent activity found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-3 mt-6">
                    <PostDialog />
                </div>
            </main>
        </div>
    );
}
