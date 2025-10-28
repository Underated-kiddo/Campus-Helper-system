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

    if (loading) return <p className="text-center mt-8 text-gray-500">Loading tutors...</p>;

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center">No tutors found.</p>
            ) : (
                tutors.map((tutor) => (
                    <Card key={tutor._id} className="shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-blue-700">{tutor.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-1">Best in: <span className="font-medium">{tutor.unit}</span></p>
                            <p className="text-sm text-gray-600">Email {tutor.email}</p>
                            <p className="text-sm text-gray-600">Phone{tutor.phone}</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => handleContact(tutor.email)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Contact
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            )}
        </div>
    );
}
