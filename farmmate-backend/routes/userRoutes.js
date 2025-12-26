import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";  // 👈 We'll add an Order model to track purchases
import auth from "../middleware/auth.js";

const router = express.Router();

// ================== PROFILE ==================
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileData = {
      id: user._id,
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json(profileData);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update profile (name, phone)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof name === "string") user.name = name.trim();
    if (typeof phone === "string") user.phone = phone.trim();

    await user.save();

    res.json({ message: "Profile updated", profile: { name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

// ================== FARMER: Listed Products ==================
router.get("/listed", auth, async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can view listed products" });
    }

    const products = await Product.find({ farmer: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching listed products", error: err.message });
  }
});

// ================== CONSUMER: Purchased Products ==================
router.get("/purchases", auth, async (req, res) => {
  try {
    if (req.user.role !== "consumer") {
      return res.status(403).json({ message: "Only consumers can view purchases" });
    }

    // Orders store the buyer as `userId` in the Order model
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching purchases", error: err.message });
  }
});

// ================== FARMER: Who bought my products ==================
router.get("/sold", auth, async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can view sold products" });
    }

    // Orders keep farmer info inside items as `farmerId` — find orders containing items sold by this farmer
    const orders = await Order.find({ "items.farmerId": req.user.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'email name');

    // Rename populated userId to consumer for compatibility with frontend expectations
    const transformed = orders.map(o => ({
      ...o.toObject(),
      consumer: o.userId,
    }));

    res.json(transformed);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sold products", error: err.message });
  }
});

export default router;
