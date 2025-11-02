import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Toaster from "@/components/ui/sonner";
import { toast } from "@/components/ui/toast";

const BASE_URL = import.meta.env.VITE_API_URL; // ✅ Load from .env

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: "", message: "" });
    const [userRole, setUserRole] = useState(null);
    // const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserRole(user.role);
        }
    }, []);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await API.get(`${BASE_URL}/announcements`); // ✅ use env var
                setAnnouncements(res.data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
                toast.error("Failed to fetch announcements");
            }
        };
        fetchAnnouncements();
    }, []);

    // Handle form input
    const handleChange = (e) => {
        setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post(`${BASE_URL}/announcements`, newAnnouncement); // ✅ use env var
            toast.success("Announcement posted successfully!");
            setAnnouncements([res.data, ...announcements]);
            setNewAnnouncement({ title: "", message: "" });
        } catch (err) {
            console.error("Error posting announcement:", err);
            toast.error(err.response?.data?.message || "Failed to post announcement");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await API.delete(`${BASE_URL}/announcements/${id}`); // ✅ use env var
            setAnnouncements(announcements.filter((a) => a._id !== id));
            toast.success("Announcement deleted");
        } catch (err) {
            console.error("Error deleting announcement:", err);
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-[#e8dfd1] to-[#c4a484] dark:from-gray-900 dark:via-gray-800 dark:to-[#3b2f2f] p-6 flex flex-col items-center transition-colors duration-500">
            <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-[#8b6b4c] bg-clip-text text-transparent drop-shadow-sm">
                Campus Announcements
            </h1>

            {userRole === "admin" && (
                <Card className="w-full max-w-2xl mb-10 shadow-2xl border border-blue-100 dark:border-gray-700 bg-white/90 dark:bg-[#2f2b28]/90 backdrop-blur-sm transition-all hover:scale-[1.01]">
                    <CardHeader className="border-b border-blue-100 dark:border-gray-700">
                        <CardTitle className="text-xl font-semibold text-center text-blue-700 dark:text-[#d7b48c]">
                            Post New Announcement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3">
                            <Input
                                type="text"
                                name="title"
                                value={newAnnouncement.title}
                                onChange={handleChange}
                                placeholder="Announcement Title"
                                required
                                className="border-blue-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-[#d7b48c]"
                            />
                            <Textarea
                                name="message"
                                value={newAnnouncement.message}
                                onChange={handleChange}
                                placeholder="Write your announcement..."
                                rows={4}
                                required
                                className="border-blue-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-[#d7b48c]"
                            />
                            <Button
                                type="submit"
                                className="mt-2 bg-gradient-to-r from-blue-600 to-[#8b6b4c] text-white font-semibold hover:opacity-90 transition-all"
                            >
                                Post Announcement
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {announcements.length > 0 ? (
                    announcements.map((item) => (
                        <Card
                            key={item._id}
                            className="shadow-lg border border-blue-100 dark:border-gray-700 bg-white/90 dark:bg-[#2f2b28]/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
                        >
                            <CardHeader className="border-b border-blue-100 dark:border-gray-700">
                                <CardTitle className="text-center text-lg font-semibold text-blue-700 dark:text-[#d7b48c]">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-zinc-700 dark:text-gray-300 text-center leading-relaxed">
                                    {item.message}
                                </p>
                            </CardContent>

                            <CardFooter className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-400">
                                <p className="font-medium">Posted by: {item.postedBy || "Admin"}</p>
                                <p className="text-xs italic">{new Date(item.date).toLocaleString()}</p>

                                {userRole === "admin" && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="mt-3 bg-gradient-to-r from-red-600 to-[#8b6b4c] hover:opacity-90 text-white shadow-md"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-700 dark:text-gray-300 text-center col-span-full italic">
                        No announcements available right now.
                    </p>
                )}
            </div>

            <Toaster />
        </div>
    );
}
