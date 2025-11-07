const express = require("express");
const { protect } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
    updateSettings,
    changePassword,
    deleteAccount,
    uploadProfilePic,
    removeProfilePic,
} = require("../controllers/settingsController");

const router = express.Router();

// Ensure uploads/profile_pics folder exists
const uploadPath = path.join(__dirname, "../uploads/profile_pics");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user._id}_${Date.now()}${ext}`);
    },
});

// File type filter (optional but good for security)
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage, fileFilter });


// Update general user settings (name, bio, contact, etc.)
router.put("/", protect, updateSettings);

// Upload or replace profile picture
router.post("/profile/upload", protect, upload.single("profilePic"), uploadProfilePic);

// Remove current profile picture
router.delete("/profile/remove", protect, removeProfilePic);

// Change user password
router.post("/password/change", protect, changePassword);

// Delete user account
router.delete("/account/delete", protect, deleteAccount);

module.exports = router;
