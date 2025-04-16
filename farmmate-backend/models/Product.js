const mongoose = require("mongoose");

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
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
