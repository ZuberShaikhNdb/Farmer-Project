// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  location: String,
  category: String,
  harvestDate: Date,
  image: String, // filename of uploaded image
  inStock: {
    type: Boolean,
    default: true,
  },
  contact: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;   // ✅ ESM export
