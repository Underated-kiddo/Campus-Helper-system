import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Bell,
    MessageSquare,
    Settings,
    Menu,
    LogOut,
    User,
} from "lucide-react";
import TutorForm from "@/components/TutorForm";
import FoundForm from "@/components/FoundForm";
import ResearchForm from "@/components/ResearchForm";
import API from "@/services/api";
import { Link, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/toast";

export default function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [studentName, setStudentName] = useState("Student");
    const [stats, setStats] = useState({
        announcements: 0,
        performance: 0,
    });
    const [announcements, setAnnouncements] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await API.get("/student/dashboard");
                const data = res.data;

                setStudentName(data.studentName || "Student");
                setStats({
                    announcements: data.newAnnouncements || 0,
                    performance: data.performancePercentage || 0,
                });
                setAnnouncements(data.announcements || []);
            } catch (err) {
                console.error("Error fetching student dashboard data:", err);
                toast.error(err.response?.data?.message || "Failed to load student dashboard");
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div
            className={`flex min-h-screen transition-all duration-300 ${darkMode
                    ? "bg-[#1c1a17] text-gray-200"
                    : "bg-gradient-to-br from-[#e3f0ff] via-white to-[#fdfaf7] text-gray-900"
                }`}
        >
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen shadow-xl p-4 flex flex-col justify-between transition-all duration-300 ${darkMode
                        ? "bg-[#2c2a26]"
                        : "bg-gradient-to-b from-[#2b4b6f] to-[#7b3f00] text-white"
                    }`}
                style={{ width: sidebarOpen ? "230px" : "80px" }}
            >
                <div>
                    <div className="flex justify-between items-center mb-10">
                        {sidebarOpen && (
                            <h1 className="text-xl font-bold tracking-wide">Campus Helper</h1>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-[#1f3a5b]/40 transition"
                        >
                            <Menu />
                        </button>
                    </div>

                    <nav className="space-y-3">
                        {[
                            { icon: <BookOpen />, label: "Research", path: "/pages/Research" },
                            { icon: <Bell />, label: "Announcements", path: "/pages/Announcements" },
                            { icon: <MessageSquare />, label: "Tutors", path: "/pages/Tutors" },
                            { icon: <Settings />, label: "Settings", path: "/pages/Settings" },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                                        ? "bg-white/25 shadow-lg"
                                        : "hover:bg-white/15"
                                    }`}
                            >
                                {item.icon}
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="mt-8 border-t border-white/20 pt-4">
                    <div className="flex items-center gap-3 p-2 hover:bg-white/15 rounded-xl cursor-pointer">
                        <User size={18} />
                        {sidebarOpen && <span>Profile</span>}
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-white/15 rounded-xl cursor-pointer">
                        <LogOut size={18} />
                        {sidebarOpen && <span>Logout</span>}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? "ml-[230px]" : "ml-[80px]"
                    }`}
            >
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-[#2b4b6f] dark:text-[#7b9ecb]">
                        Welcome, {studentName}
                    </h2>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#2b4b6f] to-[#7b3f00] text-white hover:from-[#1f3a5b] hover:to-[#5c2e00] shadow-md transition"
                    >
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { title: "New Announcements", value: stats.announcements },
                        { title: "Performance (%)", value: stats.performance },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl shadow-xl p-6 backdrop-blur-md border border-[#2b4b6f]/30 ${darkMode
                                    ? "bg-[#2c2a26]/70 border-[#7b3f00]/40"
                                    : "bg-white/80"
                                }`}
                        >
                            <h3 className="text-lg font-semibold mb-2 text-[#7b3f00] dark:text-[#c7a074]">
                                {card.title}
                            </h3>
                            <p className="text-4xl font-bold text-[#2b4b6f]">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div
                    className={`rounded-2xl shadow-xl p-6 mb-10 backdrop-blur-md ${darkMode ? "bg-[#2c2a26]/70" : "bg-white/80"
                        }`}
                >
                    <h3 className="text-xl font-semibold mb-4 text-[#7b3f00] dark:text-[#c7a074]">
                        Latest Announcements
                    </h3>
                    <ul className="space-y-3">
                        {announcements.length > 0 ? (
                            announcements.slice(0, 5).map((a, i) => (
                                <li
                                    key={i}
                                    className="border-b border-[#2b4b6f]/20 dark:border-[#7b3f00]/30 pb-2"
                                >
                                    <p className="font-medium text-[#2b4b6f]">{a.title}</p>
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

                <div className="mt-10 space-y-8">
                    <TutorForm />
                    <FoundForm />
                    <ResearchForm />
                </div>
            </main>
        </div>
    );
}
