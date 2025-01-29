const express = require("express");
const router = express.Router();
const CollegeService = require("../services/collegeService");
const UserService = require("../services/userService");
const authMiddleware = require("../middleware/auth.middleware");
const constants = require("../config/constants");

// Public route to fetch colleges
router.get("/", async (req, res, next) => {
  try {
    const {
      page = constants.PAGINATION.DEFAULT_PAGE,
      per_page = constants.PAGINATION.DEFAULT_PER_PAGE,
    } = req.query;
    const colleges = await CollegeService.fetchColleges(page, per_page);
    res.json(colleges);
  } catch (error) {
    next(error);
  }
});

// Protected route to get user's colleges
router.get("/user", authMiddleware, async (req, res, next) => {
  try {
    const userColleges = await UserService.getUserColleges(req.userId);
    res.json(userColleges);
  } catch (error) {
    next(error);
  }
});

// Protected route to add a college to user's list
router.post("/user", authMiddleware, async (req, res, next) => {
  try {
    const college = await UserService.addCollegeToUser(req.userId, req.body);
    res.status(201).json({ message: "College added successfully", college });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
