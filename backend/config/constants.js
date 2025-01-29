require("dotenv").config({ path: "../.env" });

module.exports = {
  SERVER: {
    PORT: process.env.PORT || 5001,
    BASE_URL: "/api",
  },
  DATABASE: {
    MONGODB_URI:
      process.env.MONGODB_URI || "mongodb://localhost:27017/deadlineTracker",
  },
  EXTERNAL_APIS: {
    COLLEGE_SCORECARD: {
      BASE_URL: "https://api.data.gov/ed/collegescorecard/v1/schools",
      API_KEY: process.env.API_KEY,
    },
  },
  AUTH: {
    JWT_SECRET:
      process.env.JWT_SECRET || "9H!a$Xs@ZpR3&5!LrT0Q1gW8fL7mE4k3jN2bP!",
    JWT_EXPIRATION: "1d",
  },
  PAGINATION: {
    DEFAULT_PAGE: 0,
    DEFAULT_PER_PAGE: 20,
  },
  ERROR_MESSAGES: {
    UNAUTHORIZED: "Unauthorized access",
    NOT_FOUND: "Resource not found",
    SERVER_ERROR: "Internal server error",
  },
};
