import { Router } from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = Router();

// GET /api/wishlist — the logged-in user's wishlist with full product details.
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("wishlist");
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: "Failed to load wishlist" });
    }
});

// POST /api/wishlist — toggle a product in/out of the wishlist.
router.post("/", auth, async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const user = await User.findById(req.userId);

        const index = user.wishlist.findIndex((id) => id.toString() === productId);
        if (index >= 0) {
            user.wishlist.splice(index, 1);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        await user.populate("wishlist");
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: "Failed to update wishlist" });
    }
});

export default router;