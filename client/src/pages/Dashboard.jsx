import { useState, useEffect } from "react";
import API from "../services/api";
import PostCard from "@/components/PostCard";
import PostDialog from "@/components/PostDialog";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function Dashboard() {
    const [posts, setPosts] = useState([]);

    const load = async () => {
        try {
            const res = await API.get("/posts/me");
            setPosts(res.data);
        } catch (err) {
            console.error(err);
            Toaster("Failed to load posts");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const createPost = async (payload) => {
        try {
            const res = await API.post("/posts", payload);
            setPosts((prev) => [res.data, ...prev]);
            Toaster( "Post created");
        } catch (err) {
            console.error(err);
            Toaster("Failed to create post");
        }
    };

    const togglePost = async (id) => {
        try {
            const post = posts.find((p) => p._id === id);
            const res = await API.put(`/posts/${id}`, {
                completed: !post.completed,
            });
            setPosts((prev) =>
                prev.map((p) => (p._id === id ? res.data : p))
            );
        } catch (err) {
            console.error(err);
            Toaster("Failed to toggle post");
        }
    };

    const deletePost = async (id) => {
        try {
            await API.delete(`/posts/${id}`);
            setPosts((prev) => prev.filter((p) => p._id !== id));
            Toaster("Post deleted");
        } catch (err) {
            console.error(err);
            Toaster("Failed to delete post");
        }
    };

    return (
        <>
            <Navbar />
            <main className="max-w-5xl mx-auto p-5">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Posts</h1>
                    <PostDialog onSubmit={createPost} />
                </div>

                <section
                    className="grid gap-6
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4"
                >
                    {posts.map((p) => (
                        <PostCard
                            key={p._id}
                            post={p}
                            onToggle={togglePost}
                            onDelete={deletePost}
                        />
                    ))}
                </section>
            </main>
        </>
    );
}
