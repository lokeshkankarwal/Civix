import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmptyState from "./EmptyState";

describe("EmptyState Component", () => {
  test("renders default empty state with default title and message", () => {
    render(<EmptyState />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(
      screen.getByText("There is nothing to display right now.")
    ).toBeInTheDocument();
  });

  test("renders custom title, message, and action button", () => {
    const handleAction = jest.fn();
    render(
      <EmptyState
        title="No issues match your filters"
        message="Try clearing your search terms or selecting another status filter."
        actionLabel="Reset Filters"
        onAction={handleAction}
      />
    );

    expect(screen.getByText("No issues match your filters")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Try clearing your search terms or selecting another status filter."
      )
    ).toBeInTheDocument();

    const actionBtn = screen.getByTestId("empty-state-action");
    expect(actionBtn).toHaveTextContent("Reset Filters");

    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  test("does not render action button when actionLabel is omitted", () => {
    render(<EmptyState title="All caught up!" />);
    expect(screen.queryByTestId("empty-state-action")).not.toBeInTheDocument();
  });
});
