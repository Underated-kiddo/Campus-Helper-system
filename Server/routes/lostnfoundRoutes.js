const express = require("express");
const router = express.Router();
const upload = require("../middleware/upoadLostnfound");
const { addLostItem, getLostItems } = require("../controllers/lostnfoundController");

// Post a lost item with optional image
router.post("/", upload.single("uploaded_image"), (req, res, next) => {
    if (req.file) {
        req.fileData = {
            fileUrl: `/uploads/lostnfound/${req.file.filename}`,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
        };
    }
    next();
}, addLostItem);

// Get all lost items
router.get("/", getLostItems);

module.exports = router;