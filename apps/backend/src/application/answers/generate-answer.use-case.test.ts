import { describe, expect, it, vi } from "vitest";

import type { AnswerGenerator } from "../../domain/answers/answer-generator.port";
import type { GeneratedAnswer } from "../../domain/answers/generated-answer";
import type { ScoredChunk } from "../../domain/search/scored-chunk";
import { logger } from "../../infrastructure/logging/logger";

import { GenerateAnswerUseCase } from "./generate-answer.use-case";

function makeScoredChunk(documentId: string, text: string): ScoredChunk {
  return {
    chunk: {
      id: `${documentId}#0`,
      documentId,
      chunkIndex: 0,
      text,
      startOffset: 0,
      endOffset: text.length,
      metadata: {
        fileName: `${documentId}.txt`,
        sourcePath: `${documentId}.txt`,
        extension: ".txt",
        sizeBytes: text.length,
      },
    },
    score: 0.9,
  };
}

function makeGenerator(result: GeneratedAnswer): AnswerGenerator {
  return { generate: vi.fn(async () => result) };
}

describe("GenerateAnswerUseCase", () => {
  it("returns the canned no-context answer without calling the generator when there are no chunks", async () => {
    const generator = makeGenerator({ grounded: true, answer: "unused", citations: [] });
    const useCase = new GenerateAnswerUseCase({ generator });

    const answer = await useCase.generate("question", []);

    expect(answer.grounded).toBe(false);
    expect(answer.sources).toEqual([]);
    expect(generator.generate).not.toHaveBeenCalled();
  });

  it("returns a grounded answer with deduplicated sources from cited chunks", async () => {
    const chunks = [
      makeScoredChunk("doc-1", "chunk A"),
      makeScoredChunk("doc-1", "chunk B"),
      makeScoredChunk("doc-2", "chunk C"),
    ];

    const generator = makeGenerator({ grounded: true, answer: "The answer.", citations: [1, 2, 3] });
    const useCase = new GenerateAnswerUseCase({ generator });

    const answer = await useCase.generate("question", chunks);

    expect(answer.grounded).toBe(true);
    expect(answer.text).toBe("The answer.");
    expect(answer.sources.map((source) => source.documentId)).toEqual(["doc-1", "doc-2"]);
  });

  it("returns an ungrounded answer with no sources when the model reports grounded: false", async () => {
    const chunks = [makeScoredChunk("doc-1", "chunk A")];
    const generator = makeGenerator({ grounded: false, answer: "I don't know.", citations: [1] });
    const useCase = new GenerateAnswerUseCase({ generator });

    const answer = await useCase.generate("question", chunks);

    expect(answer.grounded).toBe(false);
    expect(answer.sources).toEqual([]);
  });

  it("drops and logs a citation index that has no matching passage", async () => {
    const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});
    const chunks = [makeScoredChunk("doc-1", "chunk A")];
    const generator = makeGenerator({ grounded: true, answer: "The answer.", citations: [1, 99] });
    const useCase = new GenerateAnswerUseCase({ generator });

    const answer = await useCase.generate("question", chunks);

    expect(answer.sources).toEqual([{ documentId: "doc-1", fileName: "doc-1.txt", sourcePath: "doc-1.txt" }]);
    expect(warnSpy).toHaveBeenCalledWith(expect.objectContaining({ citation: 99 }), expect.any(String));

    warnSpy.mockRestore();
  });

  it("propagates errors from the generator", async () => {
    const generator: AnswerGenerator = {
      generate: vi.fn(async () => {
        throw new Error("boom");
      }),
    };

    const useCase = new GenerateAnswerUseCase({ generator });

    await expect(useCase.generate("question", [makeScoredChunk("doc-1", "chunk A")])).rejects.toThrow("boom");
  });
});
