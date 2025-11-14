import { useState } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ResearchForm() {
    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        description: "",
        author: "",
        file: null,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Only allow PDF, Word, PPT, ZIP, RAR
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/zip",
            "application/x-rar-compressed"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Unsupported file type. Only PDF, Word, PPT, ZIP, RAR allowed.");
            e.target.value = null;
            return;
        }

        if (file.size > 30 * 1024 * 1024) {
            alert("File is too big! Max size is 30MB.");
            e.target.value = null;
            return;
        }

        setFormData({ ...formData, file });
    };

    const handleRemoveFile = () => {
        setFormData({ ...formData, file: null });
        document.getElementById("file-upload").value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.file) return alert("Please select a file before submitting!");

        setLoading(true);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("unit", formData.unit);
            data.append("description", formData.description);
            data.append("author", formData.author);
            data.append("file", formData.file);

            await API.post("/resources/upload", data, {
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

            document.getElementById("file-upload").value = null;
        } catch (err) {
            console.error("Failed to submit material:", err);
            alert(err.response?.data?.message || "Error submitting research material");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-amber-100 p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-600">
                    Upload Research Material📚
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Topic Name</label>
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

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Unit Name</label>
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

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Description</label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Briefly describe the material"
                            required
                            className="border-blue-200 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Author</label>
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

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Upload File</label>
                        <div
                            onClick={() => document.getElementById("file-upload").click()}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                        >
                            <input
                                type="file"
                                name="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <p className="text-blue-700 font-medium hover:underline">
                                {formData.file
                                    ? formData.file.name
                                    : "Click here to select a file (PDF, Word, PPT, ZIP/RAR)"}
                            </p>

                            {formData.file && (
                                <div className="text-sm text-blue-600 mt-1 text-center">
                                    Size: {(formData.file.size / 1024 / 1024).toFixed(2)} MB<br />
                                    Type: {formData.file.type || "Unknown"}
                                </div>
                            )}
                        </div>

                        {formData.file && (
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="mt-2 text-red-600 hover:underline text-sm"
                            >
                                Remove file
                            </button>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-blue-700 to-amber-600 hover:opacity-90 text-white font-semibold py-2 rounded-xl transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
