const express = require("express");
const router = express.Router();
const uploadLostnfound = require("../middleware/uploadLostnfound");
const { addLostItem, getLostItems } = require("../controllers/lostnfoundController");

router.post(
    "/",
    uploadLostnfound.single("uploaded_image"),
    addLostItem
);

router.get("/", getLostItems);

module.exports = router;