import { describe, expect, it, vi } from "vitest";

import type { EmbeddingProvider } from "../../domain/embeddings/embedding-provider.port";
import type { ScoredChunk } from "../../domain/search/scored-chunk";
import type { VectorStore } from "../../domain/search/vector-store.port";

import { SearchSimilarChunksUseCase } from "./search-similar-chunks.use-case";

describe("SearchSimilarChunksUseCase", () => {
  it("embeds the question and returns the vector store's results", async () => {
    const embeddings: EmbeddingProvider = { embed: vi.fn(async () => [[0.1, 0.2]]) };

    const scoredChunk: ScoredChunk = {
      chunk: {
        id: "doc-1#0",
        documentId: "doc-1",
        chunkIndex: 0,
        text: "chunk text",
        startOffset: 0,
        endOffset: 10,
        metadata: { fileName: "doc-1.txt", sourcePath: "doc-1.txt", extension: ".txt", sizeBytes: 10 },
      },
      score: 0.9,
    };

    const vectorStore: VectorStore = {
      upsertChunks: vi.fn(),
      search: vi.fn(async () => [scoredChunk]),
    };

    const useCase = new SearchSimilarChunksUseCase({
      embeddings,
      vectorStore,
      searchOptions: { topK: 5, minScore: 0.5 },
    });

    const results = await useCase.search("What are the login issues?");

    expect(embeddings.embed).toHaveBeenCalledWith(["What are the login issues?"]);
    expect(vectorStore.search).toHaveBeenCalledWith([0.1, 0.2], { topK: 5, minScore: 0.5 });
    expect(results).toEqual([scoredChunk]);
  });

  it("returns an empty array when the vector store finds nothing", async () => {
    const embeddings: EmbeddingProvider = { embed: vi.fn(async () => [[0.1, 0.2]]) };
    const vectorStore: VectorStore = { upsertChunks: vi.fn(), search: vi.fn(async () => []) };

    const useCase = new SearchSimilarChunksUseCase({
      embeddings,
      vectorStore,
      searchOptions: { topK: 5, minScore: 0.5 },
    });

    await expect(useCase.search("unrelated question")).resolves.toEqual([]);
  });
});
