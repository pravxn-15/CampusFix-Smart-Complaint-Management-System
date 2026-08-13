import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`CampusFix API listening on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled promise rejection:", err);
    httpServer.close(() => process.exit(1));
  });
}

start();
