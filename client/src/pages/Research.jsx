import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Download, FileText } from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function Research() {
    const [materials, setMaterials] = useState([]);
    const [flipped, setFlipped] = useState(null);
    const [view, setView] = useState("mine");

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await API.get(
                    view === "mine" ? "/resources" : "/resources"
                );
                setMaterials(res.data);
            } catch (err) {
                console.error("Error fetching materials:", err);
                toast.error(
                    err.response?.data?.message ||
                    "Failed to load research materials"
                );
            }
        };
        fetchMaterials();
    }, [view]);

    const toggleFlip = (id) => {
        setFlipped(flipped === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#d8c4a0] text-gray-900 transition-all duration-500">
            <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 shadow-lg bg-gradient-to-r from-blue-700 to-[#8b5e3b] text-white">
                <h1 className="text-2xl font-bold tracking-wide">
                    Research Materials
                </h1>

                <nav className="flex items-center gap-4">
                    <button
                        onClick={() => setView("mine")}
                        className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${view === "mine"
                                ? "bg-white text-blue-700 shadow-md"
                                : "hover:bg-white/20"
                            }`}
                    >
                        My Uploads
                    </button>
                    <button
                        onClick={() => setView("all")}
                        className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${view === "all"
                                ? "bg-white text-blue-700 shadow-md"
                                : "hover:bg-white/20"
                            }`}
                    >
                        All Uploads
                    </button>
                </nav>
            </header>

            <main className="p-10">
                <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                    {view === "mine"
                        ? "My Uploaded Research Materials"
                        : "All Research Uploads"}
                </h2>

                {materials.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {materials.map((mat) => (
                            <div
                                key={mat._id}
                                onClick={() => toggleFlip(mat._id)}
                                className="relative group h-60 perspective cursor-pointer"
                            >
                                <div
                                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${flipped === mat._id
                                            ? "rotate-y-180"
                                            : ""
                                        }`}
                                >
                                    <div className="absolute inset-0 flex flex-col justify-center items-center rounded-2xl bg-gradient-to-br from-blue-100 to-[#f2e4d0] border border-blue-200 shadow-lg hover:shadow-2xl backdrop-blur-md transition-all duration-300">
                                        <FileText
                                            className="text-blue-700 mb-3 group-hover:scale-110 transition-transform"
                                            size={38}
                                        />
                                        <h3 className="text-lg font-semibold text-[#5a3c25]">
                                            {mat.unit}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {mat.fileName}
                                        </p>
                                    </div>

                                    <div className="absolute inset-0 rotate-y-180 flex flex-col justify-center items-center rounded-2xl bg-gradient-to-br from-[#d7bfa0] via-white to-blue-100 border border-brown-300 shadow-lg backdrop-blur-md">
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                            Uploaded by:{" "}
                                            <span className="text-blue-700 font-semibold">
                                                {mat.studentName}
                                            </span>
                                        </p>
                                        <p className="text-sm mb-1 text-gray-600">
                                            Size: {mat.fileSize}
                                        </p>
                                        <p className="text-sm mb-4 text-gray-600">
                                            Type: {mat.fileType}
                                        </p>

                                        <a
                                            href={mat.fileUrl}
                                            download={mat.fileName}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-[#8b5e3b] text-white text-sm font-medium shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
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
                        <p className="text-gray-500 text-lg">
                            {view === "mine"
                                ? "You haven’t uploaded any materials yet."
                                : "No research materials available at the moment."}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
