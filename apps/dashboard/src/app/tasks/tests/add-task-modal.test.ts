import { describe, expect, it } from "vitest";
import { nextTaskId } from "../components/add-task-modal";

describe("nextTaskId", () => {
  it("starts the sequence when no ids exist", () => {
    expect(nextTaskId([])).toBe("TASK-1");
  });

  it("continues after the highest numeric suffix", () => {
    expect(nextTaskId(["TASK-1001", "TASK-1005", "TASK-1002"])).toBe(
      "TASK-1006",
    );
  });

  it("ignores ids without a numeric suffix", () => {
    expect(nextTaskId(["draft", "TASK-7"])).toBe("TASK-8");
  });
});
