// middleware/uploadResources.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolder = path.join(__dirname, "../uploads/resources");

// Ensure folder exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
        // prepend timestamp to prevent collisions
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

module.exports = multer({ storage });
