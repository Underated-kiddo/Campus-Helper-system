import React, { useState, useEffect } from "react";
import { Users, Book, ClipboardList, MessageSquare, BarChart3, Settings, Menu, LogOut, User } from "lucide-react";
import API from "../services/api";
import { toast } from "@/components/ui/toast";

export default function SchoolDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [schoolName, setSchoolName] = useState("My School");
    const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, announcements: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [topCourses, setTopCourses] = useState([]);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setSchoolName(parsed.name || "My School");
        }

        const fetchDashboardData = async () => {
            try {
                const res = await API.get("/school/dashboard");
                const data = res.data;

                setSchoolName(data.schoolName || (storedUser && JSON.parse(storedUser).name) || "School Admin");
                setStats({
                    students: data.totalStudents || 0,
                    teachers: data.totalTeachers || 0,
                    courses: data.totalCourses || 0,
                    announcements: data.announcementsCount || 0,
                });
                setRecentActivity(data.recentActivity || []);
                setTopCourses(data.topCourses || []);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || "Failed to load school dashboard data",
                    variant: "destructive",
                });
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast({
            title: "Logged out",
            description: "You have been logged out successfully.",
        });
        window.location.href = "/login"; 
    };

    return (
        <div className={`flex min-h-screen transition-all duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            <aside
                className={`h-screen fixed left-0 top-0 shadow-xl p-4 flex flex-col justify-between transition-all duration-300 ${darkMode ? "bg-gray-800/95" : "bg-white/90"}`}
                style={{ width: sidebarOpen ? "230px" : "80px" }}
            >
                <div>
                    <div className="flex justify-between items-center mb-8">
                        {sidebarOpen && <h1 className="text-xl font-bold tracking-wide">Campus Helper</h1>}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:text-blue-500 transition-colors">
                            <Menu />
                        </button>
                    </div>

                    <nav className="space-y-3">
                        {[
                            { icon: <Users />, label: "Students" },
                            { icon: <Book />, label: "Announcements" },
                            { icon: <BarChart3 />, label: "Reports" },
                            { icon: <Settings />, label: "Settings" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                            >
                                {item.icon}
                                {sidebarOpen && <span className="text-sm">{item.label}</span>}
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto border-t dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-3 p-2 hover:bg-white/15 rounded-xl cursor-pointer">
                        <User size={18} />
                        {sidebarOpen && <span>{schoolName}</span>}
                    </div>
                    <div
                        className="flex items-center gap-3 p-2 hover:bg-white/15 rounded-xl cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        {sidebarOpen && <span>Logout</span>}
                    </div>
                </div>
            </aside>

            <main
                className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-[230px]" : "ml-[80px]"} p-8`}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight">
                        Welcome, {schoolName} 👋
                    </h2>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-4 py-2 rounded-full bg-blue-600 text-white shadow-md hover:scale-105 hover:bg-blue-700 transition-transform duration-200"
                    >
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>
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
                            className={`rounded-2xl shadow-lg p-6 text-center transition-transform duration-300 hover:scale-[1.03] ${darkMode ? "bg-gray-800/80" : "bg-white/90"} backdrop-blur-md border border-gray-200 dark:border-gray-700`}
                        >
                            <h3 className="text-md font-semibold mb-1">{card.title}</h3>
                            <p className="text-4xl font-bold text-blue-600">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div
                        className={`flex-1 rounded-2xl shadow-lg p-6 ${darkMode ? "bg-gray-800/80" : "bg-white/90"} border border-gray-200 dark:border-gray-700 backdrop-blur-md`}
                    >
                        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                            {recentActivity.length > 0 ? (
                                recentActivity.slice(0, 8).map((a, i) => (
                                    <li key={i} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <p className="font-medium">{a.description}</p>
                                        <p className="text-sm text-gray-500">{a.date}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-6">No recent activity yet.</p>
                            )}
                        </ul>
                    </div>

                    <div
                        className={`flex-1 rounded-2xl shadow-lg p-6 ${darkMode ? "bg-gray-800/80" : "bg-white/90"} border border-gray-200 dark:border-gray-700 backdrop-blur-md`}
                    >
                        <h3 className="text-lg font-semibold mb-4">Top Performing Courses</h3>
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
                                            <td colSpan="3" className="text-center py-4 text-gray-400 italic">
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
