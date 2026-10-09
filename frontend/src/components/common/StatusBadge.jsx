import React from "react";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { normalizeStatus, getStatusLabel } from "../../utils/formatters";
import "./StatusBadge.css";

const StatusBadge = ({ status, size = "md", pulse = false }) => {
  const norm = normalizeStatus(status);
  const label = getStatusLabel(status);

  const getIcon = () => {
    switch (norm) {
      case "solved":
      case "resolved":
        return <FaCheckCircle className="status-badge-icon" />;
      case "in_progress":
        return <FaClock className="status-badge-icon" />;
      case "re-reported":
      case "re_reported":
        return <FaSyncAlt className="status-badge-icon" />;
      default:
        return <FaExclamationCircle className="status-badge-icon" />;
    }
  };

  return (
    <span
      className={`status-badge-chip status-${norm} size-${size} ${
        pulse ? "with-pulse" : ""
      }`}
      data-testid="status-badge"
    >
      {pulse && <span className="status-pulse-dot" />}
      {getIcon()}
      <span className="status-text">{label}</span>
    </span>
  );
};

export default StatusBadge;
