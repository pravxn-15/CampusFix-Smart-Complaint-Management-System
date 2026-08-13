import mongoose from "mongoose";

const STATUS_VALUES = ["Pending", "Assigned", "Accepted", "In Progress", "On Hold", "Resolved", "Closed", "Rejected"];
const PRIORITY_VALUES = ["Low", "Medium", "High", "Critical"];

const timelineEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: STATUS_VALUES, required: true },
    note: { type: String, default: "" },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const threadEntrySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  { url: String, publicId: String },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, unique: true, index: true }, // e.g. "CMP-1024"
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    priority: { type: String, enum: PRIORITY_VALUES, default: "Medium" },
    status: { type: String, enum: STATUS_VALUES, default: "Pending", index: true },
    location: { type: String, required: true, trim: true },

    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },

    images: [imageSchema],
    estimatedResolutionHrs: { type: Number, default: 24 },

    timeline: [timelineEventSchema],
    comments: [threadEntrySchema],
    internalNotes: [threadEntrySchema], // visible to staff/admin only — enforced in the controller layer

    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

complaintSchema.index({ title: "text", description: "text" });

export const STATUSES = STATUS_VALUES;
export const PRIORITIES = PRIORITY_VALUES;

export default mongoose.model("Complaint", complaintSchema);
