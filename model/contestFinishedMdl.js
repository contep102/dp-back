import mongoose, { mongo } from "mongoose";
const contest = new mongoose.Schema({
  Thoi_Gian_Bat_Dau_Thi: { type: Date },
  Thoi_Gian_Ket_Thuc_Thi: { type: Date },
  Ten_Contest: String,
  Description: String,
  IdCtPr: { type: String },
  Thanh_Vien_Dang_Ky: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  Thanh_Vien_Tham_Gia: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  Mang_Cau_Hoi: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  Mang_Cau_Tra_Loi: [{ type: String }],
  admin: mongoose.Schema.Types.ObjectId,
  So_Bai_Nop: { type: Number, default: 0 },
});
const ContestFinished = mongoose.model("ContestFinished", contest);

export default ContestFinished;
