const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadResources");
const {
    uploadResource,
    getResources,
    downloadResource,
} = require("../controllers/resourcesController");
const { protect } = require("../middleware/auth");

// Upload a file
router.post("/upload", protect, upload.single("file"), uploadResource);

// Get all resources
router.get("/", getResources);

// Download (optional protected)
router.get("/download/:id", protect, downloadResource);

module.exports = router;
