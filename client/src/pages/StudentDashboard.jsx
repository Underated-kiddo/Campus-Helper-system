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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/toast"; // ✅ Import toast directly

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
    const navigate = useNavigate();

    useEffect(() => {
        // Load student name from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setStudentName(parsed.name || "Student");
        }

        // Fetch dashboard data
        const fetchDashboardData = async () => {
            try {
                const res = await API.get("/student/dashboard");
                const data = res.data;

                setStats({
                    announcements: data.newAnnouncements || 0,
                    performance: data.performancePercentage || 0,
                });
                setAnnouncements(data.announcements || []);
            } catch (err) {
                console.error("Error fetching student dashboard data:", err);
                toast({
                    title: "Error",
                    description:
                        err.response?.data?.message || "Failed to load dashboard data",
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
        navigate("/login");
    };

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
                            <h1 className="text-xl font-bold tracking-wide">
                                Campus Helper
                            </h1>
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
                        {sidebarOpen && <span>{studentName}</span>}
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

                {/* Your forms */}
                <TutorForm />
                <FoundForm />
                <ResearchForm />
            </main>
        </div>
    );
}
