import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";

// @desc    List all student users, with their complaint counts
// @route   GET /api/users
// @access  Private (admin)
export const listUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = { role: "user" };
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  const counts = await Complaint.aggregate([{ $group: { _id: "$raisedBy", count: { $sum: 1 } } }]);
  const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

  const data = users.map((u) => ({ ...u.toObject(), complaintsRaised: countMap.get(u._id.toString()) || 0 }));

  res.json({
    success: true,
    data,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});

// @desc    Remove a student account
// @route   DELETE /api/users/:id
// @access  Private (admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: "user" });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.json({ success: true, message: "User removed — their complaint history has been preserved" });
});
