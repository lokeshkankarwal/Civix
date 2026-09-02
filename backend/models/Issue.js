const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    images: [String],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
      address: String,
    },
    districtCode: String,
    state: String,
    districtName: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "unsolved" },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: Date,
      },
    ],
    department: String,
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedAt: Date,
    solvedAt: Date,
    reReportReason: String,
    reReportedAt: Date,
    reReportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

issueSchema.index({ location: "2dsphere" });

// Added for common worker queries (e.g., finding assigned & unsolved/solved issues)
issueSchema.index({ assignedWorker: 1, status: 1 });

// Added for finding all issues reported by a specific user
issueSchema.index({ createdBy: 1 });

// Added for admin queries filtering issues by their district and department
issueSchema.index({ state: 1, districtName: 1, department: 1 });

// Added for the auto-assign function that looks for unsolved issues in a district
issueSchema.index({ state: 1, districtName: 1, status: 1 });

module.exports = mongoose.model("Issue", issueSchema);
