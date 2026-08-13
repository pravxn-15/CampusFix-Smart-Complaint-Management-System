import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["user", "staff", "admin"], default: "user", index: true },
    phone: { type: String, default: "" },

    // Student-specific
    location: { type: String, default: "" }, // e.g. "Hostel Block A, Room 204"

    // Staff-specific
    department: { type: String, default: "" },
    specialty: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    resolvedCount: { type: Number, default: 0 },

    avatarUrl: { type: String, default: "" },
    avatarColor: { type: String, default: "#2563EB" },

    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ name: "text", email: "text" });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Number of complaints currently assigned to this staff member and still open.
// Computed on demand via the Complaint model rather than cached, to avoid drift.
userSchema.virtual("activeCount", { ref: "Complaint", localField: "_id", foreignField: "assignedTo", count: true });

userSchema.set("toJSON", { virtuals: true });

export default mongoose.model("User", userSchema);
