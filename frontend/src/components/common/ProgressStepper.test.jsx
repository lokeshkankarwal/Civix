import React from "react";
import { render, screen } from "@testing-library/react";
import ProgressStepper from "./ProgressStepper";

describe("ProgressStepper Component", () => {
  test("renders all 4 steps", () => {
    render(<ProgressStepper status="reported" />);
    expect(screen.getByTestId("progress-stepper")).toBeInTheDocument();
    expect(screen.getByTestId("step-reported")).toBeInTheDocument();
    expect(screen.getByTestId("step-under_review")).toBeInTheDocument();
    expect(screen.getByTestId("step-in_progress")).toBeInTheDocument();
    expect(screen.getByTestId("step-resolved")).toBeInTheDocument();
  });

  test("marks all steps done when status is solved", () => {
    render(<ProgressStepper status="solved" />);
    expect(screen.getByText("Issue Resolved")).toBeInTheDocument();
  });

  test("highlights in progress correctly", () => {
    render(<ProgressStepper status="in_progress" />);
    const inProgressStep = screen.getByTestId("step-in_progress");
    expect(inProgressStep).toHaveClass("step-current");
  });
});
