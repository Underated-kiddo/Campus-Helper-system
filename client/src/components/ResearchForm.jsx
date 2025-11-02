import { useState } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TutorForm() {
    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        description: "",
        author: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/researchmaterials", formData);
            alert("Submitted successfully!");
            setFormData({ name: "", unit: "", description: "", author: "" });
        } catch (err) {
            console.error("Failed to submit material data:", err);
            alert("Error submitting form");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 dark:from-zinc-900 dark:to-zinc-800 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white/30 dark:bg-zinc-900/40 
                    backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-zinc-200 dark:border-zinc-700
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
                <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">
                    Upload Research Material
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Topic Name
                        </label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name of topic"
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Unit Name
                        </label>
                        <Input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            placeholder="Unit name"
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <Input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description of material"
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Author
                        </label>
                        <Input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 
                        text-white font-semibold py-2 rounded-lg shadow-md 
                        transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Submit
                </Button>
            </form>
        </div>
    );
}
