import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import API from "@/services/api";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/auth/signup", form);
            toast({ title: "Success", description: "Account created successfully!" });
            window.location.href = "/login";
        } catch (err) {
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to create account",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center p-6 bg-[#e3f0ff]">
            <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border-t-8 border-[#2b4b6f] p-8 transition-transform duration-300 hover:scale-[1.02]">
                <h1 className="text-3xl font-bold text-[#2b4b6f] text-center mb-6">Create Your Account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="border-[#2b4b6f]"
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="example@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            className="border-[#2b4b6f]"
                        />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            className="border-[#2b4b6f]"
                        />
                    </div>

                    <div>
                        <Label>Account Type</Label>
                        <Select value={form.role} onValueChange={(val) => setForm({ ...form, role: val })}>
                            <SelectTrigger className="border-[#2b4b6f]">
                                <SelectValue />
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

                <p className="text-center text-sm text-[#2b4b6f]">
                    Already have an account?{" "}
                    <a href="/login" className="font-semibold underline hover:text-[#7b3f00]">Log in</a>
                </p>
            </div>
        </div>
    );
}
