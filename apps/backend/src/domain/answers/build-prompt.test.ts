import { describe, expect, it } from "vitest";

import type { ContextPassage } from "./context-passage";

import { buildPrompt } from "./build-prompt";

describe("buildPrompt", () => {
  it("includes the question and every passage with its citation number and source", () => {
    const passages: ContextPassage[] = [
      {
        index: 1,
        text: "passage one",
        source: { documentId: "doc-1", fileName: "doc-1.txt", sourcePath: "doc-1.txt" },
      },
      {
        index: 2,
        text: "passage two",
        source: { documentId: "doc-2", fileName: "doc-2.txt", sourcePath: "doc-2.txt" },
      },
    ];

    const prompt = buildPrompt("What happened?", passages);

    expect(prompt).toContain("What happened?");
    expect(prompt).toContain("[1]");
    expect(prompt).toContain("doc-1.txt");
    expect(prompt).toContain("passage one");
    expect(prompt).toContain("[2]");
    expect(prompt).toContain("doc-2.txt");
    expect(prompt).toContain("passage two");
  });

  it("does not include grounding/system instructions (system-prompt.ts is the single source of truth)", () => {
    const prompt = buildPrompt("question", []);

    expect(prompt.toLowerCase()).not.toContain("grounded");
    expect(prompt.toLowerCase()).not.toContain("own knowledge");
  });
});
