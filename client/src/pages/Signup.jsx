import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import API from "@/services/api";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        contact: "",
        role: "student",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await API.post("/auth/signup", form);
            const { token, user } = data;

            if (!user || !user.name) throw new Error("Signup failed — invalid response");

            // Store user + token locally for dashboard use
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            toast({ title: "Success!", description: `Welcome aboard, ${user.name}!` });

            // Role-based redirect
            const role = (user.role || "").toLowerCase();
            switch (role) {
                case "admin":
                    window.location.href = "/admin/dashboard";
                    break;
                case "school":
                    window.location.href = "/school/dashboard";
                    break;
                case "student":
                    window.location.href = "/student/dashboard";
                    break;
                default:
                    toast({
                        title: "Error",
                        description: "Unknown user role — contact support",
                        variant: "destructive",
                    });
                    window.location.href = "/login";
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.response?.data?.message || err.message || "Signup failed",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center p-6 bg-[#e3f0ff]">
            <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border-t-8 border-[#2b4b6f] p-8 transition-transform duration-300 hover:scale-[1.02]">
                <h1 className="text-3xl font-bold text-[#2b4b6f] text-center mb-6">
                    Create Your Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="border-[#2b4b6f]"
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="border-[#2b4b6f]"
                        />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="border-[#2b4b6f]"
                        />
                    </div>

                    <div>
                        <Label>Contact</Label>
                        <Input
                            name="contact"
                            type="text"
                            placeholder="Phone number"
                            value={form.contact}
                            onChange={handleChange}
                            required
                            className="border-[#2b4b6f]"
                        />
                    </div>

                    <div>
                        <Label>Account Type</Label>
                        <Select
                            value={form.role}
                            onValueChange={(val) => setForm({ ...form, role: val })}
                        >
                            <SelectTrigger className="border-[#2b4b6f]">
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
                        className="w-full py-2 font-semibold bg-gradient-to-r from-[#2b4b6f] to-[#7b3f00] hover:from-[#1f3a5b] hover:to-[#5c2e00] text-white rounded-lg shadow-lg transition-all duration-200 active:scale-95"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
