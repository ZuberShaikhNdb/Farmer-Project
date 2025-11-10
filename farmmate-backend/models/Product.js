// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    description: String,
    location: String,
    category: String,
    harvestDate: Date,
    image: String,
    inStock: { type: Boolean, default: true },
    contact: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 who listed it
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
