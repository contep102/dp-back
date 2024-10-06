import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";
import UserRoute from "./router/userRor.js"; // Ensure the import path is correct
import RoomRoute from "./router/roomRor.js"; // Ensure the import path is correct
import ContestRoute from "./router/contestRor.js";
import mongoose from "mongoose";
import morgan from "morgan";
import {
  autoContestComing,
  autoContestProgress,
} from "./auto-api/changeContest.js";
import {
  leaveRoom,
  getUserName,
  initialUpdate,
  notifiyParticipantLeftRoom,
  addMember,
} from "./utils/roomHandler.js";
const app = express();

dotenv.config();

const roomMembers = new Map(); // Map to store members of each room

const socketToRooms = new Map();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://video-confe-server.vercel.app"
        : "http://localhost:3000",
  },
});
//////////////////////////

app.set("trust proxy", 1);
const corsOptions = {
  origin: "*",
};
app.use(express.json()); // Place before rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
      status: 429,
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    },
  })
);
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use("/api/user", UserRoute);
app.use("/api/room", RoomRoute);
app.use("/api/contest", ContestRoute);
///////////////////////////
io.on("connection", (socket) => {
  initialUpdate(roomMembers, socketToRooms);

  socket.on("disconnect", () => {
    leaveRoom(socket, roomMembers, socketToRooms);
  });

  socket.on("join-room", (data) => {
    const { roomId, email } = data;
    socket.join(roomId);

    addMember({ roomId, email, socket }, roomMembers, socketToRooms);
  });

  socket.on("leave-room", (data) => {
    const { roomId } = data;

    // delete user from map of members
    leaveRoom(socket, roomMembers, socketToRooms);

    socket.leave(roomId);
  });

  socket.on("connection-init", (data) => {
    const { incomingSocketId } = data;

    const initData = { incomingSocketId: socket.id };
    socket.to(incomingSocketId).emit("connection-init", initData);
  });

  socket.on("connection-signal", (signalData) => {
    const { incomingSocketId, signal } = signalData;

    const serverSignalingData = { signal, incomingSocketId: socket.id };

    socket.to(incomingSocketId).emit("connection-signal", serverSignalingData);
  });

  socket.on("send_message", (msgData) => {
    const { roomId } = msgData;
    io.to(roomId).emit("send_message_to_room", msgData);
  });

  // socket event to get the remote stream user name
  socket.on("request_username", (data) => {
    const { querySocketId, roomId } = data;

    const user = getUserName(querySocketId, roomId, roomMembers);

    io.to(roomId).emit("receive_username", {
      username: user.email,
      remoteSocketId: querySocketId,
    });
  });
});

app.get("/", (req, res, next) => {
  res.send("Welcome to the server side of video conferencing app 📽 🎮");
});
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
    setInterval(autoContestComing, 10 * 1000);
    setInterval(autoContestProgress, 10 * 1000);
  })
  .catch((err) => {
    console.log("Something went wrong:", err);
  });
