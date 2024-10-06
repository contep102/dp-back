import mongoose, { Schema } from "mongoose";
const product = new mongoose.Schema({
  user: Schema.Types.ObjectId,
  name: String,
  price: String,
  branch: { type: String, require: true },
  rate: { type: Number, default: 0 },
  soComment: { type: Number, default: 0 },
  daBan: { type: Number, default: 0 },
  conLai: { type: Number, require: true },
  banTrongThang: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", product);

export default Product;
