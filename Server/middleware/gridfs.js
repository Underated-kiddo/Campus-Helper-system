const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");

// Replace with your Mongo URL
const mongoURI = process.env.MONGO_URI;

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err);

                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename,
                    bucketName: "researchFiles" // <-- THIS bucket is dedicated for Research ONLY
                };
                resolve(fileInfo);
            });
        });
    }
});

const uploadResearchFile = multer({ storage });

module.exports = uploadResearchFile;
