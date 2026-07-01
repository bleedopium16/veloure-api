import { Router } from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = Router();

// Every route here is protected: the `auth` middleware runs first, so we always
// know which user (req.userId) is making the request.

// GET /api/cart
// Returns the logged-in user's cart with full product details filled in.
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.product");
    // populate() swaps each stored product id for the full product object.
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to load cart" });
  }
});

// POST /api/cart
// Body: { productId, qty? }
// Adds a product to the cart, or bumps the quantity if it's already there.
router.post("/", auth, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    // Make sure the product actually exists before adding it.
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.userId);

    // Is this product already in the cart?
    const existing = user.cart.find((item) => item.product.toString() === productId);
    if (existing) {
      existing.qty += qty; // already there → increase quantity
    } else {
      user.cart.push({ product: productId, qty }); // not there → add new line
    }

    await user.save();
    await user.populate("cart.product");
    res.status(201).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
});
// PATCH /api/cart/decrease
// Body: { productId }
// Lowers the quantity by 1. If it would hit 0, removes the item entirely.
router.patch("/decrease", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.userId);

    const existing = user.cart.find(
      (item) => item.product.toString() === productId
    );
    if (!existing) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    existing.qty -= 1;
    if (existing.qty <= 0) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    }

    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// DELETE /api/cart/:productId
// Removes a product from the cart entirely.
router.delete("/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart" });
  }
});

export default router;
