import mongoose from "mongoose";

const infoTest = new mongoose.Schema({
  Thi_Sinh: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  Contest_Id: String,
  So_Lan_Thoat_Tab: { type: String },
  So_Diem: { type: String },
  So_Thoi_Gian_Lam_Xong: String,
  Cac_Cau_Sai: [{ type: String }],
});

const InfoTest = mongoose.model("InfoTest", infoTest);
export default InfoTest;
