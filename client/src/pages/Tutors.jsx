import { useEffect, useState } from "react";
import API from "../services/api";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function Tutors() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
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
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-white to-amber-100">
                <p className="text-lg text-blue-800 font-medium animate-pulse">
                    Loading tutors...
                </p>
            </div>
        );

    return (
        <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-100 via-white to-amber-100">
            <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-700 drop-shadow-sm">
                📘 Available Tutors
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 place-items-center">
                {tutors.length === 0 ? (
                    <p className="text-gray-500 text-center col-span-full">
                        No tutors found at the moment.
                    </p>
                ) : (
                    tutors.map((tutor) => (
                        <Card
                            key={tutor._id}
                            className="w-full max-w-sm bg-white/80 backdrop-blur-lg border border-blue-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
                        >
                            <CardHeader className="bg-gradient-to-r from-blue-700 to-amber-600 p-5">
                                <CardTitle className="text-white text-xl font-semibold tracking-wide">
                                    {tutor.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-6 text-gray-700">
                                <div className="space-y-3">
                                    <p className="text-sm">
                                        <span className="font-semibold text-amber-700">
                                            Best in:
                                        </span>{" "}
                                        {tutor.unit || "Not specified"}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold text-amber-700">
                                            Email:
                                        </span>{" "}
                                        {tutor.email}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold text-amber-700">
                                            Phone:
                                        </span>{" "}
                                        {tutor.phone || "N/A"}
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter className="p-5">
                                <Button
                                    onClick={() => handleContact(tutor.email)}
                                    className="w-full bg-gradient-to-r from-blue-700 to-amber-600 hover:opacity-90 hover:scale-[1.02] text-white font-medium rounded-xl shadow-md transition-all duration-200"
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
