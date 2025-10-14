import express from "express";
import twilio from "twilio";
import User from "../models/User.js";
import Product from "../models/Product.js";
import dotenv from "dotenv";
import Otp from "../models/Otp.js";
import Purchase from "../models/Purchase.js";

const router = express.Router();

dotenv.config();

// Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
console.log('Twilio ENV:', accountSid, authToken, twilioPhone);
const client = twilio(accountSid, authToken);


// Helper: Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1. Initiate purchase: generate/send OTP
router.post('/initiate', async (req, res) => {
  const { buyerId, productId, phone } = req.body;
  let sendToPhone = phone;
  if (!sendToPhone) {
    // Only check buyer existence if phone not provided
    const buyer = await User.findById(buyerId);
    if (!buyer) return res.status(400).json({ error: 'Buyer not found' });
    if (!buyer.phone) return res.status(400).json({ error: 'Buyer missing phone' });
    sendToPhone = buyer.phone;
  }
  const otp = generateOTP();
  try {
    // store OTP in DB (expires via TTL index)
    await Otp.create({ buyerId, productId, otp, phone: sendToPhone });
  } catch (dbErr) {
    console.error('Failed to save OTP to DB:', dbErr);
    return res.status(500).json({ error: 'Failed to store OTP', details: dbErr.message });
  }
  // Send OTP via SMS
  try {
    await client.messages.create({
      body: `Your FarmMate OTP is: ${otp}`,
      from: twilioPhone,
      to: sendToPhone
    });
    res.json({ message: 'OTP sent to buyer' });
  } catch (err) {
    console.error('Twilio error:', err);
    res.status(500).json({ error: 'Failed to send OTP', details: err.message || err });
  }
});

// 2. Confirm purchase: verify OTP, notify farmer
router.post('/confirm', async (req, res) => {
  const { buyerId, otp } = req.body;
  try {
    // Look up OTP record in DB
    const record = await Otp.findOne({ buyerId }).sort({ createdAt: -1 });
    if (!record || record.otp !== otp) return res.status(400).json({ error: 'Invalid or expired OTP' });

    // Complete purchase logic here (e.g., update cart, product, etc.)
    // Fetch product and farmer
    const product = await Product.findById(record.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Try to lookup farmer by product.farmerId
    let farmer = null;
    if (product.farmerId) {
      farmer = await User.findById(product.farmerId);
    }

    // Determine phone to notify: prefer farmer.phone, fallback to product.contact.phone
    const farmerPhone = farmer?.phone || product?.contact?.phone || null;

    if (!farmer && !farmerPhone) {
      console.error('Confirm Purchase: farmer missing and product has no contact phone', { productId: product._id });
      return res.status(404).json({ error: 'Farmer not found and product contact missing phone' });
    }

    // Verbose debug info to help identify wrong recipient
    console.log('Confirm Purchase Debug:', {
      buyerId,
      productId: product._id,
      recordPhone: record.phone || null,
      productContactPhone: product?.contact?.phone || null,
      farmerPhone: farmer?.phone || null,
      chosenPhone: farmerPhone,
      farmerId: product.farmerId || null
    });

    if (record.phone && farmerPhone && record.phone === farmerPhone) {
      console.warn('Chosen farmer phone equals buyer phone — this may indicate product.contact.phone was set to buyer phone or farmer record points to buyer phone.', { buyerId, productId: product._id, phone: farmerPhone });
    }

    // Send confirmation SMS
    await client.messages.create({
      body: `Your product '${product.name}' has been purchased by buyer ID: ${buyerId}!`,
      from: twilioPhone,
      to: farmerPhone
    });

    // Persist purchase
    try {
      await Purchase.create({ buyerId, productId: product._id, farmerId: product.farmerId || null, phone: farmerPhone });
    } catch (pErr) {
      console.error('Failed to persist purchase:', pErr);
    }

    // Remove OTP record from DB
    try {
      await Otp.deleteMany({ buyerId });
    } catch (delErr) {
      console.error('Failed to remove OTP record(s):', delErr);
    }

  const responsePayload = { message: 'Purchase confirmed and farmer notified', notifyTo: farmerPhone };
  if (!product.farmerId) responsePayload.note = 'Product has no farmerId; notification was sent to product.contact.phone';
  if (record.phone && farmerPhone && record.phone === farmerPhone) responsePayload.note = (responsePayload.note ? responsePayload.note + ' ' : '') + 'Chosen phone equals buyer phone — check product/contact data.';
  res.json(responsePayload);
  } catch (err) {
    console.error('Confirm Purchase Error:', err);
    res.status(500).json({ error: 'Failed to confirm purchase or notify farmer', details: err.message });
  }
});

export default router;
