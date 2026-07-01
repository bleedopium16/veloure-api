import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

// GET /api/products
// GET /api/products?category=makeup
// GET /api/products?search=lipstick
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    // Case-insensitive name search using a regex.
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to load products" });
  }
});

// GET /api/products/bestsellers — only featured products
// NOTE: must come BEFORE /:id
router.get("/bestsellers", async (req, res) => {
  try {
    const products = await Product.find({ bestseller: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to load bestsellers" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product id" });
  }
});

export default router;