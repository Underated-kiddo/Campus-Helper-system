import { useState, useEffect } from "react";
import { Bell, Settings, Menu, LogOut, User, Users } from "lucide-react";
import API from "@/services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/toast";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Search } from "lucide-react";

export default function SchoolDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [schoolName, setSchoolName] = useState("School");
    const [stats, setStats] = useState({ announcements: 0, students: 0 });
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setSchoolName(parsed.name || "School");
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const res = await API.get("/school/dashboard");
                const data = res.data;

                setStats({
                    announcements: data.newAnnouncements || 0,
                    students: data.totalStudents || 0,
                });
                setAnnouncements(data.announcements || []);
            } catch (err) {
                console.error("Error fetching school dashboard data:", err);
                toast({
                    title: "Error",
                    description:
                        err.response?.data?.message ||
                        "Failed to load dashboard data",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
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
                            { icon: <Bell />, label: "Announcements", path: "/announcements" },
                            {icon: <Search/>, label:"Lost n' found", path:"/lostnfound"},
                            { icon: <Settings />, label: "Settings", path: "/settings" },
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

            {/* Main content */}
            <main
                className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? "ml-[230px]" : "ml-[80px]"
                    }`}
            >
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-[#2b4b6f] dark:text-[#7b9ecb]">
                        Welcome, {schoolName}
                    </h2>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#2b4b6f] to-[#7b3f00] text-white hover:from-[#1f3a5b] hover:to-[#5c2e00] shadow-md transition"
                    >
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2b4b6f]"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {[
                                {
                                    title: "New Announcements",
                                    value: stats.announcements,
                                    icon: <Bell className="text-[#2b4b6f] dark:text-[#7b9ecb]" />,
                                },
                                {
                                    title: "Registered Students",
                                    value: stats.students,
                                    icon: <Users className="text-[#2b4b6f] dark:text-[#7b9ecb]" />,
                                },
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    className={`p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${darkMode ? "bg-[#2c2a26]" : "bg-white"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p
                                                className={`text-sm font-medium ${darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                {card.title}
                                            </p>
                                            <p className="text-2xl font-bold mt-2 text-[#2b4b6f] dark:text-[#7b9ecb]">
                                                {card.value}
                                            </p>
                                        </div>
                                        {card.icon}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Announcements */}
                        {announcements.length > 0 && (
                            <div
                                className={`mb-8 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${darkMode ? "bg-[#2c2a26]" : "bg-white"
                                    }`}
                            >
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-semibold text-[#2b4b6f] dark:text-[#7b9ecb]">
                                        Recent Announcements
                                    </h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    {announcements.map((announcement, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-md ${darkMode
                                                ? "bg-[#1c1a17]"
                                                : "bg-gray-50"
                                                }`}
                                        >
                                            <h4 className="font-semibold text-[#2b4b6f] dark:text-[#7b9ecb]">
                                                {announcement.title}
                                            </h4>
                                            <p
                                                className={`mt-1 ${darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                {announcement.message}
                                            </p>
                                            {announcement.date && (
                                                <p
                                                    className={`text-xs mt-2 ${darkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-500"
                                                        }`}
                                                >
                                                    {new Date(
                                                        announcement.date
                                                    ).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
