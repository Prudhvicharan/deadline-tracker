const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const constants = require("./config/constants");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/userRoutes");
const collegeRoutes = require("./routes/collegeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(constants.DATABASE.MONGODB_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route Registration
app.use(`${constants.SERVER.BASE_URL}/auth`, authRoutes);
app.use(`${constants.SERVER.BASE_URL}`, userRoutes);
app.use(`${constants.SERVER.BASE_URL}/colleges`, collegeRoutes);

// Global Error Handler
app.use(errorHandler);

// Server Start
app.listen(constants.SERVER.PORT, () => {
  console.log(`Server running on port ${constants.SERVER.PORT}`);
});
