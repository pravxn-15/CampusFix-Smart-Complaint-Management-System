import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1023 }, // first generated complaint will be CMP-1024
});

const Counter = mongoose.model("Counter", counterSchema);

export async function nextComplaintNumber() {
  const counter = await Counter.findByIdAndUpdate(
    "complaintId",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `CMP-${counter.seq}`;
}

export default Counter;
