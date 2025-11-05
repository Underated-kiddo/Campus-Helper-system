const express = require("express");
const { protect } = require("../middleware/auth");
const { updateSettings } = require("../controllers/settingsController");
const router = express.Router();

router.put("/", protect, updateSettings);

module.exports = router;
