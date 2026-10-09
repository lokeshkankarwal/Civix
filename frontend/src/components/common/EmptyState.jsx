import React from "react";
import "./EmptyState.css";
import {
  FaInbox,
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

const iconMap = {
  inbox: FaInbox,
  search: FaSearch,
  warning: FaExclamationTriangle,
  success: FaCheckCircle,
};

const EmptyState = ({
  icon = "inbox",
  title = "No items found",
  message = "There is nothing to display right now.",
  actionLabel,
  onAction,
  testId = "empty-state",
}) => {
  const IconComponent = iconMap[icon] || FaInbox;

  return (
    <div className="civix-empty-state" data-testid={testId}>
      <div className="civix-empty-icon-wrap" aria-hidden="true">
        <IconComponent className="civix-empty-icon" />
      </div>
      <h3 className="civix-empty-title">{title}</h3>
      <p className="civix-empty-message">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="civix-empty-action-btn"
          onClick={onAction}
          data-testid="empty-state-action"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
