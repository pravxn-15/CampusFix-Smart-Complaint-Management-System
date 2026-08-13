import express from "express";
import { protect } from "../middleware/auth.js";
import { listNotifications, markOneRead, markAllRead } from "../controllers/notificationController.js";

const router = express.Router();

router.use(protect);

router.get("/", listNotifications);
router.put("/read", markAllRead);
router.put("/:id/read", markOneRead);

export default router;
