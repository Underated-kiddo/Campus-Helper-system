import { useState } from "react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LostnfoundForm() {
    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        item_found: "",
        item_description: "",
        uploaded_image: null,
    });

    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, uploaded_image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("phone_number", formData.phone_number);
            data.append("item_found", formData.item_found);
            data.append("item_description", formData.item_description);
            if (formData.uploaded_image) data.append("uploaded_image", formData.uploaded_image);

            await API.post("/lostnfound", data, { headers: { "Content-Type": "multipart/form-data" } });

            alert("Submitted successfully!");
            setFormData({ name: "", phone_number: "", item_found: "", item_description: "", uploaded_image: null });
            setPreview(null);
        } catch (err) {
            console.error(err);
            alert("Error submitting form");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-amber-100 flex items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-300"
            >
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-600 mb-6">
                    Lost & Found Item Form
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Full Name</label>
                        <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Phone Number</label>
                        <Input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Enter your contact number" required />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Item Found</label>
                        <Input type="text" name="item_found" value={formData.item_found} onChange={handleChange} placeholder="What item did you find?" required />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Item Description</label>
                        <Textarea name="item_description" value={formData.item_description} onChange={handleChange} placeholder="Describe the item briefly" required />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Upload Image (optional)</label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-4 bg-blue-50 hover:bg-blue-100 cursor-pointer">
                            <input type="file" accept="image/*" name="uploaded_image" id="lost-file-upload" className="hidden" onChange={handleImageChange} />
                            <label htmlFor="lost-file-upload" className="text-blue-700 font-medium cursor-pointer hover:underline">
                                Click to upload image
                            </label>
                            {preview && <img src={preview} alt="Preview" className="mt-4 w-40 h-40 object-cover rounded-xl shadow-md border border-blue-100" />}
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-700 to-amber-600 hover:opacity-90 text-white font-semibold py-2 rounded-xl">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
