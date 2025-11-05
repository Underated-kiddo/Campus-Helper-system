import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Users, Building, LogIn, HelpCircle, Menu, User, LogOut, Settings } from "lucide-react";
import API from "@/services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookAIcon } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function AdminDashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState({ students: 0, schools: 0, logins: 0, tickets: 0 });
    const [activities, setActivities] = useState([]);
    const [adminName, setAdminName] = useState("Admin");
    const [adminProfilePic, setAdminProfilePic] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDarkMode = () => setDarkMode(!darkMode);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setAdminName(parsed.name || "Admin");
            setAdminProfilePic(parsed.profilePic || "");
        }

        const fetchData = async () => {
            try {
                const res = await API.get("/admin/dashboard");
                const data = res.data;

                setStats({
                    students: data.totalStudents || 0,
                    schools: data.totalSchools || 0,
                    logins: data.recentLogins || 0,
                    tickets: data.recentTickets || 0,
                });

                setActivities(data.recentActivities || []);

                if (data.adminName) setAdminName(data.adminName);
                if (data.profilePic) setAdminProfilePic(data.profilePic);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || "Failed to load dashboard data",
                    variant: "destructive",
                });
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        toast({ title: "Logged out", description: "You have been logged out successfully." });
    };

    return (
        <div className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-[#1a1a1a] text-white" : "bg-[#eaf1f8] text-gray-900"}`}>

            <aside
                className={`fixed top-0 left-0 h-screen p-4 flex flex-col justify-between transition-all duration-300 ${darkMode ? "bg-[#2b4b6f] text-white" : "bg-[#2b4b6f] text-white"}`}
                style={{ width: sidebarOpen ? "230px" : "80px" }}
            >
                <div>
                    <div className="flex justify-between items-center mb-10">
                        {sidebarOpen && <h1 className="text-xl font-bold tracking-wide text-white">Campus Helper</h1>}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/20 transition">
                            <Menu />
                        </button>
                    </div>

                    <nav className="space-y-3">
                        {[
                            { icon: <BookOpen />, label: "Research ", path: "/Research" },
                            { icon: <Users />, label: "Lost & Found", path: "/Lostnfound" },
                            { icon: <Building />, label: "Announcements", path: "/Announcements" },
                            { icon: <Settings />, label: "Settings", path: "/Settings" },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                    location.pathname === item.path
                                        ? "bg-[#1f3a5a] text-white border-l-4 border-[#d2b48c]"
                                        : "hover:bg-[#1f3a5a]/50 text-white"
                                }`}
                            >
                                {item.icon}
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="mt-8 border-t border-white/20 pt-4">
                    <div className="flex items-center gap-3 p-2 hover:bg-[#1f3a5a]/50 rounded-xl cursor-pointer">
                        {sidebarOpen ? (
                            <img
                                src={adminProfilePic || "https://via.placeholder.com/40?text=A"}
                                alt="Admin Avatar"
                                className="h-10 w-10 rounded-full object-cover border-2 border-[#d2b48c]"
                            />
                        ) : (
                            <User size={18} />
                        )}
                        {sidebarOpen && <span className="text-white">{adminName}</span>}
                    </div>
                    <div
                        className="flex items-center gap-3 p-2 hover:bg-[#1f3a5a]/50 rounded-xl cursor-pointer mt-2"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        {sidebarOpen && <span className="text-white">Logout</span>}
                    </div>
                </div>
            </aside>

            <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-[230px]" : "ml-[80px]"}`}>

                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#2b4b6f]"}`}>Welcome, {adminName || "Admin"} 👋</h1>
                    <Button
                        variant="outline"
                        size="icon"
                        className={`${darkMode ? "bg-[#d2b48c] text-black hover:bg-[#c3a678]" : "bg-[#2b4b6f] text-white hover:bg-[#223b58]"}`}
                        onClick={toggleDarkMode}
                    >
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {[
                        { title: "Total Students", value: stats.students, icon: <Users className="h-5 w-5" /> },
                        { title: "Total Schools", value: stats.schools, icon: <Building className="h-5 w-5" /> },
                        { title: "Recent Logins", value: stats.logins, icon: <LogIn className="h-5 w-5" /> },
                    ].map((stat, i) => (
                        <Card
                            key={i}
                            className={`border rounded-2xl shadow-md transition-transform duration-300 hover:scale-[1.02] ${darkMode ? "bg-[#1f3a5a] border-[#d2b48c]" : "bg-white border-[#d2b48c]"}`}
                        >
                            <CardHeader>
                                <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-white" : "text-[#2b4b6f]"}`}>
                                    {stat.icon} {stat.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={`${darkMode ? "text-white" : "text-gray-900"} text-3xl font-semibold`}>{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card
                    className={`border rounded-2xl shadow-md transition-transform duration-300 hover:scale-[1.02] ${darkMode ? "bg-[#1f3a5a] border-[#d2b48c]" : "bg-white border-[#d2b48c]"}`}
                >
                    <CardHeader>
                        <CardTitle className={`${darkMode ? "text-white" : "text-[#2b4b6f]"}`}>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activities.length > 0 ? (
                            <ul className={`${darkMode ? "text-white" : "text-gray-900"} list-disc pl-6 space-y-2`}>
                                {activities.map((activity, index) => (
                                    <li key={index}>{activity}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>No recent activities found.</p>
                        )}
                    </CardContent>
                </Card>

            </main>
        </div>
    );
}
