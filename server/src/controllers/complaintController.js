import asyncHandler from "express-async-handler";
import Complaint from "../models/Complaint.js";
import Category from "../models/Category.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import { nextComplaintNumber } from "../models/Counter.js";
import { uploadBuffer } from "../config/cloudinary.js";
import { isValidTransition } from "../utils/statusFlow.js";
import { notifyUser } from "../utils/notify.js";
import { logActivity } from "../utils/logActivity.js";
import { emitToComplaint, SOCKET_EVENTS } from "../config/socket.js";

const POPULATE_FIELDS = [
  { path: "category", select: "name icon avgResolutionHrs" },
  { path: "raisedBy", select: "name email avatarColor location" },
  { path: "assignedTo", select: "name email avatarColor department" },
];

/** Strips internalNotes for anyone who isn't staff or admin, and embeds feedback (a separate collection) as a plain `feedback` field to match the shape the frontend expects. */
function serializeComplaint(complaint, viewerRole, feedbackDoc = null) {
  const obj = complaint.toObject ? complaint.toObject() : complaint;
  if (viewerRole === "user") delete obj.internalNotes;
  obj.feedback = feedbackDoc ? { rating: feedbackDoc.rating, comment: feedbackDoc.comment, timestamp: feedbackDoc.createdAt } : null;
  return obj;
}

// @desc    List complaints, scoped by the caller's role, with filters + pagination
// @route   GET /api/complaints
// @access  Private
export const listComplaints = asyncHandler(async (req, res) => {
  const { status, category, priority, search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (req.user.role === "user") filter.raisedBy = req.user._id;
  if (req.user.role === "staff") filter.assignedTo = req.user._id;
  // admin sees everything — no additional filter

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Complaint.find(filter).populate(POPULATE_FIELDS).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
    Complaint.countDocuments(filter),
  ]);

  const feedbacks = await Feedback.find({ complaint: { $in: items.map((c) => c._id) } });
  const feedbackMap = new Map(feedbacks.map((f) => [f.complaint.toString(), f]));

  res.json({
    success: true,
    data: items.map((c) => serializeComplaint(c, req.user.role, feedbackMap.get(c._id.toString()))),
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});

// @desc    Create a complaint (with optional image uploads)
// @route   POST /api/complaints
// @access  Private (user)
export const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, priority, location } = req.body;

  if (!title || !description || !category || !location) {
    res.status(400);
    throw new Error("Title, description, category, and location are required");
  }

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    res.status(400);
    throw new Error("Invalid category");
  }

  let images = [];
  if (req.files?.length) {
    images = await Promise.all(req.files.map((f) => uploadBuffer(f.buffer)));
  }

  const complaint = await Complaint.create({
    complaintId: await nextComplaintNumber(),
    title,
    description,
    category,
    priority: priority || "Medium",
    location,
    raisedBy: req.user._id,
    images,
    estimatedResolutionHrs: categoryDoc.avgResolutionHrs,
    timeline: [{ status: "Pending", note: "Complaint submitted.", actor: req.user._id }],
  });

  await logActivity({ actorId: req.user._id, action: `raised ${complaint.complaintId}`, complaintId: complaint._id });

  const populated = await complaint.populate(POPULATE_FIELDS);
  res.status(201).json({ success: true, data: serializeComplaint(populated, req.user.role) });
});

// @desc    Get a single complaint by its Mongo id
// @route   GET /api/complaints/:id
// @access  Private (owner, assigned staff, or admin)
export const getComplaint = asyncHandler(async (req, res) => {
  const complaint = await requireComplaint(req.params.id);
  assertCanView(complaint, req.user);
  const populated = await complaint.populate(POPULATE_FIELDS);
  const feedbackDoc = await Feedback.findOne({ complaint: complaint._id });
  res.json({ success: true, data: serializeComplaint(populated, req.user.role, feedbackDoc) });
});

// @desc    Update editable fields of a complaint (title/description/location/priority)
// @route   PUT /api/complaints/:id
// @access  Private (owner while Pending, or admin any time)
export const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await requireComplaint(req.params.id);

  const isOwner = complaint.raisedBy.toString() === req.user._id.toString();
  const canEdit = req.user.role === "admin" || (isOwner && complaint.status === "Pending");
  if (!canEdit) {
    res.status(403);
    throw new Error("This complaint can no longer be edited");
  }

  const { title, description, location, priority } = req.body;
  if (title !== undefined) complaint.title = title;
  if (description !== undefined) complaint.description = description;
  if (location !== undefined) complaint.location = location;
  if (priority !== undefined) complaint.priority = priority;

  await complaint.save();
  const populated = await complaint.populate(POPULATE_FIELDS);
  res.json({ success: true, data: serializeComplaint(populated, req.user.role) });
});

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (admin)
export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await requireComplaint(req.params.id);
  await complaint.deleteOne();
  res.json({ success: true, message: "Complaint deleted" });
});

// @desc    Assign a complaint to a staff member
// @route   PUT /api/complaints/:id/assign
// @access  Private (admin)
export const assignComplaint = asyncHandler(async (req, res) => {
  const { staffId } = req.body;
  const complaint = await requireComplaint(req.params.id);

  const staff = await User.findOne({ _id: staffId, role: "staff" });
  if (!staff) {
    res.status(400);
    throw new Error("Staff member not found");
  }

  complaint.assignedTo = staff._id;
  complaint.status = "Assigned";
  complaint.timeline.push({ status: "Assigned", note: `Assigned to ${staff.name}.`, actor: req.user._id });
  await complaint.save();

  await Promise.all([
    logActivity({ actorId: req.user._id, action: `assigned ${complaint.complaintId} to ${staff.name}`, complaintId: complaint._id }),
    notifyUser({ userId: complaint.raisedBy, title: "Staff assigned", body: `${staff.name} was assigned to ${complaint.complaintId}.`, complaintId: complaint._id }),
    notifyUser({ userId: staff._id, title: "New assignment", body: `You were assigned ${complaint.complaintId}.`, complaintId: complaint._id }),
  ]);

  emitToComplaint(complaint._id, SOCKET_EVENTS.COMPLAINT_UPDATED, { id: complaint._id, status: complaint.status });

  const populated = await complaint.populate(POPULATE_FIELDS);
  res.json({ success: true, data: serializeComplaint(populated, req.user.role) });
});

// @desc    Move a complaint to a new status
// @route   PUT /api/complaints/:id/status
// @access  Private (assigned staff or admin)
export const updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const complaint = await requireComplaint(req.params.id);

  const isAssignedStaff = complaint.assignedTo && complaint.assignedTo.toString() === req.user._id.toString();
  if (req.user.role !== "admin" && !isAssignedStaff) {
    res.status(403);
    throw new Error("Only the assigned staff member or an admin can update this complaint's status");
  }

  if (!isValidTransition(complaint.status, status)) {
    res.status(400);
    throw new Error(`Cannot move from "${complaint.status}" to "${status}"`);
  }

  complaint.status = status;
  complaint.timeline.push({ status, note: note || `Marked as ${status}.`, actor: req.user._id });
  if (status === "Resolved") complaint.resolvedAt = new Date();

  await complaint.save();

  // Keep the assigned staff member's resolved count in sync
  if (status === "Resolved" && complaint.assignedTo) {
    await User.findByIdAndUpdate(complaint.assignedTo, { $inc: { resolvedCount: 1 } });
  }

  await Promise.all([
    logActivity({ actorId: req.user._id, action: `moved ${complaint.complaintId} to ${status}`, complaintId: complaint._id }),
    notifyUser({ userId: complaint.raisedBy, title: "Status updated", body: `${complaint.complaintId} is now ${status}.`, complaintId: complaint._id }),
  ]);

  emitToComplaint(complaint._id, SOCKET_EVENTS.COMPLAINT_UPDATED, { id: complaint._id, status: complaint.status });

  const populated = await complaint.populate(POPULATE_FIELDS);
  const feedbackDoc = await Feedback.findOne({ complaint: complaint._id });
  res.json({ success: true, data: serializeComplaint(populated, req.user.role, feedbackDoc) });
});

// @desc    Add a public comment (visible to the student who raised it)
// @route   POST /api/complaints/:id/comments
// @access  Private (owner, assigned staff, or admin)
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    res.status(400);
    throw new Error("Comment text is required");
  }

  const complaint = await requireComplaint(req.params.id);
  assertCanView(complaint, req.user);

  complaint.comments.push({ author: req.user._id, text: text.trim() });
  await complaint.save();

  emitToComplaint(complaint._id, SOCKET_EVENTS.COMPLAINT_UPDATED, { id: complaint._id });

  res.status(201).json({ success: true, data: complaint.comments[complaint.comments.length - 1] });
});

// @desc    Add an internal note (staff/admin only, never shown to the student)
// @route   POST /api/complaints/:id/notes
// @access  Private (staff, admin)
export const addInternalNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    res.status(400);
    throw new Error("Note text is required");
  }

  const complaint = await requireComplaint(req.params.id);
  complaint.internalNotes.push({ author: req.user._id, text: text.trim() });
  await complaint.save();

  res.status(201).json({ success: true, data: complaint.internalNotes[complaint.internalNotes.length - 1] });
});

// @desc    Submit feedback for a resolved complaint
// @route   POST /api/complaints/:id/feedback
// @access  Private (owner)
export const submitFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const complaint = await requireComplaint(req.params.id);

  if (complaint.raisedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the person who raised this complaint can leave feedback");
  }
  if (!["Resolved", "Closed"].includes(complaint.status)) {
    res.status(400);
    throw new Error("Feedback can only be left once a complaint is resolved");
  }

  const existing = await Feedback.findOne({ complaint: complaint._id });
  if (existing) {
    res.status(409);
    throw new Error("Feedback has already been submitted for this complaint");
  }

  const feedback = await Feedback.create({ complaint: complaint._id, user: req.user._id, rating, comment });

  if (complaint.assignedTo) {
    const stats = await Feedback.aggregate([
      { $lookup: { from: "complaints", localField: "complaint", foreignField: "_id", as: "c" } },
      { $unwind: "$c" },
      { $match: { "c.assignedTo": complaint.assignedTo } },
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);
    if (stats[0]) await User.findByIdAndUpdate(complaint.assignedTo, { rating: Math.round(stats[0].avg * 10) / 10 });
  }

  res.status(201).json({ success: true, data: feedback });
});

// ---- helpers -------------------------------------------------------------

async function requireComplaint(id) {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    const err = new Error("Complaint not found");
    err.status = 404;
    throw Object.assign(err, { statusCode: 404 });
  }
  return complaint;
}

function assertCanView(complaint, user) {
  const isOwner = complaint.raisedBy.toString() === user._id.toString();
  const isAssigned = complaint.assignedTo && complaint.assignedTo.toString() === user._id.toString();
  if (user.role === "admin" || isOwner || isAssigned) return;
  const err = new Error("You don't have access to this complaint");
  err.statusCode = 403;
  throw err;
}
