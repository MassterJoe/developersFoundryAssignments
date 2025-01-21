// logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Create a logger instance
const logger = createLogger({
  level: 'info', // Default logging level
  format: logFormat,
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: path.join(__dirname, 'logs', 'error.log'), level: 'error' }), // Log errors to file
    new transports.File({ filename: path.join(__dirname, 'logs', 'combined.log') }) // Log all messages to file
  ]
});

module.exports = logger;
