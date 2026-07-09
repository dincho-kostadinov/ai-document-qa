import { describe, expect, it } from "vitest";

import type { ScoredChunk } from "../search/scored-chunk";

import { buildContext } from "./build-context";

function makeScoredChunk(documentId: string, text: string, score: number): ScoredChunk {
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
    score,
  };
}

describe("buildContext", () => {
  it("assigns 1-based sequential indices in the given order", () => {
    const chunks = [makeScoredChunk("doc-1", "first", 0.9), makeScoredChunk("doc-2", "second", 0.8)];

    const passages = buildContext(chunks);

    expect(passages.map((passage) => passage.index)).toEqual([1, 2]);
    expect(passages.map((passage) => passage.text)).toEqual(["first", "second"]);
  });

  it("carries source metadata from the chunk", () => {
    const [passage] = buildContext([makeScoredChunk("doc-1", "text", 0.9)]);

    expect(passage?.source).toEqual({
      documentId: "doc-1",
      fileName: "doc-1.txt",
      sourcePath: "doc-1.txt",
    });
  });

  it("returns an empty array for no chunks", () => {
    expect(buildContext([])).toEqual([]);
  });

  it("does not deduplicate passages from the same document", () => {
    const chunks = [makeScoredChunk("doc-1", "chunk A", 0.9), makeScoredChunk("doc-1", "chunk B", 0.8)];

    expect(buildContext(chunks)).toHaveLength(2);
  });
});
