const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { issueCreateLimiter } = require("../middleware/rateLimiter");
const upload = require("../utils/upload");
const {
  createIssue,
  getAllIssues,
  getIssueById,
  addComment,
  toggleUpvote,
} = require("../controllers/issueController");

// Public routes

// Protected routes
router.use(protect);
router.get("/all", getAllIssues);
router.get("/:id", getIssueById);
router.post("/", issueCreateLimiter, upload.array("images"), createIssue);
router.post("/:id/comments", addComment);
router.post("/:id/upvote", protect, toggleUpvote);

module.exports = router;
