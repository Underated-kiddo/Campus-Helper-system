import { useState } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
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
        <div className="min-h-screen flex items-center justify-center 
            bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 
            dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 px-4">

            <Card
                className="w-full max-w-lg p-6 shadow-2xl border border-blue-200 
                dark:border-blue-700 rounded-2xl backdrop-blur-xl 
                bg-white/60 dark:bg-blue-950/50 transition-all duration-300 
                hover:shadow-blue-500/40 hover:-translate-y-1"
            >
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        Become a Peer Tutor
                    </CardTitle>
                    <p className="text-sm text-zinc-700 dark:text-zinc-400 mt-2">
                        Fill in your details to help fellow students in your strongest subject.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Alex Kim"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 dark:bg-blue-950/70"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Unit You’re Best In
                            </label>
                            <Input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                placeholder="e.g., Data Structures"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 dark:bg-blue-950/70"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="e.g., alex@studentmail.com"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 dark:bg-blue-950/70"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Phone Number
                            </label>
                            <Input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g., +2547XXXXXXXX"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 dark:bg-blue-950/70"
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