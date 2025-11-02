import React, { useState, useEffect } from "react";
import {
    Users,
    Book,
    ClipboardList,
    MessageSquare,
    BarChart3,
    Settings,
    Menu,
    LogOut,
    User,
} from "lucide-react";
import API from "../services/api";
import { toast } from "@/components/ui/toast";

export default function SchoolDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [schoolName, setSchoolName] = useState("My School");
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        courses: 0,
        announcements: 0,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [topCourses, setTopCourses] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                console.log("Fetching from base:", import.meta.env.VITE_API_URL); // ✅ for sanity check
                const res = await API.get("/school/dashboard");
                const data = res.data;

                setSchoolName(data.schoolName);
                setStats({
                    students: data.totalStudents,
                    teachers: data.totalTeachers,
                    courses: data.totalCourses,
                    announcements: data.announcementsCount,
                });
                setRecentActivity(data.recentActivity);
                setTopCourses(data.topCourses);
            } catch (err) {
                console.error("Error fetching school dashboard data:", err);
                toast.error(
                    err.response?.data?.message || "Failed to load school dashboard"
                );
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div
            className={`flex min-h-screen transition-all duration-500 ${
                darkMode
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200"
                    : "bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-900"
            }`}
        >
            {/* Sidebar */}
            <aside
                className={`h-screen fixed left-0 top-0 shadow-xl p-4 flex flex-col justify-between transition-all duration-300 ${
                    darkMode ? "bg-gray-800/95" : "bg-white/90"
                } backdrop-blur-md border-r border-gray-200 dark:border-gray-700`}
                style={{
                    width: sidebarOpen ? "230px" : "80px",
                }}
            >
                <div>
                    <div className="flex justify-between items-center mb-8">
                        {sidebarOpen && (
                            <h1 className="text-xl font-bold tracking-wide">
                                Campus Helper
                            </h1>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hover:text-blue-500 transition-colors"
                        >
                            <Menu />
                        </button>
                    </div>

                    <nav className="space-y-3">
                        {[
                            { icon: <Users />, label: "Students" },
                            { icon: <Book />, label: "Courses" },
                            { icon: <ClipboardList />, label: "Attendance" },
                            { icon: <MessageSquare />, label: "Messages" },
                            { icon: <BarChart3 />, label: "Reports" },
                            { icon: <Settings />, label: "Settings" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                            >
                                {item.icon}
                                {sidebarOpen && (
                                    <span className="text-sm">{item.label}</span>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto border-t dark:border-gray-700 pt-4">
                    {sidebarOpen && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
                            © 2025 Campus Helper
                        </p>
                    )}
                </div>
            </aside>

            {/* Main Section */}
            <main
                className={`flex-1 transition-all duration-300 ${
                    sidebarOpen ? "ml-[230px]" : "ml-[80px]"
                } p-8`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight">
                        Welcome, {schoolName}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-4 py-2 rounded-full bg-blue-600 text-white shadow-md hover:scale-105 hover:bg-blue-700 transition-transform duration-200"
                        >
                            {darkMode ? "☀️ Light" : "🌙 Dark"}
                        </button>

                        <div className="relative group">
                            <img
                                src="/school-avatar.png"
                                alt="School Avatar"
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
                            />
                            <div className="absolute hidden group-hover:block right-0 mt-3 bg-white dark:bg-gray-700 shadow-xl rounded-lg w-36 overflow-hidden">
                                <ul className="text-sm">
                                    <li className="p-3 hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center gap-2 cursor-pointer">
                                        <User size={16} /> Profile
                                    </li>
                                    <li className="p-3 hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center gap-2 cursor-pointer">
                                        <LogOut size={16} /> Logout
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {[
                        { title: "Total Students", value: stats.students },
                        { title: "Teachers", value: stats.teachers },
                        { title: "Courses", value: stats.courses },
                        { title: "Announcements", value: stats.announcements },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl shadow-lg p-6 text-center transition-transform duration-300 hover:scale-[1.03] ${
                                darkMode ? "bg-gray-800/80" : "bg-white/90"
                            } backdrop-blur-md border border-gray-200 dark:border-gray-700`}
                        >
                            <h3 className="text-md font-semibold mb-1">{card.title}</h3>
                            <p className="text-4xl font-bold text-blue-600">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Flex Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Activity */}
                    <div
                        className={`flex-1 rounded-2xl shadow-lg p-6 ${
                            darkMode ? "bg-gray-800/80" : "bg-white/90"
                        } border border-gray-200 dark:border-gray-700 backdrop-blur-md`}
                    >
                        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                            {recentActivity.length > 0 ? (
                                recentActivity.slice(0, 8).map((a, i) => (
                                    <li
                                        key={i}
                                        className="border-b border-gray-200 dark:border-gray-700 pb-2"
                                    >
                                        <p className="font-medium">{a.description}</p>
                                        <p className="text-sm text-gray-500">{a.date}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-6">
                                    No recent activity yet.
                                </p>
                            )}
                        </ul>
                    </div>

                    {/* Right Column - Table */}
                    <div
                        className={`flex-1 rounded-2xl shadow-lg p-6 ${
                            darkMode ? "bg-gray-800/80" : "bg-white/90"
                        } border border-gray-200 dark:border-gray-700 backdrop-blur-md`}
                    >
                        <h3 className="text-lg font-semibold mb-4">
                            Top Performing Courses
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="text-left border-b border-gray-300 dark:border-gray-700">
                                        <th className="p-2">Course</th>
                                        <th className="p-2">Instructor</th>
                                        <th className="p-2">Average Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCourses.length > 0 ? (
                                        topCourses.map((course, i) => (
                                            <tr
                                                key={i}
                                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
                                            >
                                                <td className="p-2">{course.name}</td>
                                                <td className="p-2">{course.instructor}</td>
                                                <td className="p-2">{course.averageGrade}%</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="text-center py-4 text-gray-400 italic"
                                            >
                                                No data available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
