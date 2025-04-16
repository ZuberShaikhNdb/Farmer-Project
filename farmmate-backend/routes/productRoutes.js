const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const router = express.Router();

// Image upload config using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Add a product (with image upload)
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    // Log for debugging
    console.log("Form Data:", req.body);
    console.log("Uploaded File:", req.file);

    const productData = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      quantity: parseFloat(req.body.quantity),
      description: req.body.description,
      location: req.body.location,
      category: req.body.category,
      harvestDate: req.body.harvestDate,
      inStock: req.body.inStock === "true" || req.body.inStock === true,
      image: req.file ? req.file.filename : null,
      contact: {
        email: req.body["contact[email]"],
        phone: req.body["contact[phone]"],
      },
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error saving product:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
