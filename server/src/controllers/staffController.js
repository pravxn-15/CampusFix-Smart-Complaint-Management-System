import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import { OPEN_STATUSES } from "../utils/statusConstants.js";

// @desc    List all staff members with live active-complaint counts
// @route   GET /api/staff
// @access  Private (admin)
export const listStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({ role: "staff" }).populate("specialty", "name icon").sort({ name: 1 });

  const activeCounts = await Complaint.aggregate([
    { $match: { assignedTo: { $ne: null }, status: { $in: OPEN_STATUSES } } },
    { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(activeCounts.map((c) => [c._id.toString(), c.count]));

  const data = staff.map((s) => {
    const obj = s.toObject();
    obj.activeCount = countMap.get(s._id.toString()) || 0;
    return obj;
  });

  res.json({ success: true, data });
});

// @desc    Add a staff member
// @route   POST /api/staff
// @access  Private (admin)
export const createStaff = asyncHandler(async (req, res) => {
  const { name, email, department, specialty, phone, password } = req.body;

  if (!name || !email || !department) {
    res.status(400);
    throw new Error("Name, email, and department are required");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("An account with that email already exists");
  }

  const staff = await User.create({
    name,
    email,
    department,
    phone,
    specialty: specialty || [],
    password: password || Math.random().toString(36).slice(-10), // temp password if none supplied
    role: "staff",
    avatarColor: "#F59E0B",
  });

  res.status(201).json({ success: true, data: { ...staff.toObject(), password: undefined } });
});

// @desc    Update a staff member's department/specialty
// @route   PUT /api/staff/:id
// @access  Private (admin)
export const updateStaff = asyncHandler(async (req, res) => {
  const staff = await User.findOne({ _id: req.params.id, role: "staff" });
  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  const { name, department, specialty, phone, isActive } = req.body;
  if (name !== undefined) staff.name = name;
  if (department !== undefined) staff.department = department;
  if (specialty !== undefined) staff.specialty = specialty;
  if (phone !== undefined) staff.phone = phone;
  if (isActive !== undefined) staff.isActive = isActive;

  await staff.save();
  res.json({ success: true, data: staff });
});

// @desc    Remove a staff member
// @route   DELETE /api/staff/:id
// @access  Private (admin)
export const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await User.findOne({ _id: req.params.id, role: "staff" });
  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  const activeAssignments = await Complaint.countDocuments({ assignedTo: staff._id, status: { $in: OPEN_STATUSES } });
  if (activeAssignments > 0) {
    res.status(409);
    throw new Error("Reassign this staff member's open complaints before removing them");
  }

  await staff.deleteOne();
  res.json({ success: true, message: "Staff member removed" });
});
