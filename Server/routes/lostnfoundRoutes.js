const express = require("express");
const multer = require("multer");
const path = require("path");
const { addLostItem, getLostItems } = require("../controllers/lostnfoundController");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post("/", upload.single("uploaded_image"), addLostItem);
router.get("/", getLostItems);

module.exports = router;
