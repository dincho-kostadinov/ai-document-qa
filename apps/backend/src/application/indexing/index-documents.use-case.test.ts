import { describe, expect, it, vi } from "vitest";

import type { Document } from "../../domain/documents/document";
import type { DocumentLoader, DocumentLoadReport } from "../../domain/documents/document-loader.port";
import { EmbeddingGenerationError } from "../../domain/embeddings/embedding-provider.errors";
import type { EmbeddingProvider } from "../../domain/embeddings/embedding-provider.port";
import type { VectorStore } from "../../domain/search/vector-store.port";

import { IndexDocumentsUseCase } from "./index-documents.use-case";

function makeDocument(id: string, content: string): Document {
  return {
    id,
    content,
    metadata: {
      fileName: `${id}.txt`,
      sourcePath: `${id}.txt`,
      extension: ".txt",
      sizeBytes: content.length,
    },
  };
}

function makeLoader(documents: Document[]): DocumentLoader {
  const report: DocumentLoadReport = { documents, failures: [] };
  return { loadAll: async () => report };
}

describe("IndexDocumentsUseCase", () => {
  it("chunks, embeds, and stores every loaded document", async () => {
    const documents = [makeDocument("doc-1", "a".repeat(100))];
    const loader = makeLoader(documents);

    const embeddings: EmbeddingProvider = {
      embed: vi.fn(async (texts: string[]) => texts.map(() => [0.1, 0.2])),
    };

    const upsertChunks = vi.fn(async () => {});
    const vectorStore: VectorStore = { upsertChunks, search: vi.fn() };

    const useCase = new IndexDocumentsUseCase({
      loader,
      embeddings,
      vectorStore,
      chunkingOptions: { maxChunkSize: 800, overlap: 200 },
    });

    const report = await useCase.run();

    expect(report.documentsProcessed).toBe(1);
    expect(report.chunksIndexed).toBe(1);
    expect(report.indexingFailures).toEqual([]);
    expect(upsertChunks).toHaveBeenCalledTimes(1);
  });

  it("records a document as failed when embedding generation fails, without aborting the run", async () => {
    const documents = [makeDocument("doc-1", "content"), makeDocument("doc-2", "more content")];
    const loader = makeLoader(documents);

    let callCount = 0;
    const embeddings: EmbeddingProvider = {
      embed: vi.fn(async (texts: string[]) => {
        callCount += 1;

        if (callCount === 1) {
          throw new EmbeddingGenerationError("boom");
        }

        return texts.map(() => [0.1, 0.2]);
      }),
    };

    const vectorStore: VectorStore = {
      upsertChunks: vi.fn(async () => {}),
      search: vi.fn(),
    };

    const useCase = new IndexDocumentsUseCase({
      loader,
      embeddings,
      vectorStore,
      chunkingOptions: { maxChunkSize: 800, overlap: 200 },
    });

    const report = await useCase.run();

    expect(report.documentsProcessed).toBe(2);
    expect(report.indexingFailures).toEqual([
      { documentId: "doc-1", sourcePath: "doc-1.txt", reason: "embedding-failed", message: "boom" },
    ]);
    expect(report.chunksIndexed).toBe(1);
  });

  it("propagates document load failures in the report without processing them", async () => {
    const loader: DocumentLoader = {
      loadAll: async () => ({
        documents: [],
        failures: [{ sourcePath: "bad.pdf", reason: "unsupported-type", message: "no extractor" }],
      }),
    };

    const embeddings: EmbeddingProvider = { embed: vi.fn(async () => []) };
    const vectorStore: VectorStore = { upsertChunks: vi.fn(async () => {}), search: vi.fn() };

    const useCase = new IndexDocumentsUseCase({
      loader,
      embeddings,
      vectorStore,
      chunkingOptions: { maxChunkSize: 800, overlap: 200 },
    });

    const report = await useCase.run();

    expect(report.documentsProcessed).toBe(0);
    expect(report.loadFailures).toHaveLength(1);
    expect(vectorStore.upsertChunks).not.toHaveBeenCalled();
  });
});
