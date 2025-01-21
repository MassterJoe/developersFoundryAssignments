const logger = require('../config/logger');

// Middleware for logging HTTP requests
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
};

// Middleware for handling errors
const errorLogger = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`);
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = { requestLogger, errorLogger };
