const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

// ✅ GET /api/settings - Fetch user settings
exports.getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching settings:", err);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

// ✅ PUT /api/settings - Update user details
exports.updateSettings = async (req, res) => {
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

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Settings updated successfully", user });
    } catch (err) {
        console.error("Error updating settings:", err);
        res.status(500).json({ message: "Failed to update settings" });
    }
};

// ✅ POST /api/settings/upload-profile - Upload profile picture
exports.uploadProfilePic = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove old image if exists
        if (user.profilePic) {
            const oldPath = path.join(__dirname, "..", user.profilePic);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const profileUrl = `/uploads/profile_pics/${req.file.filename}`;
        user.profilePic = profileUrl;
        await user.save();

        res.json({ message: "Profile picture updated", profilePic: profileUrl });
    } catch (err) {
        console.error("Error uploading profile picture:", err);
        res.status(500).json({ message: "Failed to upload profile picture" });
    }
};

// ✅ DELETE /api/settings/remove-profile - Remove profile picture
exports.removeProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.profilePic) {
            const filePath = path.join(__dirname, "..", user.profilePic);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            user.profilePic = "";
            await user.save();
        }

        res.json({ message: "Profile picture removed" });
    } catch (err) {
        console.error("Error removing profile picture:", err);
        res.status(500).json({ message: "Failed to remove profile picture" });
    }
};

// ✅ PUT /api/settings/change-password - Change password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect old password" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({ message: "Failed to change password" });
    }
};

// ✅ DELETE /api/settings/delete-account - Delete user account
exports.deleteAccount = async (req, res) => {
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
        console.error("Error deleting account:", err);
        res.status(500).json({ message: "Failed to delete account" });
    }
};
