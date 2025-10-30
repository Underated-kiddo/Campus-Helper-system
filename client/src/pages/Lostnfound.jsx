import React, { useEffect, useState } from "react";
import API from "../services/api"; // your axios instance

export default function Lostnfound ()  {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchLostItems = async () => {
            try {
                const { data } = await API.get("http://localhost:5000/lostnfound"); // endpoint to fetch lost & found items
                setItems(data);
            } catch (err) {
                console.error("Error fetching lost & found items:", err);
            }
        };
        fetchLostItems();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                Lost and Found
            </h1>

            {items.length === 0 ? (
                <p className="text-center text-gray-500">No lost or found items yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.itemName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <p className="text-gray-400 italic">No image provided</p>
                                )}
                            </div>

                            <div className="p-5">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {item.itemName}
                                </h2>
                                <p className="text-gray-600 mb-1">
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={`${item.status === "Lost" ? "text-red-600" : "text-green-600"
                                            } font-medium`}
                                    >
                                        {item.status}
                                    </span>
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Location:</strong> {item.location}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 mb-3">
                                    <strong>Description:</strong> {item.description}
                                </p>

                                <div className="border-t pt-3">
                                    <h3 className="text-md font-semibold text-gray-700 mb-1">
                                        Found/Posted by:
                                    </h3>
                                    <p className="text-gray-600">{item.foundBy?.name || "Unknown"}</p>
                                    <p className="text-gray-600 text-sm">
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
};


