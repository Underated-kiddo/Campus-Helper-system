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
                toast.error(err.response?.data?.message || "Failed to load school dashboard");
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div
            className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
                }`}
        >
            {/* Sidebar */}
            <aside
                className={`h-screen fixed left-0 top-0 shadow-lg p-4 transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                style={{
                    width: sidebarOpen ? "220px" : "80px",
                }}
            >
                <div className="flex justify-between items-center mb-8">
                    {sidebarOpen && <h1 className="text-xl font-bold">Campus Helper</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu />
                    </button>
                </div>

                <nav className="space-y-4">
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
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Section */}
            <main
                className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-[220px]" : "ml-[80px]"
                    } p-6`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Welcome, {schoolName}</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            {darkMode ? "☀️" : "🌙"}
                        </button>

                        <div className="relative group">
                            <img
                                src="/school-avatar.png"
                                alt="School Avatar"
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
                            />
                            <div className="absolute hidden group-hover:block right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg w-32">
                                <ul className="text-sm">
                                    <li className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center gap-2 cursor-pointer">
                                        <User size={16} /> Profile
                                    </li>
                                    <li className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 flex items-center gap-2 cursor-pointer">
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
                        { title: "Teachers", value: stats.teachers },
                        { title: "Courses", value: stats.courses },
                        { title: "Announcements", value: stats.announcements },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl shadow-lg p-5 transition-transform duration-300 hover:scale-[1.02] ${darkMode ? "bg-gray-800" : "bg-white"
                                }`}
                        >
                            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                            <p className="text-3xl font-bold text-blue-500">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div
                    className={`rounded-2xl shadow-lg p-6 mb-8 ${darkMode ? "bg-gray-800" : "bg-white"
                        } transition-all duration-300`}
                >
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <ul className="space-y-3">
                        {recentActivity.length > 0 ? (
                            recentActivity.slice(0, 5).map((a, i) => (
                                <li
                                    key={i}
                                    className="border-b pb-2 border-gray-200 dark:border-gray-700"
                                >
                                    <p className="font-medium">{a.description}</p>
                                    <p className="text-sm text-gray-500">{a.date}</p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4">
                                No recent activity yet.
                            </p>
                        )}
                    </ul>
                </div>

                <div
                    className={`rounded-2xl shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"
                        } transition-all duration-300`}
                >
                    <h3 className="text-lg font-semibold mb-4">Top Performing Courses</h3>
                    <table className="w-full text-sm">
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
                                    <td colSpan="3" className="text-center py-4 text-gray-400">
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
