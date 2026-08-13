import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { listUsers, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", listUsers);
router.delete("/:id", deleteUser);

export default router;
