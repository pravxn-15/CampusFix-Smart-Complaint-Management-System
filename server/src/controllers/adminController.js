import asyncHandler from "express-async-handler";
import Complaint from "../models/Complaint.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import { OPEN_STATUSES, CLOSED_STATUSES } from "../utils/statusConstants.js";

// @desc    High-level counts + breakdowns for the admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private (admin)
export const getDashboard = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [total, open, resolved, critical, today, statusBreakdown, categoryBreakdown, recentActivity] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: { $in: OPEN_STATUSES } }),
    Complaint.countDocuments({ status: { $in: CLOSED_STATUSES } }),
    Complaint.countDocuments({ priority: "Critical", status: { $in: OPEN_STATUSES } }),
    Complaint.countDocuments({ createdAt: { $gte: startOfToday } }),
    Complaint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $project: { name: "$category.name", count: 1, _id: 0 } },
    ]),
    ActivityLog.find().populate("actor", "name").sort({ createdAt: -1 }).limit(8),
  ]);

  const topStaff = await User.find({ role: "staff" }).sort({ resolvedCount: -1 }).limit(4);

  res.json({
    success: true,
    data: {
      total,
      open,
      resolved,
      critical,
      today,
      statusBreakdown,
      categoryBreakdown,
      recentActivity,
      topStaff,
    },
  });
});

// @desc    Filtered report data (date range + category)
// @route   GET /api/admin/reports
// @access  Private (admin)
export const getReports = asyncHandler(async (req, res) => {
  const { rangeDays = 30, category } = req.query;

  const filter = {};
  if (rangeDays !== "all") {
    filter.createdAt = { $gte: new Date(Date.now() - Number(rangeDays) * 86400000) };
  }
  if (category) filter.category = category;

  const complaints = await Complaint.find(filter);
  const resolved = complaints.filter((c) => CLOSED_STATUSES.includes(c.status));
  const rejected = complaints.filter((c) => c.status === "Rejected");

  const avgResolutionHrs = resolved.length
    ? Math.round(resolved.reduce((sum, c) => sum + (c.updatedAt - c.createdAt) / 3600000, 0) / resolved.length)
    : 0;

  const categories = await Category.find();
  const categoryBreakdown = categories
    .map((cat) => ({ name: cat.name, count: complaints.filter((c) => c.category.toString() === cat._id.toString()).length }))
    .filter((c) => c.count > 0);

  res.json({
    success: true,
    data: {
      total: complaints.length,
      resolved: resolved.length,
      rejected: rejected.length,
      avgResolutionHrs,
      categoryBreakdown,
    },
  });
});

// @desc    Paginated activity log
// @route   GET /api/admin/activity
// @access  Private (admin)
export const getActivityLog = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    ActivityLog.find().populate("actor", "name").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ActivityLog.countDocuments(),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});
