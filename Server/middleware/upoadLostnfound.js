const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create folder if it doesn't exist
const lostDir = path.join("uploads", "lostnfound");
if (!fs.existsSync(lostDir)) fs.mkdirSync(lostDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, lostDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

// Accept images only
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.test(ext) ? cb(null, true) : cb(new Error("Unsupported file type"), false);
};

const uploadLostnfound = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
});

module.exports = uploadLostnfound;
