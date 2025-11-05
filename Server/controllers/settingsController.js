// controllers/settingsController.js
const User = require("../models/User");

exports.updateSettings = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Failed to update settings", error: err.message });
    }
};
