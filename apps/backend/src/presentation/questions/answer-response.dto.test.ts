import { describe, expect, it } from "vitest";

import type { Answer } from "../../domain/answers/answer";

import { toAnswerResponseDto } from "./answer-response.dto";

describe("toAnswerResponseDto", () => {
  it("maps a grounded answer with sources", () => {
    const answer: Answer = {
      text: "The answer.",
      grounded: true,
      sources: [{ documentId: "doc-1", fileName: "doc-1.txt", sourcePath: "doc-1.txt" }],
    };

    expect(toAnswerResponseDto(answer)).toEqual({
      answer: "The answer.",
      grounded: true,
      sources: [{ documentId: "doc-1", fileName: "doc-1.txt", sourcePath: "doc-1.txt" }],
    });
  });

  it("maps an ungrounded answer with no sources", () => {
    const answer: Answer = {
      text: "I don't have enough information in the provided documents to answer that.",
      grounded: false,
      sources: [],
    };

    expect(toAnswerResponseDto(answer)).toEqual({
      answer: "I don't have enough information in the provided documents to answer that.",
      grounded: false,
      sources: [],
    });
  });
});
