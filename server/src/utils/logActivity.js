import ActivityLog from "../models/ActivityLog.js";

export async function logActivity({ actorId, action, complaintId = null }) {
  return ActivityLog.create({ actor: actorId, action, complaint: complaintId });
}
