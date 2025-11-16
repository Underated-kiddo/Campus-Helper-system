const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadResources");
const { uploadResource, getResources, downloadResource } = require("../controllers/resourcesController");
const { protect } = require("../middleware/auth");

// Upload a file to GridFS
router.post("/resources/upload", protect, upload.single("file"), uploadResource);

// Get all resource metadata
router.get("/", getResources);

// Download a file from GridFS
router.get("/download/:id", protect, downloadResource);

module.exports = router;