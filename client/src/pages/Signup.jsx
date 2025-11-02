import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
// import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "student",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form, role: (form.role || "").toString().toLowerCase() };
            const res = await API.post("/auth/signup", payload);
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            toast.success("Account created successfully!");

            const role = (user.role || "").toString().toLowerCase();
            if (role === "admin") navigate("/admin/dashboard");
            else if (role === "school") navigate("/school/dashboard");
            else if (role === "student") navigate("/student/dashboard");
            else navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-sky-100 to-purple-100 dark:from-[#0f0f10] dark:via-[#111214] dark:to-[#13141a] p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] transition">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                            Create Your Account
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Email</label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Password</label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Role</label>
                                <Select
                                    value={form.role}
                                    onValueChange={(val) => setForm({ ...form, role: val })}
                                >
                                    <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-indigo-500">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="school">School</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="ml-1 text-indigo-500 hover:text-indigo-600 font-medium transition"
                        >
                            Log in
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
