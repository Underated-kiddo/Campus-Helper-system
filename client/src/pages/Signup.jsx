import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toaster from "@/components/ui/sonner";
import { toast } from "@/components/ui/toast";

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
            // ensure role is normalized to lowercase before sending
            const payload = { ...form, role: (form.role || "").toString().toLowerCase() };
            const res = await API.post("/auth/signup", payload);
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            toast.success("Account created successfully!");

            // navigate according to role
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
            <Card className="w-full max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                        Create an Account
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
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="border border-zinc-300 dark:border-zinc-700 bg-transparent rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="student">Student</option>
                            <option value="school">School</option>
                            <option value="admin">Admin</option>
                        </select>

                        <Button type="submit" disabled={loading} className="w-full mt-3">
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Log in
                    </Link>
                </CardFooter>
            </Card>
            <Toaster />
        </div>
    );
}
