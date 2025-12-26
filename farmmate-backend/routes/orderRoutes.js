import express from "express";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";
import { sendBuyerEmail, sendFarmerEmail } from "../services/emailService.js";

const router = express.Router();

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const { items, fullName, email, phone, address, city, state, pincode } = req.body;
    const userId = req.user.id;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    // Validate all required fields
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    // Create order with OTP for confirmation
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes

    const newOrder = new Order({
      userId,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount,
      status: "pending",
      otp,
      otpExpiry,
      otpVerified: false,
    });

    const savedOrder = await newOrder.save();

    // ✅ Send email to buyer including OTP
    try {
      await sendBuyerEmail(email, fullName, savedOrder._id, totalAmount, items, otp);
      console.log("✅ Buyer email with OTP sent");
    } catch (emailError) {
      console.error("⚠️ Failed to send buyer email:", emailError);
    }

    // ✅ Send email to each farmer
    const farmerEmails = new Set();
    for (const item of items) {
      if (item.farmerEmail && !farmerEmails.has(item.farmerEmail)) {
        try {
          await sendFarmerEmail(
            item.farmerEmail,
            item.farmerName,
            fullName,
            [item],
            savedOrder._id
          );
          farmerEmails.add(item.farmerEmail);
          console.log("✅ Farmer email sent to:", item.farmerEmail);
        } catch (emailError) {
          console.error("⚠️ Failed to send farmer email:", emailError);
        }
      }
    }

    // ✅ Respond with order details
    return res.status(201).json({
      success: true,
      orderId: savedOrder._id,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to place order",
      details: error.toString(),
    });
  }
});

// Get user orders
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Verify order OTP
router.post('/verify-otp', auth, async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    if (!orderId || !otp) return res.status(400).json({ message: 'orderId and otp required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ensure requester is order owner
    if (order.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    if (order.otpVerified) return res.json({ message: 'OTP already verified' });

    if (!order.otp || !order.otpExpiry) return res.status(400).json({ message: 'No OTP for this order' });

    if (new Date() > new Date(order.otpExpiry)) return res.status(400).json({ message: 'OTP expired' });

    if (order.otp !== otp.toString()) return res.status(400).json({ message: 'Invalid OTP' });

    order.otpVerified = true;
    await order.save();

    return res.json({ message: 'OTP verified', orderId: order._id });
  } catch (err) {
    console.error('OTP verify error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;