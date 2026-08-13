import asyncHandler from "express-async-handler";
import Complaint from "../models/Complaint.js";
import ChatMessage from "../models/ChatMessage.js";
import { emitToComplaint, SOCKET_EVENTS } from "../config/socket.js";

async function assertParticipant(complaintId, user) {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    const err = new Error("Complaint not found");
    err.statusCode = 404;
    throw err;
  }
  const isOwner = complaint.raisedBy.toString() === user._id.toString();
  const isAssigned = complaint.assignedTo && complaint.assignedTo.toString() === user._id.toString();
  if (user.role !== "admin" && !isOwner && !isAssigned) {
    const err = new Error("You don't have access to this conversation");
    err.statusCode = 403;
    throw err;
  }
  return complaint;
}

// @desc    Get the chat history for a complaint
// @route   GET /api/complaints/:id/messages
// @access  Private (owner, assigned staff, admin)
export const getMessages = asyncHandler(async (req, res) => {
  await assertParticipant(req.params.id, req.user);
  const messages = await ChatMessage.find({ complaint: req.params.id })
    .populate("sender", "name avatarColor")
    .sort({ createdAt: 1 });
  res.json({ success: true, data: messages });
});

// @desc    Send a chat message on a complaint thread
// @route   POST /api/complaints/:id/messages
// @access  Private (owner, assigned staff, admin)
export const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    res.status(400);
    throw new Error("Message text is required");
  }

  await assertParticipant(req.params.id, req.user);

  const message = await ChatMessage.create({
    complaint: req.params.id,
    sender: req.user._id,
    text: text.trim(),
    readBy: [req.user._id],
  });

  const populated = await message.populate("sender", "name avatarColor");
  emitToComplaint(req.params.id, SOCKET_EVENTS.NEW_MESSAGE, populated);

  res.status(201).json({ success: true, data: populated });
});
