const winston = require("winston");
// Create a logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "../combined.log" }),
    new winston.transports.Console(),
  ],
});

// Handle uncaught exceptions
process.on("uncaughtException", (ex) => {
  logger.error(ex.message, ex);
  console.log(ex.message, ex);
  return ex;
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (ex) => {
  throw ex;
});
