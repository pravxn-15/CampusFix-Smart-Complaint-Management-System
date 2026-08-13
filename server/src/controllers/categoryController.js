import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Complaint from "../models/Complaint.js";

// @desc    List all categories
// @route   GET /api/categories
// @access  Private (any authenticated role)
export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, data: categories });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (admin)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, avgResolutionHrs } = req.body;
  if (!name?.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }
  const category = await Category.create({ name: name.trim(), icon, avgResolutionHrs });
  res.status(201).json({ success: true, data: category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  const { name, icon, avgResolutionHrs, isActive } = req.body;
  if (name !== undefined) category.name = name;
  if (icon !== undefined) category.icon = icon;
  if (avgResolutionHrs !== undefined) category.avgResolutionHrs = avgResolutionHrs;
  if (isActive !== undefined) category.isActive = isActive;
  await category.save();
  res.json({ success: true, data: category });
});

// @desc    Delete (soft-delete) a category — existing complaints keep their reference
// @route   DELETE /api/categories/:id
// @access  Private (admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const inUse = await Complaint.countDocuments({ category: category._id });
  if (inUse > 0) {
    category.isActive = false; // keep historical complaints valid, just hide from new-complaint pickers
    await category.save();
  } else {
    await category.deleteOne();
  }

  res.json({ success: true, message: "Category removed" });
});
