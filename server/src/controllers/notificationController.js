import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

// @desc    List the logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate("complaint", "complaintId")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, data: notifications });
});

// @desc    Mark one notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markOneRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  res.json({ success: true, data: notification });
});

// @desc    Mark all of the logged-in user's notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ success: true, message: "All notifications marked as read" });
});
