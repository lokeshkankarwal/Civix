import React from "react";
import { FaCheck, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { normalizeStatus } from "../../utils/formatters";
import "./ProgressStepper.css";

const STEPS = [
  { id: 1, key: "reported", label: "Reported", desc: "Submitted by citizen" },
  { id: 2, key: "under_review", label: "Acknowledged", desc: "Assigned to department" },
  { id: 3, key: "in_progress", label: "In Progress", desc: "Ground work underway" },
  { id: 4, key: "resolved", label: "Resolved", desc: "Fix verified by civic team" },
];

const ProgressStepper = ({ status }) => {
  const norm = normalizeStatus(status);

  // Map status to current active step index (1-based)
  let activeStep = 1;
  if (norm === "solved" || norm === "resolved") {
    activeStep = 4;
  } else if (norm === "in_progress") {
    activeStep = 3;
  } else if (norm === "re-reported" || norm === "re_reported") {
    activeStep = 2;
  } else {
    activeStep = 1;
  }

  return (
    <div className="stepper-card" data-testid="progress-stepper">
      <div className="stepper-header">
        <h4 className="stepper-title">Resolution Timeline</h4>
        <span className={`stepper-badge ${norm}`}>
          {activeStep === 4 ? "Issue Resolved" : "Under Action"}
        </span>
      </div>

      <div className="stepper-track">
        {STEPS.map((step, idx) => {
          const isDone = step.id < activeStep;
          const isCurrent = step.id === activeStep;
          const isPending = step.id > activeStep;

          return (
            <div
              key={step.id}
              className={`stepper-step ${isDone ? "step-done" : ""} ${
                isCurrent ? "step-current" : ""
              } ${isPending ? "step-pending" : ""}`}
              data-testid={`step-${step.key}`}
            >
              <div className="step-indicator">
                {isDone ? (
                  <FaCheck className="step-icon" />
                ) : isCurrent ? (
                  <span className="step-current-dot" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              <div className="step-content">
                <span className="step-label">{step.label}</span>
                <span className="step-desc">{step.desc}</span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`step-connector ${
                    step.id < activeStep ? "connector-done" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
