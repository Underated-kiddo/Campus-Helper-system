import { useState } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TutorForm() {
    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        email: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/tutors", formData);
            toast({
                title: "Success!",
                description: "Your tutor profile has been submitted successfully.",
            });
            setFormData({ name: "", unit: "", email: "", phone: "" });
        } catch (err) {
            console.error("Failed to submit tutor data:", err);
            toast({
                title: "Submission Failed",
                description: "Please check your inputs or try again later.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-zinc-900 dark:to-zinc-800 px-4">
            <Card
                className="w-full max-w-lg p-6 shadow-xl border border-zinc-200 dark:border-zinc-700 
                    rounded-2xl backdrop-blur-lg bg-white/50 dark:bg-zinc-900/40 
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        Become a Peer Tutor
                    </CardTitle>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                        Fill in your details to help fellow students in your best subject.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Alex Kim"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Unit You’re Best In
                            </label>
                            <Input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                placeholder="e.g., Data Structures"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="e.g., alex@studentmail.com"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <Input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g., +2547XXXXXXXX"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 
                            text-white font-semibold py-2 rounded-lg shadow-md 
                            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
