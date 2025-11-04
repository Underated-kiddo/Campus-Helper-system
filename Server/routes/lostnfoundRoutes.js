const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { createItem } = require("../controllers/lostnfoundController");

router.post("/", upload.single("picture"), createItem);

module.exports = router;
