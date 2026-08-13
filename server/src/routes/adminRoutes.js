import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { getDashboard, getReports, getActivityLog } from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/reports", getReports);
router.get("/activity", getActivityLog);

export default router;
