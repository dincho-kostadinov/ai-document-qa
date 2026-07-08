import { describe, expect, it } from "vitest";

import { chunkDocument } from "./chunk-document";
import type { Document } from "./document";

function makeDocument(content: string): Document {
  return {
    id: "doc-1",
    content,
    metadata: {
      fileName: "doc.txt",
      sourcePath: "doc.txt",
      extension: ".txt",
      sizeBytes: content.length,
    },
  };
}

describe("chunkDocument", () => {
  it("returns a single chunk when content fits within maxChunkSize", () => {
    const document = makeDocument("short content");
    const chunks = chunkDocument(document, { maxChunkSize: 800, overlap: 200 });

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      id: "doc-1#0",
      documentId: "doc-1",
      chunkIndex: 0,
      text: "short content",
      startOffset: 0,
      endOffset: "short content".length,
    });
  });

  it("splits long content into overlapping chunks", () => {
    const content = "a".repeat(1000);
    const document = makeDocument(content);
    const chunks = chunkDocument(document, { maxChunkSize: 800, overlap: 200 });

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toMatchObject({ startOffset: 0, endOffset: 800 });
    expect(chunks[1]).toMatchObject({ startOffset: 600, endOffset: 1000 });
  });

  it("returns no chunks for empty content", () => {
    const document = makeDocument("");

    expect(chunkDocument(document, { maxChunkSize: 800, overlap: 200 })).toEqual([]);
  });

  it("throws when overlap is greater than or equal to maxChunkSize", () => {
    const document = makeDocument("content");

    expect(() => chunkDocument(document, { maxChunkSize: 100, overlap: 100 })).toThrow();
  });

  it("throws when maxChunkSize is not positive", () => {
    const document = makeDocument("content");

    expect(() => chunkDocument(document, { maxChunkSize: 0, overlap: 0 })).toThrow();
  });

  it("assigns each chunk an incrementing index and consistent id", () => {
    const content = "x".repeat(2200);
    const document = makeDocument(content);
    const chunks = chunkDocument(document, { maxChunkSize: 800, overlap: 200 });

    expect(chunks.map((chunk) => chunk.chunkIndex)).toEqual([0, 1, 2, 3]);
    expect(chunks.map((chunk) => chunk.id)).toEqual(["doc-1#0", "doc-1#1", "doc-1#2", "doc-1#3"]);
  });
});
