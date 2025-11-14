const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadResources");
const { uploadResource, getResources } = require("../controllers/resourcesController");
const { protect } = require("../middleware/auth");

// Upload resource
router.post("/upload", protect, upload.single("file"), async (req, res) => {
    try {
        if (req.file) {
            req.fileData = {
                fileUrl: `/uploads/resources/${req.file.filename}`,
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
            };
        }
        await uploadResource(req, res);
    } catch (error) {
        console.error("Upload error:", error.message);
        res.status(500).json({ message: "File upload failed", error: error.message });
    }
});

// Get all resources
router.get("/", async (req, res) => {
    try {
        await getResources(req, res);
    } catch (error) {
        console.error("Fetch error:", error.message);
        res.status(500).json({ message: "Failed to fetch resources", error: error.message });
    }
});

module.exports = router;