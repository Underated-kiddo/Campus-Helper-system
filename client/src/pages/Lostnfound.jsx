import React, { useEffect, useState } from "react";
import API from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Lostnfound() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchLostItems = async () => {
            try {
                const { data } = await API.get(`${BASE_URL}/lostnfound`);
                setItems(data);
            } catch (err) {
                console.error("Error fetching lost & found items:", err);
            }
        };
        fetchLostItems();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-200 via-amber-100 to-stone-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-8 flex flex-col items-center transition-all duration-500">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-10 text-center drop-shadow-lg">
                Lost & Found Center 🕵️‍♂️
            </h1>

            {items.length === 0 ? (
                <p className="text-center text-zinc-700 dark:text-white/80 text-lg mt-20 animate-pulse">
                    No lost or found items yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg border border-white/20 bg-gradient-to-br from-blue-100 via-amber-50 to-stone-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 transition-transform duration-300 hover:scale-[1.03] hover:shadow-amber-500/40"
                        >
                            <div className="w-full h-56 bg-gradient-to-tr from-sky-100 to-amber-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
                                {item.uploaded_image ? (
                                    <img
                                        src={item.uploaded_image}
                                        alt={item.item_found}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <p className="text-zinc-600 dark:text-zinc-400 italic">
                                        No image provided
                                    </p>
                                )}
                            </div>

                            <div className="p-6 text-zinc-800 dark:text-zinc-200">
                                <h2 className="text-2xl font-semibold mb-3 text-zinc-900 dark:text-white">
                                    {item.item_found}
                                </h2>

                                <p className="text-zinc-700 dark:text-white/90 text-sm mb-4">
                                    <strong>Description:</strong> {item.item_description}
                                </p>

                                <div className="border-t border-white/20 pt-3">
                                    <h3 className="text-md font-semibold text-zinc-900 dark:text-white mb-1">
                                        Found / Reported by:
                                    </h3>
                                    <p className="text-zinc-800 dark:text-white/90">
                                        {item.Full_name?.name || "Unknown"}
                                    </p>
                                    <p className="text-zinc-700 dark:text-white/80 text-sm">
                                        Contact: {item.Full_name?.phone_number || "N/A"}
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
