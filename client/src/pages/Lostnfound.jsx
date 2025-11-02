import React, { useEffect, useState } from "react";
import API from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL; // ✅ Load from .env

export default function Lostnfound() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchLostItems = async () => {
            try {
                const { data } = await API.get(`${BASE_URL}/lostnfound`); // ✅ use env var
                setItems(data);
            } catch (err) {
                console.error("Error fetching lost & found items:", err);
            }
        };
        fetchLostItems();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-8 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-white mb-10 text-center drop-shadow-lg">
                Lost & Found Center 🕵️‍♂️
            </h1>

            {items.length === 0 ? (
                <p className="text-center text-white/80 text-lg mt-20 animate-pulse">
                    No lost or found items yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg border border-white/20 bg-white/20 dark:bg-zinc-900/50 transition-transform duration-300 hover:scale-[1.03] hover:shadow-purple-400/40"
                        >
                            <div className="w-full h-56 bg-gradient-to-tr from-purple-200 to-indigo-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.itemName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <p className="text-zinc-600 dark:text-zinc-400 italic">
                                        No image provided
                                    </p>
                                )}
                            </div>

                            <div className="p-6 text-zinc-800 dark:text-zinc-200">
                                <h2 className="text-2xl font-semibold mb-3 text-white">
                                    {item.itemName}
                                </h2>

                                <div className="space-y-1 mb-4">
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`font-semibold ${
                                                item.status === "Lost"
                                                    ? "text-red-500"
                                                    : "text-green-400"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        <span className="text-white/90">{item.location}</span>
                                    </p>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        <span className="text-white/90">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </p>
                                </div>

                                <p className="text-white/90 text-sm mb-4">
                                    <strong>Description:</strong> {item.description}
                                </p>

                                <div className="border-t border-white/20 pt-3">
                                    <h3 className="text-md font-semibold text-white mb-1">
                                        Found / Posted by:
                                    </h3>
                                    <p className="text-white/90">
                                        {item.foundBy?.name || "Unknown"}
                                    </p>
                                    <p className="text-white/80 text-sm">
                                        Contact: {item.foundBy?.email || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
