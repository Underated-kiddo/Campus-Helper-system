const mongoose = require("mongoose");
const Resource = require("../models/Resource");
const { getResourceBucket } = require("../config/gridfs");

exports.uploadResource = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { name, unit, description, author } = req.body;

        const resource = new Resource({
            name,
            unit,
            description,
            author,
            fileId: req.file.id,
            filename: req.file.filename,
            contentType: req.file.contentType,
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
        res.status(500).json({ message: "Failed to fetch resources" });
    }
};

exports.downloadResource = async (req, res) => {
    try {
        const bucket = getResourceBucket();
        if (!bucket) return res.status(500).json({ message: "GridFS not ready" });

        const fileId = new mongoose.Types.ObjectId(req.params.id);

        const files = await bucket.find({ _id: fileId }).toArray();
        if (!files || files.length === 0) return res.status(404).json({ message: "File not found" });

        res.set("Content-Type", files[0].contentType);
        res.set("Content-Disposition", `attachment; filename="${files[0].filename}"`);

        bucket.openDownloadStream(fileId).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to download resource" });
    }
};
