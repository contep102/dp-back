import mongoose, { mongo } from "mongoose";
const contest = new mongoose.Schema({
  Thoi_Gian_Bat_Dau_Dang_Ky: { type: Date },
  Thoi_Gian_Ket_Thuc_Dang_Ky: { type: Date },
  Thoi_Gian_Bat_Dau_Thi: { type: Date },
  Thoi_Gian_Ket_Thuc_Thi: { type: Date },
  Ten_Contest: String,
  Description: String,
  Thanh_Vien_Dang_Ky: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  Bo_Cau_Hoi: [{ type: mongoose.Schema.Types.ObjectId }],
  Bo_Cau_Tra_Loi: [{ type: String }],
  Admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const ContestComing = mongoose.model("ContestComing", contest);

export default ContestComing;
