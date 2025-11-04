// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth"); // JWT middleware
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer setup for profile pic upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/profile_pics");
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// --- GET user settings ---
router.get("/settings", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch settings" });
    }
});

// --- UPDATE user settings ---
router.post("/settings", protect, async (req, res) => {
    try {
        const fields = ["name", "email", "role", "bio", "contact", "notifications", "privateMode"];
        const updates = {};
        fields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to update settings" });
    }
});

// --- UPLOAD profile picture ---
router.post("/upload_profile", protect, upload.single("profilePic"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        const profileUrl = `/uploads/profile_pics/${req.file.filename}`;
        await User.findByIdAndUpdate(req.user._id, { profilePic: profileUrl });
        res.json({ message: "Profile picture updated", profilePic: profileUrl });
    } catch (err) {
        res.status(500).json({ message: "Failed to upload profile picture" });
    }
});

// --- REMOVE profile picture ---
router.delete("/remove_profile_pic", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.profilePic) {
            const filePath = path.join(__dirname, "..", user.profilePic);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        user.profilePic = "";
        await user.save();
        res.json({ message: "Profile picture removed" });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove profile picture" });
    }
});

module.exports = router;
