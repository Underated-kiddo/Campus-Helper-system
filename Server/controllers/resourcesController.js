const Resource = require("../models/resources");

// Upload a new file
exports.uploadResource = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const { title, description } = req.body;
        const fileUrl = `/uploads/resources/${req.file.filename}`;

        const resource = new Resource({
            title,
            description,
            fileUrl,
            uploadedBy: req.user._id,
            fileType: req.file.mimetype,
        });

        await resource.save();
        res.status(201).json({ message: "File uploaded successfully.", resource });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Server error while uploading file." });
    }
};

// Get all uploaded resources
exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find().populate("uploadedBy", "name email");
        res.status(200).json(resources);
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ message: "Server error while fetching resources." });
    }
};
