// routes/productRoutes.js
import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Set up Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST: Add new product
// Protected: only logged-in users (farmers) can add products
router.post("/add", auth, upload.single("image"), async (req, res) => {
  console.log("req.body:", req.body);

  try {
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
      // set farmerId from authenticated user
      farmerId: req.user?.id || null,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    // send validation details if available
    res.status(400).json({ error: "Invalid product data", details: err.message });
  }
});

export default router;  // ✅ ESM export
