const Resource = require("../models/resources");
const path = require("path");
const fs = require("fs");

// UPLOAD RESOURCE
exports.uploadResource = async (req, res) => {
    try {
        const { name, unit, description, author } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Extract file details
        const fileUrl = `/uploads/resources/${req.file.filename}`;
        const fileName = req.file.originalname;
        const fileType = req.file.mimetype;
        const fileSize = req.file.size;

        // Create new resource entry
        const newResource = await Resource.create({
            name,
            unit,
            description,
            author,
            fileUrl,
            fileName,
            fileType,
            fileSize,
        });

        res.status(201).json({
            message: "Resource uploaded successfully",
            resource: newResource,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};

// GET ALL RESOURCES
exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({
            message: "Failed to fetch resources",
            error: error.message,
        });
    }
};
