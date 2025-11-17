// controllers/resourcesController.js
const Resource = require("../models/Resource");
const path = require("path");

exports.uploadResource = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { name, unit, description, author } = req.body;

        const resource = new Resource({
            name,
            unit: unit || "",
            description: description || "",
            author: author || "",
            filePath: `uploads/resources/${req.file.filename}`,
            filename: req.file.originalname,
        });

        await resource.save();
        res.status(201).json({ message: "Resource uploaded", resource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to upload resource" });
    }
};

exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch resources" });
    }
};

// Optional: keep a download endpoint if you want auth protection
exports.downloadResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: "File not found" });

        res.download(path.join(__dirname, "../", resource.filePath), resource.filename);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to download resource" });
    }
};
