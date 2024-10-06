import mongoose, { Schema } from "mongoose";
const user = new mongoose.Schema(
  {
    name: String,
    email: String,

    password: String,

    avatar: {
      // public_id: {
      //   type: String,
      // },
      // url: {
      type: String,
      // },
      default:
        "https://i.pinimg.com/564x/e1/bf/16/e1bf16afd3dbe6423e89712a4382b479.jpg",
    },

    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", user);
export default User;
