import express from "express";
import { getAdminDashboardData } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("Admin"), getAdminDashboardData);

export default router;
