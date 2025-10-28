import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Bell,
    MessageSquare,
    Settings,
    Menu,
    LogOut,
    User,
    Calendar,
} from "lucide-react";
import TutorForm from "@/components/TutorForm";
import API from "../services/api";
import { Link  } from "react-router-dom";
import { toast } from "@/components/ui/toast";

export default function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [studentName, setStudentName] = useState("Student");
    const [stats, setStats] = useState({
        courses: 0,
        assignments: 0,
        announcements: 0,
        performance: 0,
    });
    const [announcements, setAnnouncements] = useState([]);
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await API.get("/student/dashboard");
                const data = res.data;

                setStudentName(data.studentName);
                setStats({
                    courses: data.totalCourses,
                    assignments: data.pendingAssignments,
                    announcements: data.newAnnouncements,
                    performance: data.performancePercentage,
                });
                setAnnouncements(data.announcements);
                setSchedule(data.schedule);
            } catch (err) {
                console.error("Error fetching student dashboard data:", err);
                toast.error(err.response?.data?.message || "Failed to load student dashboard");
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div
            className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
                }`}
        >
            <aside
                className={`h-screen fixed left-0 top-0 shadow-lg p-4 transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                style={{ width: sidebarOpen ? "220px" : "80px" }}
            >
                <div className="flex justify-between items-center mb-8">
                    {sidebarOpen && <h1 className="text-xl font-bold">Campus Helper</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu />
                    </button>
                </div>

                <nav className="space-y-4">
                    {[
                        { icon: <BookOpen />, label: "Research Materials", path: "/pages/Research" },
                        { icon: <Bell />, label: "Announcements", path: "/path/Announcements" },
                        { icon: <MessageSquare />, label: "Tutors", path: "/path/Tutors" },
                        { icon: <Calendar />, label: "Schedule", path: "/pages/schedule" },
                        { icon: <Settings />, label: "Settings", path: "/pages/Settings" },
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
                className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-[220px]" : "ml-[80px]"
                    }`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Welcome, {studentName}</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            {darkMode ? "☀️" : "🌙"}
                        </button>

                        <div className="relative group">
                            <img
                                src="/student-avatar.png"
                                alt="Student Avatar"
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
                        { title: "New Announcements", value: stats.announcements },
                        { title: "Performance (%)", value: stats.performance },
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
                    <h3 className="text-lg font-semibold mb-4">Latest Announcements</h3>
                    <ul className="space-y-3">
                        {announcements.length > 0 ? (
                            announcements.slice(0, 5).map((a, i) => (
                                <li
                                    key={i}
                                    className="border-b pb-2 border-gray-200 dark:border-gray-700"
                                >
                                    <p className="font-medium">{a.title}</p>
                                    <p className="text-sm text-gray-500">{a.date}</p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4">
                                No announcements yet.
                            </p>
                        )}
                    </ul>
                </div>


                {/* Schedule */}
                <div
                    className={`rounded-2xl shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <h3 className="text-lg font-semibold mb-4">My Schedule</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b border-gray-300 dark:border-gray-700">
                                <th className="p-2">Course</th>
                                <th className="p-2">Time</th>
                                <th className="p-2">Lecturer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.length > 0 ? (
                                schedule.map((item, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-gray-200 dark:border-gray-700"
                                    >
                                        <td className="p-2">{item.course}</td>
                                        <td className="p-2">{item.time}</td>
                                        <td className="p-2">{item.lecturer}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-400">
                                        No schedule found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6">
                    <TutorForm />
                </div>
                
            </main>
        </div>
    );
}
