import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AnswerResponseDto } from "../../lib/api/types";

import { AnswerResult } from "./AnswerResult";

describe("AnswerResult", () => {
  it("renders the answer text and only the source file names", () => {
    const answer: AnswerResponseDto = {
      answer: "The answer.",
      grounded: true,
      sources: [
        { documentId: "doc-1", fileName: "doc-1.txt", sourcePath: "docs/doc-1.txt" },
        { documentId: "doc-2", fileName: "doc-2.txt", sourcePath: "docs/doc-2.txt" },
      ],
    };

    render(<AnswerResult answer={answer} />);

    expect(screen.getByText("The answer.")).toBeInTheDocument();
    expect(screen.getByText("doc-1.txt")).toBeInTheDocument();
    expect(screen.getByText("doc-2.txt")).toBeInTheDocument();
    expect(screen.queryByText("docs/doc-1.txt")).not.toBeInTheDocument();
  });

  it("renders without a sources section when there are no sources", () => {
    const answer: AnswerResponseDto = { answer: "I don't know.", grounded: false, sources: [] };

    render(<AnswerResult answer={answer} />);

    expect(screen.getByText("I don't know.")).toBeInTheDocument();
    expect(screen.queryByText("Sources")).not.toBeInTheDocument();
  });
});
