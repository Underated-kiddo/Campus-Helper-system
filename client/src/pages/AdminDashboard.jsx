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
import PostDialog  from "@/components/PostDialog";

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
            className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
                }`}
        >

            <aside
                className={`fixed top-0 left-0 h-screen shadow-lg p-4 transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white"
                    } ${sidebarOpen ? "w-56" : "w-20"}`}
            >
                <div className="flex justify-between items-center mb-8">
                    {sidebarOpen && <h1 className="text-xl font-bold">Campus Helper</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
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
                            className={`flex items-center gap-3 p-2 rounded-lg transition duration-150 ${location.pathname === item.path
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-blue-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main
                className={`flex-1 transition-all duration-300 p-6 ${sidebarOpen ? "ml-56" : "ml-20"
                    }`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Welcome, {adminName}</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            {darkMode ? "☀️" : "🌙"}
                        </button>

                        <div className="relative group">
                            <img
                                src="/admin-avatar.png"
                                alt="Admin Avatar"
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
                            />
                            <div className="absolute hidden group-hover:block right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg w-32 z-50">
                                <ul className="text-sm">
                                    <li
                                        className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
                                        onClick={() => navigate("/admin/settings")}
                                    >
                                        <User size={16} /> Account
                                    </li>
                                    <li
                                        className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} /> Logout
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Students", value: stats.students },
                        { title: "Total Schools", value: stats.schools },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl shadow-lg p-5 ${darkMode ? "bg-gray-800" : "bg-white"
                                }`}
                        >
                            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                            <p className="text-3xl font-bold text-blue-500">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div
                    className={`rounded-2xl shadow-lg p-6 mb-8 ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <h3 className="text-lg font-semibold mb-4">
                        User Registrations Over Time
                    </h3>
                    <div className="h-40 flex items-center justify-center text-gray-400">
                        (Chart will render here)
                    </div>
                </div>

                <div
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
                </div>

                <div className="space-y-3">
                    <PostDialog />
                </div>
            </main>
        </div>
    );
}
