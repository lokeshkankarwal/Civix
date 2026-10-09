import React from "react";
import { render, screen } from "@testing-library/react";
import IssueCardSkeleton from "./IssueCardSkeleton";

describe("IssueCardSkeleton Component", () => {
  test("renders the default number of skeleton cards", () => {
    render(<IssueCardSkeleton count={4} />);
    const cards = screen.getAllByTestId("skeleton-card");
    expect(cards).toHaveLength(4);
  });

  test("renders skeleton grid container", () => {
    render(<IssueCardSkeleton />);
    expect(screen.getByTestId("skeleton-grid")).toBeInTheDocument();
  });
});
