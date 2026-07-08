import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { EmbeddedChunk } from "../../domain/embeddings/embedded-chunk";

import { LanceDbVectorStore } from "./lancedb-vector-store";

function makeEmbeddedChunk(id: string, documentId: string, vector: number[]): EmbeddedChunk {
  return {
    chunk: {
      id,
      documentId,
      chunkIndex: 0,
      text: "chunk text",
      startOffset: 0,
      endOffset: 10,
      metadata: {
        fileName: `${documentId}.txt`,
        sourcePath: `${documentId}.txt`,
        extension: ".txt",
        sizeBytes: 10,
      },
    },
    embedding: vector,
  };
}

describe("LanceDbVectorStore", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "lancedb-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("returns an empty array when searching before anything has been indexed", async () => {
    const store = new LanceDbVectorStore(dir);

    await expect(store.search([1, 0, 0], { topK: 5, minScore: 0 })).resolves.toEqual([]);
  });

  it("stores and retrieves chunks by similarity", async () => {
    const store = new LanceDbVectorStore(dir);

    await store.upsertChunks([
      makeEmbeddedChunk("doc-1#0", "doc-1", [1, 0, 0]),
      makeEmbeddedChunk("doc-2#0", "doc-2", [0, 1, 0]),
    ]);

    const results = await store.search([1, 0, 0], { topK: 5, minScore: 0 });

    expect(results[0]?.chunk.id).toBe("doc-1#0");
    expect(results[0]?.score).toBeGreaterThan(0.9);
  });

  it("filters out results below minScore", async () => {
    const store = new LanceDbVectorStore(dir);

    await store.upsertChunks([
      makeEmbeddedChunk("doc-1#0", "doc-1", [1, 0, 0]),
      makeEmbeddedChunk("doc-2#0", "doc-2", [-1, 0, 0]),
    ]);

    const results = await store.search([1, 0, 0], { topK: 5, minScore: 0.5 });

    expect(results.map((result) => result.chunk.id)).toEqual(["doc-1#0"]);
  });

  it("replaces a chunk's vector on re-upsert instead of duplicating rows", async () => {
    const store = new LanceDbVectorStore(dir);

    await store.upsertChunks([makeEmbeddedChunk("doc-1#0", "doc-1", [1, 0, 0])]);
    await store.upsertChunks([makeEmbeddedChunk("doc-1#0", "doc-1", [0, 1, 0])]);

    const results = await store.search([0, 1, 0], { topK: 10, minScore: 0 });

    expect(results).toHaveLength(1);
    expect(results[0]?.score).toBeGreaterThan(0.9);
  });

  it("respects topK", async () => {
    const store = new LanceDbVectorStore(dir);

    await store.upsertChunks([
      makeEmbeddedChunk("doc-1#0", "doc-1", [1, 0, 0]),
      makeEmbeddedChunk("doc-2#0", "doc-2", [0.9, 0.1, 0]),
      makeEmbeddedChunk("doc-3#0", "doc-3", [0.8, 0.2, 0]),
    ]);

    const results = await store.search([1, 0, 0], { topK: 1, minScore: 0 });

    expect(results).toHaveLength(1);
  });
});
