import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // human-readable, e.g. "assigned CMP-1014 to Suresh Nair"
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
