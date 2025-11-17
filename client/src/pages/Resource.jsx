import React, { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { Download, FileText } from "lucide-react";

export default function Research() {
    const [materials, setMaterials] = useState([]);
    const cardRefs = useRef([]);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await API.get("/resources");
                const mapped = res.data.map((mat) => ({
                    ...mat,
                    fileUrl: `http://localhost:5000/${mat.filePath}`,
                }));
                setMaterials(mapped);
            } catch (err) {
                console.error("Error fetching materials:", err);
                alert("Failed to load materials");
            }
        };
        fetchMaterials();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("translate-y-0", "opacity-100");
                        entry.target.classList.remove("translate-y-10", "opacity-0");
                    }
                });
            },
            { threshold: 0.3 }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [materials]);

    const getFileType = (url) => {
        const ext = url.split(".").pop();
        return ext ? ext.toUpperCase() : "FILE";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#d8c4a0] text-gray-900 transition-all duration-500">
            <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 shadow-lg bg-gradient-to-r from-blue-700 to-[#8b5e3b] text-white">
                <h1 className="text-2xl font-bold">Research Materials</h1>
            </header>

            <main className="p-10">
                <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                    All Uploaded Research Materials
                </h2>

                {materials.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {materials.map((mat, index) => (
                            <div
                                key={mat._id}
                                ref={(el) => (cardRefs.current[index] = el)}
                                className="relative h-60 flex flex-col justify-center items-center rounded-2xl bg-gradient-to-br from-blue-100 to-[#f2e4d0] border border-blue-200 shadow-lg p-4
                                           transform transition-all duration-700 ease-out translate-y-10 opacity-0
                                           hover:-translate-y-3 hover:shadow-2xl cursor-pointer"
                            >
                                <FileText size={38} className="text-blue-700 mb-3" />
                                <h3 className="text-lg font-semibold text-[#5a3c25]">{mat.unit}</h3>
                                <p className="text-sm text-gray-600 mb-2">{mat.name}</p>

                                <p className="text-sm text-gray-700">
                                    <strong className="text-blue-700">Author:</strong> {mat.author}
                                </p>

                                <p className="text-sm mt-1 text-gray-600">
                                    <strong>Description:</strong> {mat.description}
                                </p>

                                <p className="text-sm mt-1 text-gray-600">
                                    <strong>Type:</strong> {getFileType(mat.fileUrl)}
                                </p>

                                <a
                                    href={mat.fileUrl}
                                    download={mat.filename}
                                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-700 to-[#8b5e3b] text-white text-sm font-medium shadow-md hover:scale-105 transition-transform"
                                >
                                    <Download size={16} /> Download
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 text-center">
                        <FileText size={40} className="text-gray-400 mb-3" />
                        <p className="text-gray-500 text-lg">No research materials available.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
