const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth"); // Import auth middleware

// Get current user details (protected route)
router.get("/me", auth, async (req, res) => {
  try {
    // req.user.userId comes from the auth middleware after verifying JWT
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user details by ID (optional, can be protected)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;