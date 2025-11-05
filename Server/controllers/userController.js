const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET user settings
exports.getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE user settings
exports.updateSettings = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        res.json({ message: "Settings updated", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPLOAD profile picture
exports.uploadProfile = async (req, res) => {
    try {
        const imageUrl = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic: imageUrl },
            { new: true }
        ).select("-password");
        res.json({ message: "Profile updated", profilePic: imageUrl, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// REMOVE profile picture
exports.removeProfilePic = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic: "" },
            { new: true }
        ).select("-password");
        res.json({ message: "Profile picture removed", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CHANGE password
exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { old_password, new_password } = req.body;

        const valid = await bcrypt.compare(old_password, user.password);
        if (!valid) return res.status(400).json({ message: "Incorrect old password" });

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();
        res.json({ message: "Password updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE account
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "Account deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 