import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Download, FileText, Moon, Sun } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function ResearchMaterials() {
    const [materials, setMaterials] = useState([]);
    const [flipped, setFlipped] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await API.get("/research/mine"); // ✅ baseURL handled in API.js
                setMaterials(res.data);
            } catch (err) {
                console.error("Error fetching materials:", err);
                toast.error(
                    err.response?.data?.message || "Failed to load your materials"
                );
            }
        };

        fetchMaterials();
    }, []);

    const toggleFlip = (id) => {
        setFlipped(flipped === id ? null : id);
    };

    return (
        <div
            className={`min-h-screen p-8 transition-all duration-500 ${
                darkMode
                    ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200"
                    : "bg-gradient-to-b from-gray-100 via-white to-gray-100 text-gray-900"
            }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-extrabold tracking-tight">
                    My Uploaded Research Materials
                </h2>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-medium shadow-md hover:scale-105 hover:bg-blue-700 transition-transform duration-200"
                >
                    {darkMode ? (
                        <>
                            <Sun size={18} /> Light Mode
                        </>
                    ) : (
                        <>
                            <Moon size={18} /> Dark Mode
                        </>
                    )}
                </button>
            </div>

            {/* Cards */}
            {materials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materials.map((mat) => (
                        <div
                            key={mat._id}
                            className="relative h-56 cursor-pointer group perspective"
                            onClick={() => toggleFlip(mat._id)}
                        >
                            <div
                                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                                    flipped === mat._id ? "rotate-y-180" : ""
                                }`}
                            >
                                {/* Front */}
                                <div
                                    className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-xl backdrop-blur-md ${
                                        darkMode
                                            ? "bg-gray-800/70 border border-gray-700"
                                            : "bg-white/80 border border-gray-200"
                                    } group-hover:shadow-2xl transition-shadow`}
                                >
                                    <FileText
                                        className="text-blue-500 mb-3 group-hover:scale-110 transition-transform"
                                        size={36}
                                    />
                                    <h3 className="text-lg font-semibold text-center px-3">
                                        {mat.unit}
                                    </h3>
                                </div>

                                {/* Back */}
                                <div
                                    className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-xl rotate-y-180 backdrop-blur-md ${
                                        darkMode
                                            ? "bg-gray-700/70 border border-gray-600"
                                            : "bg-blue-50/90 border border-blue-200"
                                    }`}
                                >
                                    <p className="text-sm font-medium mb-1">
                                        Uploaded by:{" "}
                                        <span className="text-blue-600">
                                            {mat.studentName}
                                        </span>
                                    </p>
                                    <p className="text-sm mb-1">Size: {mat.fileSize}</p>
                                    <p className="text-sm mb-4">Type: {mat.fileType}</p>

                                    <a
                                        href={mat.fileUrl}
                                        download={mat.fileName}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-md hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download size={16} /> Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-20 text-center">
                    <FileText className="text-gray-400 mb-3" size={40} />
                    <p className="text-gray-400 text-lg">
                        You haven’t uploaded any materials yet.
                    </p>
                </div>
            )}
        </div>
    );
}
