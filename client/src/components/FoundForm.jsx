import { useState } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TutorForm() {
    const [formData, setFormData] = useState({
        name: "",
        Item: "",
        description: "",
        contact: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/lostandfound", formData);
            alert("Submitted successfully!");
            setFormData({ name: "", item: "", description: "", contact: "" });
        } catch (err) {
            console.error("Failed to submit item data:", err);
            alert("Error submitting form");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white shadow-md p-6 rounded-xl"
        >
            <h2 className="text-xl font-bold text-blue-700 mb-4">
                Lost and found items
            </h2>
            <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="mb-3"
                required
            />
            <Input
                type="text"
                name="item"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Item you found"
                className="mb-3"
                required
            />
            <Input
                type="text"
                name="description"
                value={formData.email}
                onChange={handleChange}
                placeholder="Item description"
                className="mb-3"
                required
            />
            <Input
                type="text"
                name="contact"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="mb-3"
                required
            />
            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
                Submit
            </Button>
        </form>
    );
}
