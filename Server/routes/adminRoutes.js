const express = require("express");
const { getAdminDashboardData } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("Admin"), getAdminDashboardData);

module.exports = router;
