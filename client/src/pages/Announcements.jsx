import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Toaster from "@/components/ui/sonner";
import { toast } from "@/components/ui/toast";

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
                const res = await API.get("http://localhost:5000/announcements");
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
            const res = await API.post("/announcements", newAnnouncement);
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
            await API.delete(`/announcements/${id}`);
            setAnnouncements(announcements.filter((a) => a._id !== id));
            toast.success("Announcement deleted");
        } catch (err) {
            console.error("Error deleting announcement:", err);
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brown-300 to-brown-200 dark:from-zinc-900 dark:to-zinc-950 p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center mb-6 text-zinc-800 dark:text-zinc-100">
                Campus Announcements
            </h1>

            {userRole === "admin" && (
                <Card className="w-full max-w-2xl mb-8 shadow-xl border border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-center text-zinc-800 dark:text-zinc-100">
                            Post New Announcement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <Input
                                type="text"
                                name="title"
                                value={newAnnouncement.title}
                                onChange={handleChange}
                                placeholder="Announcement Title"
                                required
                            />
                            <Textarea
                                name="message"
                                value={newAnnouncement.message}
                                onChange={handleChange}
                                placeholder="Write your announcement..."
                                rows={4}
                                required
                            />
                            <Button type="submit" className="mt-2">
                                Post Announcement
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {announcements.length > 0 ? (
                    announcements.map((item) => (
                        <Card
                            key={item._id}
                            className="shadow-lg border border-zinc-200 dark:border-zinc-800 hover:scale-105 transition-transform bg-white/80 dark:bg-zinc-900/70"
                        >
                            <CardHeader>
                                <CardTitle className="text-center text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-zinc-700 dark:text-zinc-300 text-center">
                                    {item.message}
                                </p>
                            </CardContent>

                            <CardFooter className="flex flex-col items-center text-sm text-zinc-600 dark:text-zinc-400">
                                <p>Posted by: {item.postedBy || "Admin"}</p>
                                <p>{new Date(item.date).toLocaleString()}</p>

                                {userRole === "admin" && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="text-zinc-700 dark:text-zinc-300 text-center col-span-full">
                        No announcements available right now.
                    </p>
                )}
            </div>

            <Toaster />
        </div>
    );
}
