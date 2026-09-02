const rateLimit = require("express-rate-limit");

// Global Limiter: Applied to all API endpoints (100 requests per 15 mins)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Auth Limiter: Protects login, register, password reset against brute force (10 requests per 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
});

// Issue Creation Limiter: Prevents spamming new issue reports (10 submissions per hour)
const issueCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Issue submission limit reached for this hour, please try again later.",
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
  issueCreateLimiter,
};
