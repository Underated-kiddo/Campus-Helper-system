const multer = require("multer");

const storage = multer.memoryStorage();

const uploadLostnfound = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (safe)
});

module.exports = uploadLostnfound;
