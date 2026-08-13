import Notification from "../models/Notification.js";
import { emitToUser, SOCKET_EVENTS } from "../config/socket.js";

export async function notifyUser({ userId, title, body, complaintId = null }) {
  const notification = await Notification.create({ user: userId, title, body, complaint: complaintId });
  emitToUser(userId, SOCKET_EVENTS.NOTIFICATION, notification);
  return notification;
}
