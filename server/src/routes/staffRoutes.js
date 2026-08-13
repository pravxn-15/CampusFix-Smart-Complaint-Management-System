import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { listStaff, createStaff, updateStaff, deleteStaff } from "../controllers/staffController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.route("/").get(listStaff).post(createStaff);
router.route("/:id").put(updateStaff).delete(deleteStaff);

export default router;
