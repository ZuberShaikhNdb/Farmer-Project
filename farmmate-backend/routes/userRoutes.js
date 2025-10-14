import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/user/listed -> return products listed by the logged-in user (farmer)
router.get('/listed', auth, async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching listed products', error: err.message });
  }
});

// GET /api/user/purchases -> placeholder: if purchases implemented, return them; otherwise return empty list
router.get('/purchases', auth, async (req, res) => {
  try {
    // No Purchase model available in this repo. Return empty array to avoid 404 on frontend.
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching purchases', error: err.message });
  }
});

export default router; // ✅ ESM export
