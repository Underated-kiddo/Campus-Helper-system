const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/profile_pics");
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage });

router.get("/settings", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch settings", error: err.message });
    }
});

router.post("/settings", protect, async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "email",
            "role",
            "bio",
            "contact",
            "notifications",
            "privateMode",
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        res.json({ message: "Settings updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Failed to update settings", error: err.message });
    }
});

router.post("/upload_profile", protect, upload.single("profilePic"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        const profileUrl = `/uploads/profile_pics/${req.file.filename}`;
        await User.findByIdAndUpdate(req.user._id, { profilePic: profileUrl });

        res.json({ message: "Profile picture updated", profilePic: profileUrl });
    } catch (err) {
        res.status(500).json({ message: "Failed to upload profile picture", error: err.message });
    }
});

router.delete("/remove_profile_pic", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.profilePic) {
            const filePath = path.join(__dirname, "..", user.profilePic);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        user.profilePic = "";
        await user.save();

        res.json({ message: "Profile picture removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove profile picture", error: err.message });
    }
});

router.post("/change_password", protect, async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(new_password, salt);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to change password", error: err.message });
    }
});

router.post("/delete_account", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.profilePic) {
            const filePath = path.join(__dirname, "..", user.profilePic);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await User.findByIdAndDelete(req.user._id);
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete account", error: err.message });
    }
});

module.exports = router;