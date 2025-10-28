import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Download, FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function ResearchMaterials() {
    const [materials, setMaterials] = useState([]);
    const [flipped, setFlipped] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await API.get("/research/mine");
                setMaterials(res.data);
            } catch (err) {
                console.error("Error fetching materials:", err);
                toast.error(err.response?.data?.message || "Failed to load your materials");
            }
        };

        fetchMaterials();
    }, []);

    const toggleFlip = (id) => {
        setFlipped(flipped === id ? null : id);
    };

    return (
        <div
            className={`min-h-screen p-6 transition-all duration-300 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
                }`}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Uploaded Research Materials</h2>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>

            {materials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((mat, i) => (
                        <div
                            key={i}
                            className="relative h-48 perspective cursor-pointer"
                            onClick={() => toggleFlip(mat._id)}
                        >
                            <div
                                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${flipped === mat._id ? "rotate-y-180" : ""
                                    }`}
                            >
                                {/* Front Side */}
                                <div
                                    className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"
                                        }`}
                                >
                                    <FileText className="text-blue-500 mb-2" size={28} />
                                    <h3 className="text-lg font-semibold text-center px-2">
                                        {mat.unit}
                                    </h3>
                                </div>

                                {/* Back Side */}
                                <div
                                    className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-lg rotate-y-180 ${darkMode ? "bg-gray-700" : "bg-blue-50"
                                        }`}
                                >
                                    <p className="text-sm font-medium mb-1">
                                        Uploaded by: <span className="text-blue-600">{mat.studentName}</span>
                                    </p>
                                    <p className="text-sm mb-1">Size: {mat.fileSize}</p>
                                    <p className="text-sm mb-3">Type: {mat.fileType}</p>
                                    <a
                                        href={mat.fileUrl}
                                        download={mat.fileName}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        onClick={(e) => e.stopPropagation()} // prevent flip on download click
                                    >
                                        <Download size={16} /> Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center mt-20">
                    You haven’t uploaded any materials yet.
                </p>
            )}
        </div>
    );
}
