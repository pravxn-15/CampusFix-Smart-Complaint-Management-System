import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(listCategories).post(authorize("admin"), createCategory);
router.route("/:id").put(authorize("admin"), updateCategory).delete(authorize("admin"), deleteCategory);

export default router;
