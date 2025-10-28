import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
            // persist token and user (store user as JSON for other pages to read)
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            toast.success("Login successful!");

            // normalize role checks to lowercase to match route/ProtectedRoutes conventions
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
        <div className="min-h-screen flex items-center justify-center bg-brown-300 dark:from-zinc-900 dark:to-zinc-950 p-4">
            <Card className="w-full max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                        Welcome Back
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" disabled={loading} className="w-full mt-2">
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col items-center text-sm text-zinc-600 dark:text-zinc-400">
                    <p>
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
            <Toaster />
        </div>
    );
}
