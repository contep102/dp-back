import mongoose, { Schema } from "mongoose";
const email = new mongoose.Schema({
  mail: String,
  status: { type: Boolean, default: false },
  codeAuthEmail: String,
  forgotPass: String
});

const Email = mongoose.model("Email", email);

export default Email;
