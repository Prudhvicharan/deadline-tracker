const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/userModel");

// Get user's colleges
router.get("/user/colleges", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("colleges");
    res.json(user.colleges);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user colleges", error: error.message });
  }
});

// Add college to user's list
router.post("/user/colleges", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.colleges.push(req.body.collegeId);
    await user.save();
    res.json({ message: "College added to user list" });
  } catch (error) {
    res.status(500).json({
      message: "Error adding college to user list",
      error: error.message,
    });
  }
});

// Get user details
router.get("/userDetails", authMiddleware, async (req, res) => {
  try {
    // Fetch user by ID
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("colleges");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        colleges: user.colleges,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
});
module.exports = router;
