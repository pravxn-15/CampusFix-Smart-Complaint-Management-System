import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const SOCKET_EVENTS = {
  JOIN_COMPLAINT: "complaint:join",
  LEAVE_COMPLAINT: "complaint:leave",
  NEW_MESSAGE: "chat:message",
  COMPLAINT_UPDATED: "complaint:updated",
  NOTIFICATION: "notification:new",
};

/**
 * Initializes Socket.IO on top of the existing HTTP server.
 * Clients authenticate by sending their JWT as `auth.token` when connecting:
 *   io(URL, { auth: { token } })
 */
export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication token missing"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Personal room for direct notifications to this user
    socket.join(`user:${socket.userId}`);

    socket.on(SOCKET_EVENTS.JOIN_COMPLAINT, (complaintId) => {
      socket.join(`complaint:${complaintId}`);
    });

    socket.on(SOCKET_EVENTS.LEAVE_COMPLAINT, (complaintId) => {
      socket.leave(`complaint:${complaintId}`);
    });

    socket.on("disconnect", () => {
      // no-op — rooms are cleaned up automatically by socket.io
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO has not been initialized yet");
  return io;
}

/** Emits a chat message to everyone viewing a given complaint's thread. */
export function emitToComplaint(complaintId, event, payload) {
  if (!io) return;
  io.to(`complaint:${complaintId}`).emit(event, payload);
}

/** Emits an event directly to one user's personal room (for notifications). */
export function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
