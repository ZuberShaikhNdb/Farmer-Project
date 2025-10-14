import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  otp: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now, index: true }
});

// TTL index - expire documents 10 minutes after createdAt
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
