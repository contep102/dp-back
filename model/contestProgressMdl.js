import mongoose, { mongo } from "mongoose";
const contest = new mongoose.Schema({
  TenContest: String,
  Thoi_Gian_Thi: { type: Date },
  Thoi_Gian_Ket_Thuc: { type: Date },
  Thanh_Vien_Dang_Ky: [{ type: String }],
  Thanh_Vien_Tham_Gia: [
    {
      userId: { type: String },
      thoiGianThamGia: { type: Date, default: Date.now },
    },
  ],
  Thanh_Vien_Nop_Bai: [
    {
      userId: { type: String },
      thoiGianThamGia: { type: Date, default: Date.now },
    },
  ],
  So_Bai_Nop: { type: Number, default: 0 },
  Mang_Cau_Hoi: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  Mang_Cau_Tra_Loi: [{ type: String }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  Description: String,
});
const ContestProgress = mongoose.model("ContestProgress", contest);

export default ContestProgress;
