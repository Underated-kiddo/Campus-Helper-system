import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toaster from "@/components/ui/sonner";
import { toast } from "@/components/ui/toast";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post("/auth/login", form);
            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            toast.success("Login successful!");

            const role = (user.role || "").toString().toLowerCase();
            if (role === "admin") navigate("/admin/dashboard");
            else if (role === "school") navigate("/school/dashboard");
            else if (role === "student") navigate("/student/dashboard");
            else navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-6">
            <Card className="w-full max-w-md shadow-2xl border border-white/20 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/60 backdrop-blur-lg rounded-2xl transition-transform duration-300 hover:scale-[1.02]">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-bold text-zinc-900 dark:text-white">
                        👋 Welcome Back
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5 mt-2"
                    >
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="bg-white/70 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="bg-white/70 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg shadow-lg transition-all duration-200 active:scale-95"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col items-center text-sm text-zinc-700 dark:text-zinc-400 mt-2">
                    <p>
                        Don’t have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
            <Toaster />
        </div>
    );
}
