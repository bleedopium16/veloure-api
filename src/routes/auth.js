import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = Router();

function makeToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
// Body: { name, email, password }
// Creates a new user with a hashed password, returns a token + basic user info.
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Has someone already registered with this email?
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash the password (never store the raw one) using the helper on the model.
    const passwordHash = await User.hashPassword(password);

    const user = await User.create({ name, email, passwordHash });

    const token = makeToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// POST /api/auth/login
// Body: { email, password }
// Verifies credentials, returns a token + basic user info.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the typed password against the stored hash.
    const ok = await user.verifyPassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = makeToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// GET /api/auth/me   (protected)
// Returns the currently logged-in user. Proves the token works.
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Failed to load user" });
  }
});

export default router;
