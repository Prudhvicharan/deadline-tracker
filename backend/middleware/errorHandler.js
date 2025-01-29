const constants = require("../config/constants");

const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);

  const statusCode = err.status || 500;
  const errorMessage = err.message || constants.ERROR_MESSAGES.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: err.toString(),
  });
};

module.exports = errorHandler;
