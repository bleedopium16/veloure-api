import jwt from "jsonwebtoken";

// This is the "gatekeeper". Put it in front of any route that should only work
// for logged-in users. It looks for a token in the Authorization header,
// verifies it, and attaches the user's id to req.userId so the route knows
// WHO is making the request.
export default function auth(req, res, next) {
  // The frontend sends:  Authorization: Bearer <token>
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the signature using our secret. If the token was tampered with
    // or has expired, this throws and we reject the request.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // make the user's id available to the route
    next(); // all good — let the request continue
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}
