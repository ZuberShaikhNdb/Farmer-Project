// routes/productRoutes.js
import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ========== Multer setup for image upload ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ========== GET all products ==========
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "email role");
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ========== POST: Add new product (Farmer only) ==========
router.post("/add", auth, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can add products" });
    }

    const {
      name,
      price,
      quantity,
      description,
      location,
      category,
      harvestDate,
      inStock,
      contactEmail,
      contactPhone,
    } = req.body;

    const newProduct = new Product({
      name,
      price,
      quantity,
      description,
      location,
      category,
      harvestDate,
      inStock: inStock === "true",
      contact: {
        email: contactEmail,
        phone: contactPhone,
      },
      image: req.file?.filename || null,
      farmer: req.user.id, // ✅ attach farmer ID
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(400).json({ error: "Invalid product data", details: err.message });
  }
});

// ========== BUY a product (Consumer only) ==========
router.post("/:productId/buy", auth, async (req, res) => {
  try {
    if (req.user.role !== "consumer") {
      return res.status(403).json({ message: "Only consumers can buy products" });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!product.inStock || product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // ✅ Create new order
    const totalPrice = quantity * product.price;
    const newOrder = new Order({
      product: product._id,
      farmer: product.farmer,
      consumer: req.user.id,
      quantity,
      totalPrice,
    });

    await newOrder.save();

    // ✅ Update stock
    product.quantity -= quantity;
    if (product.quantity <= 0) product.inStock = false;
    await product.save();

    res.status(201).json({ message: "Purchase successful", order: newOrder });
  } catch (err) {
    console.error("Error buying product:", err);
    res.status(500).json({ message: "Error buying product", error: err.message });
  }
});

export default router;
