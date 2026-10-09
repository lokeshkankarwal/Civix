import React from "react";
import "./IssueCardSkeleton.css";

const IssueCardSkeleton = ({ count = 6 }) => {
  return (
    <div className="skeleton-grid" data-testid="skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="civix-item-card-skeleton" data-testid="skeleton-card">
          <div className="skeleton-media shimmer" />
          <div className="skeleton-body">
            <div className="skeleton-row-between">
              <div className="skeleton-tag shimmer" />
              <div className="skeleton-date shimmer" />
            </div>
            <div className="skeleton-title shimmer" />
            <div className="skeleton-desc shimmer" />
            <div className="skeleton-desc short shimmer" />
            <div className="skeleton-loc shimmer" />
            <div className="skeleton-footer">
              <div className="skeleton-author shimmer" />
              <div className="skeleton-metrics shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueCardSkeleton;
