import mongoose, { Schema } from "mongoose";
const room = new mongoose.Schema(
  {
    name: { type: String, require: true },
    topic: { type: [String] },
    limit: { type: Number, require: true },
    intro: { type: String, require: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    history: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    block: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  },
  { timestamps: true }
);
const Room = mongoose.model("Room", room);
export default Room;
