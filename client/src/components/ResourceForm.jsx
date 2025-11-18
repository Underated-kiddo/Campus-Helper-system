import { useState } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, File, Clipboard, Archive, Paperclip } from "lucide-react";

export default function ResourceForm() {
    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        description: "",
        author: "",
        file: null,
    });

    const [loading, setLoading] = useState(false);
    const [uploadedResources, setUploadedResources] = useState([]); 

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData({ ...formData, file });
    };

    const handleRemoveFile = () => {
        setFormData({ ...formData, file: null });
        document.getElementById("resource-file-upload").value = null;
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

            const res = await API.post("/resources/upload", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Research material submitted successfully!");
            const uploaded = res.data.resource;
            setUploadedResources([uploaded, ...uploadedResources]);

            setFormData({ name: "", unit: "", description: "", author: "", file: null });
            document.getElementById("resource-file-upload").value = null;
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error submitting research material");
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (file) => {
        if (!file) return <Paperclip className="text-6xl text-blue-400" />;
        const type = file.type.toLowerCase();
        if (type.includes("pdf")) return <FileText className="text-6xl text-red-500" />;
        if (type.includes("word") || type.includes("msword") || type.includes("officedocument"))
            return <File className="text-6xl text-blue-600" />;
        if (type.includes("presentation") || type.includes("powerpoint"))
            return <Clipboard className="text-6xl text-yellow-500" />;
        if (type.includes("zip") || type.includes("rar")) return <Archive className="text-6xl text-gray-500" />;
        return <Paperclip className="text-6xl text-blue-400" />;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-white to-amber-100 p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300 mb-6"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-600">
                    Upload Research Material 📚
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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Upload File</label>
                        <div
                            onClick={() => document.getElementById("resource-file-upload").click()}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50 hover:bg-blue-100 cursor-pointer min-h-[140px]"
                        >
                            <input
                                type="file"
                                name="file"
                                accept="*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resource-file-upload"
                            />
                            <div className="mb-2">{getFileIcon(formData.file)}</div>
                            <p className="text-blue-700 font-medium">{formData.file ? formData.file.name : "Click here to select a file"}</p>
                            {formData.file && (
                                <p className="text-blue-600 text-sm mt-1 text-center">
                                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB • {formData.file.type || "Unknown type"}
                                </p>
                            )}
                        </div>
                        {formData.file && (
                            <button type="button" onClick={handleRemoveFile} className="mt-2 text-red-600 hover:underline text-sm">
                                Remove file
                            </button>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-blue-700 to-amber-600 hover:opacity-90 text-white font-semibold py-2 rounded-xl"
                    >
                        {loading ? "Uploading..." : "Submit"}
                    </Button>
                </div>
            </form>

            {uploadedResources.length > 0 && (
                <div className="w-full max-w-lg space-y-4">
                    <h3 className="text-2xl font-bold text-blue-700 mb-2">Uploaded Resources</h3>
                    {uploadedResources.map((res) => (
                        <div key={res._id} className="flex items-center justify-between border p-3 rounded-xl bg-white shadow-sm">
                            <span>{res.name}</span>
                            <a
                                href={`http://localhost:5000/${res.filePath}`}
                                download={res.filename}
                                className="text-blue-600 hover:underline"
                            >
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
