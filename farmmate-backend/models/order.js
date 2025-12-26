import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      farmerId: String, // ✅ Add farmer ID
      farmerEmail: String, // ✅ Add farmer email
      farmerName: String, // ✅ Add farmer name
    },
  ],
  totalAmount: Number,
  // OTP for order confirmation (optional)
  otp: String,
  otpExpiry: Date,
  otpVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
