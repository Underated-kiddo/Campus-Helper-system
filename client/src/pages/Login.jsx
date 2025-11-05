import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login", form);
            const { token, user } = res.data;

            if (!user || !user.name) {
                throw new Error("Invalid user data received from server");
            }

            // ✅ Store user info + token for later dashboard use
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            toast({ title: "Success", description: `Welcome back, ${user.name}!` });

            // ✅ Redirect based on role
            const role = (user.role || "").toLowerCase();
            switch (role) {
                case "admin":
                    navigate("/admin/dashboard");
                    break;
                case "school":
                    navigate("/school/dashboard");
                    break;
                case "student":
                    navigate("/student/dashboard");
                    break;
                default:
                    toast({
                        title: "Error",
                        description: "Unknown user role — contact support",
                        variant: "destructive",
                    });
                    navigate("/login");
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.response?.data?.message || err.message || "Login failed",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#e3f0ff]">
            <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border-t-8 border-[#2b4b6f] transition-transform duration-300 hover:scale-[1.02]">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-[#2b4b6f] text-center mt-6">
                        👋 Welcome Back
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="border-[#2b4b6f] bg-white/70 text-[#2b4b6f] placeholder:text-[#7b3f00] focus:ring-2 focus:ring-[#2b4b6f] focus:outline-none"
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="border-[#2b4b6f] bg-white/70 text-[#2b4b6f] placeholder:text-[#7b3f00] focus:ring-2 focus:ring-[#2b4b6f] focus:outline-none"
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 font-semibold bg-gradient-to-r from-[#2b4b6f] to-[#7b3f00] hover:from-[#1f3a5b] hover:to-[#5c2e00] text-white rounded-lg shadow-lg transition-all duration-200 active:scale-95"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col items-center text-sm text-[#2b4b6f] mb-6">
                    <p>
                        Don’t have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold underline hover:text-[#7b3f00]"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </div>
        </div>
    );
}
