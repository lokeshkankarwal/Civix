import React from "react";
import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";

describe("StatusBadge Component", () => {
  test("renders solved badge correctly", () => {
    render(<StatusBadge status="Solved" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveTextContent("Solved");
    expect(badge).toHaveClass("status-solved");
  });

  test("renders in-progress badge with pulse", () => {
    render(<StatusBadge status="in_progress" pulse={true} />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveTextContent("In Progress");
    expect(badge).toHaveClass("with-pulse");
  });

  test("renders unsolved badge for default/reported", () => {
    render(<StatusBadge status="reported" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveTextContent("Unsolved");
    expect(badge).toHaveClass("status-reported");
  });
});
