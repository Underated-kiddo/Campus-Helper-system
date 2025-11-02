import { useState } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ResearchUploadForm() {
    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        description: "",
        author: "",
        file: null,
    });

    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, file });
            if (file.type.startsWith("image/")) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview(file.name);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (const key in formData) {
                data.append(key, formData[key]);
            }

            await API.post("/researchmaterials", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Research material submitted successfully!");
            setFormData({
                name: "",
                unit: "",
                description: "",
                author: "",
                file: null,
            });
            setPreview(null);
        } catch (err) {
            console.error("Failed to submit material:", err);
            alert("Error submitting research material");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-amber-100 p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-600">
                    📘 Upload Research Material
                </h2>

                <div className="space-y-4">
                    {/* Topic Name */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                            Topic Name
                        </label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter the topic name"
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                            Unit Name
                        </label>
                        <Input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            placeholder="Enter the unit name"
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                            Description
                        </label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Briefly describe the material"
                            required
                            className="border-blue-200 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                            Author
                        </label>
                        <Input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                            Upload File
                        </label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-4 bg-blue-50 hover:bg-blue-100 transition cursor-pointer">
                            <input
                                type="file"
                                name="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                                required
                            />
                            <label
                                htmlFor="file-upload"
                                className="text-blue-700 font-medium cursor-pointer hover:underline"
                            >
                                Click to upload a file
                            </label>

                            {preview && (
                                <div className="mt-3 text-center">
                                    {preview.startsWith("blob:") ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-40 h-40 object-cover rounded-xl shadow-md border border-blue-100 mx-auto"
                                        />
                                    ) : (
                                        <p className="text-blue-800 text-sm font-medium">
                                            {preview}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-blue-700 to-amber-600 hover:opacity-90 text-white font-semibold py-2 rounded-xl transition-all duration-200"
                >
                    Submit
                </Button>
            </form>
        </div>
    );
}
