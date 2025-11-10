import express from "express";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";

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

    // Create order
    const order = new Order({
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
    });

    const savedOrder = await order.save();

    // ✅ Send response
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

export default router;