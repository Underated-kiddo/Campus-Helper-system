const express = require("express");
const { getAdminDashboardData } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboardData);

module.exports = router;