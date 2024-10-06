import mongoose, { Schema } from "mongoose";
const task = new mongoose.Schema({
  contestId: String,
  task: { type: String },
  a: { type: String },
  b: { type: String },
  c: { type: String },
  d: { type: String },
  answer: { type: String },
});
const Task = mongoose.model("Task", task);
export default Task;
