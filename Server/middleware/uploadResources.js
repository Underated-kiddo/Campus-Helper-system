const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create folder if it doesn't exist
const resourceDir = path.join("uploads", "resources");
if (!fs.existsSync(resourceDir)) fs.mkdirSync(resourceDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, resourceDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// Accept only documents (PDF, Word, PPT, ZIP/RAR)
const fileFilter = (req, file, cb) => {
    const allowed = /pdf|doc|docx|ppt|pptx|zip|rar/;
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.test(ext) ? cb(null, true) : cb(new Error("Unsupported file type"), false);
};

const upload = multer({
    storage,
    limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max
    fileFilter,
});

module.exports = upload;
