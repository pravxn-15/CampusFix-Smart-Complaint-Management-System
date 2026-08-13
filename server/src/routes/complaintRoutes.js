import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { upload } from "../middleware/upload.js";
import {
  listComplaints,
  createComplaint,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  assignComplaint,
  updateStatus,
  addComment,
  addInternalNote,
  submitFeedback,
} from "../controllers/complaintController.js";
import { getMessages, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(listComplaints).post(upload.array("images", 4), createComplaint);

router
  .route("/:id")
  .get(getComplaint)
  .put(updateComplaint)
  .delete(authorize("admin"), deleteComplaint);

router.put("/:id/assign", authorize("admin"), assignComplaint);
router.put("/:id/status", authorize("staff", "admin"), updateStatus);

router.post("/:id/comments", addComment);
router.post("/:id/notes", authorize("staff", "admin"), addInternalNote);
router.post("/:id/feedback", authorize("user"), submitFeedback);

router.route("/:id/messages").get(getMessages).post(sendMessage);

export default router;
