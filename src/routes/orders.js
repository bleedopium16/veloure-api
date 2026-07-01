import { Router } from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";

const router = Router();

// POST /api/orders   (protected)
// Turns the logged-in user's cart into a saved Order, then empties the cart.
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.product");

    if (!user.cart.length) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Build the order items by copying name + price from each product NOW,
    // so the order stays accurate even if a product changes price later.
    const items = user.cart.map((line) => ({
      product: line.product._id,
      name: line.product.name,
      price: line.product.price,
      qty: line.qty,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await Order.create({
      user: user._id,
      items,
      total,
    });

    // Empty the cart now that it's been turned into an order.
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to place order" });
  }
});

// GET /api/orders   (protected)
// Returns the logged-in user's order history, newest first.
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to load orders" });
  }
});

export default router;
