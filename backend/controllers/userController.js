const User = require("../models/User");
const Issue = require("../models/Issue");
const uploadtos3 = require("../utils/s3Upload");
const Notification = require("../models/Notification");

const getUserProfile = async (req, res) => {
  try {
    res.set("Cache-Control", "private, max-age=60");
    const userId = req.params.userId;

    // 1. Fetch user profile fields
    const user = await User.findById(userId).select(
      "role _id username email createdAt comments bio profileImage state districtName department",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let reportedIssues = [];
    if (user.role === "user") {
      reportedIssues = await Issue.find({ createdBy: userId }).sort({
        createdAt: -1,
      });
    }

    // 2. Calculate total upvotes from the directly queried issues
    const totalUpvotes = reportedIssues.reduce(
      (sum, issue) => sum + (issue.upvotes?.length || 0),
      0,
    );

    // 3. Send the response
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      joined: user.createdAt,
      issuesReported: reportedIssues.length,
      totalUpvotes: totalUpvotes,
      reportedIssues: reportedIssues,
      comments: user.comments,
      bio: user.bio || "",
      profileImage: user.profileImage,
      state: user.state || null,
      districtName: user.districtName || null,
      department: user.department || null,
    });
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("Received file:", req.file);
    if (req.file) {
      user.profileImage = await uploadtos3(req.file);
    }

    await user.save();
    res.json({ message: "Profile picture updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateUserBio = async (req, res) => {
  try {
    const { bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bio = bio;
    await user.save();

    res.json({ message: "Bio updated successfully", bio: user.bio });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const reReportIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    if (!reason) {
      return res
        .status(400)
        .json({ message: "A reason is required to re-report an issue." });
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found." });
    }

    if (issue.status !== "solved") {
      return res.status(400).json({
        message:
          "Only solved issues can be re-reported. Current status is: " +
          issue.status,
      });
    }

    // Update the status and overwrite the re-report fields with the latest data
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        status: "re-reported",
        reReportReason: reason,
        reReportedAt: new Date(),
        reReportedBy: userId,
      },
      { new: true },
    );

    // Notify assigned worker if present
    if (issue.assignedWorker) {
      await Notification.create({
        user: issue.assignedWorker,
        type: "issue",
        referenceId: issue._id,
        message: `The issue "${issue.title}" has been re-reported by the user. Reason: ${reason}`,
      });
    }

    return res.status(200).json({
      message: "Issue successfully re-reported.",
      issue: updatedIssue,
    });
  } catch (error) {
    console.error("Re-report issue error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateProfilePic,
  updateUserBio,
  reReportIssue,
};
