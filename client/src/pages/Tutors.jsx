import { useEffect, useState } from "react";
import API from "../services/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Tutors() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                // Uses base URL from .env via api.js
                const res = await API.get("/tutors");
                setTutors(res.data);
            } catch (err) {
                console.error("Failed to fetch tutors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTutors();
    }, []);

    const handleContact = (email) => {
        window.location.href = `mailto:${email}`;
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-blue-700 animate-pulse">Loading tutors...</p>
            </div>
        );

    return (
        <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 via-white to-brown-100">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
                📘 Available Tutors
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
                {tutors.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center">
                        No tutors found.
                    </p>
                ) : (
                    tutors.map((tutor) => (
                        <Card
                            key={tutor._id}
                            className="w-full max-w-sm bg-white/70 backdrop-blur-md border border-blue-100 shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden"
                        >
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-brown-600 p-4">
                                <CardTitle className="text-white text-lg font-semibold">
                                    {tutor.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-5">
                                <div className="space-y-2 text-gray-700">
                                    <p className="text-sm">
                                        <span className="font-semibold text-brown-700">Best in:</span>{" "}
                                        {tutor.unit}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold text-brown-700">Email:</span>{" "}
                                        {tutor.email}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold text-brown-700">Phone:</span>{" "}
                                        {tutor.phone || "N/A"}
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 flex justify-center">
                                <Button
                                    onClick={() => handleContact(tutor.email)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-brown-600 hover:opacity-90 text-white font-medium rounded-xl transition"
                                >
                                    Contact Tutor
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
