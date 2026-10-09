import {
  formatDate,
  formatTimeAgo,
  truncateText,
  normalizeStatus,
  getStatusLabel,
} from "./formatters";

describe("Civic Formatters Utilities", () => {
  test("formatDate handles valid and invalid dates", () => {
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate("invalid-date")).toBe("Invalid Date");
    const formatted = formatDate("2026-08-03T10:00:00Z");
    expect(formatted).toContain("2026");
  });

  test("formatTimeAgo formats recent timestamps", () => {
    expect(formatTimeAgo(null)).toBe("");
    const justNow = new Date().toISOString();
    expect(formatTimeAgo(justNow)).toBe("Just now");
  });

  test("truncateText truncates longer strings with ellipsis", () => {
    expect(truncateText("Short text", 50)).toBe("Short text");
    expect(truncateText("A very long sentence that needs truncation", 10)).toBe("A very lon...");
    expect(truncateText(null)).toBe("");
  });

  test("normalizeStatus normalizes casing and spacing", () => {
    expect(normalizeStatus("IN PROGRESS")).toBe("in_progress");
    expect(normalizeStatus("Re Reported")).toBe("re_reported");
    expect(normalizeStatus(null)).toBe("pending");
  });

  test("getStatusLabel returns user-friendly label", () => {
    expect(getStatusLabel("solved")).toBe("Solved");
    expect(getStatusLabel("in_progress")).toBe("In Progress");
    expect(getStatusLabel("re_reported")).toBe("Re-reported");
    expect(getStatusLabel("unsolved")).toBe("Unsolved");
    expect(getStatusLabel("pending")).toBe("Unsolved");
  });
});
