/**
 * Helper utility functions for formatting civic data across the application.
 */

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

export const truncateText = (text, maxLength = 90) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

export const normalizeStatus = (status) => {
  if (!status) return "pending";
  return status.toString().trim().toLowerCase().replace(/\s+/g, "_");
};

export const getStatusLabel = (status) => {
  const norm = normalizeStatus(status);
  switch (norm) {
    case "solved":
    case "resolved":
      return "Solved";
    case "in_progress":
      return "In Progress";
    case "re-reported":
    case "re_reported":
      return "Re-reported";
    case "unsolved":
    case "pending":
    case "reported":
    default:
      return "Unsolved";
  }
};
