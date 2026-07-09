import { describe, expect, it } from "vitest";

import { questionRequestSchema } from "./question-request.dto";

describe("questionRequestSchema", () => {
  it("accepts a valid question and trims whitespace", () => {
    const result = questionRequestSchema.safeParse({ question: "  What is this?  " });

    expect(result.success).toBe(true);
    expect(result.success && result.data.question).toBe("What is this?");
  });

  it("rejects a missing question", () => {
    expect(questionRequestSchema.safeParse({}).success).toBe(false);
  });

  it("rejects an empty question", () => {
    expect(questionRequestSchema.safeParse({ question: "" }).success).toBe(false);
  });

  it("rejects a whitespace-only question", () => {
    expect(questionRequestSchema.safeParse({ question: "   " }).success).toBe(false);
  });

  it("rejects a non-string question", () => {
    expect(questionRequestSchema.safeParse({ question: 123 }).success).toBe(false);
  });

  it("rejects a question longer than 1000 characters", () => {
    expect(questionRequestSchema.safeParse({ question: "a".repeat(1001) }).success).toBe(false);
  });

  it("accepts a question exactly 1000 characters long", () => {
    expect(questionRequestSchema.safeParse({ question: "a".repeat(1000) }).success).toBe(true);
  });
});
