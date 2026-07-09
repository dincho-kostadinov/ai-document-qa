import request from "supertest";
import { describe, expect, it } from "vitest";

import { GenerateAnswerUseCase } from "../../application/answers/generate-answer.use-case";
import { SearchSimilarChunksUseCase } from "../../application/search/search-similar-chunks.use-case";
import { AnswerGenerationError } from "../../domain/answers/answer-generator.errors";
import type { AnswerGenerator } from "../../domain/answers/answer-generator.port";
import type { GeneratedAnswer } from "../../domain/answers/generated-answer";
import type { EmbeddingProvider } from "../../domain/embeddings/embedding-provider.port";
import type { ScoredChunk } from "../../domain/search/scored-chunk";
import { VectorStoreError } from "../../domain/search/vector-store.errors";
import type { VectorStore } from "../../domain/search/vector-store.port";
import type { Env } from "../../infrastructure/config/env";

import { createApp } from "../../app";

const testEnv: Env = {
  NODE_ENV: "test",
  PORT: 4000,
  CORS_ORIGIN: "http://localhost:3000",
  GEMINI_API_KEY: "test-key",
  GEMINI_MODEL: "gemini-2.5-flash",
  GOOGLE_EMBEDDINGS_MODEL: "text-embedding-004",
  VECTOR_STORE_PATH: "./data/vectors",
  DOCUMENTS_PATH: "./data/documents",
  CHUNK_SIZE: 800,
  CHUNK_OVERLAP: 200,
  SIMILARITY_TOP_K: 5,
  SIMILARITY_THRESHOLD: 0.5,
  GEMINI_TEMPERATURE: 0,
};

function makeScoredChunk(): ScoredChunk {
  return {
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
}

function buildApp(options: {
  searchResult?: ScoredChunk[];
  searchError?: Error;
  generatedAnswer?: GeneratedAnswer;
  generateError?: Error;
}) {
  const embeddings: EmbeddingProvider = { embed: async (texts) => texts.map(() => [0.1, 0.2]) };

  const vectorStore: VectorStore = {
    upsertChunks: async () => {},
    search: async () => {
      if (options.searchError) {
        throw options.searchError;
      }
      return options.searchResult ?? [];
    },
  };

  const generator: AnswerGenerator = {
    generate: async () => {
      if (options.generateError) {
        throw options.generateError;
      }
      return options.generatedAnswer ?? { grounded: true, answer: "The answer.", citations: [1] };
    },
  };

  const searchSimilarChunks = new SearchSimilarChunksUseCase({
    embeddings,
    vectorStore,
    searchOptions: { topK: 5, minScore: 0 },
  });
  const generateAnswer = new GenerateAnswerUseCase({ generator });

  return createApp(testEnv, { searchSimilarChunks, generateAnswer });
}

describe("POST /api/questions", () => {
  it("returns 200 with the mapped answer for a valid question", async () => {
    const app = buildApp({
      searchResult: [makeScoredChunk()],
      generatedAnswer: { grounded: true, answer: "The answer.", citations: [1] },
    });

    const response = await request(app).post("/api/questions").send({ question: "What happened?" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      answer: "The answer.",
      grounded: true,
      sources: [{ documentId: "doc-1", fileName: "doc-1.txt", sourcePath: "doc-1.txt" }],
    });
  });

  it("returns 400 for an empty question", async () => {
    const app = buildApp({});

    const response = await request(app).post("/api/questions").send({ question: "" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 for a missing question field", async () => {
    const app = buildApp({});

    const response = await request(app).post("/api/questions").send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 500 when vector search fails", async () => {
    const app = buildApp({ searchError: new VectorStoreError("store unavailable") });

    const response = await request(app).post("/api/questions").send({ question: "What happened?" });

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe("INTERNAL_ERROR");
  });

  it("returns 500 when answer generation fails", async () => {
    const app = buildApp({
      searchResult: [makeScoredChunk()],
      generateError: new AnswerGenerationError("generation failed"),
    });

    const response = await request(app).post("/api/questions").send({ question: "What happened?" });

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe("INTERNAL_ERROR");
  });

  it("returns a no-context answer with no chunks found, without calling the generator", async () => {
    const app = buildApp({ searchResult: [] });

    const response = await request(app).post("/api/questions").send({ question: "What happened?" });

    expect(response.status).toBe(200);
    expect(response.body.grounded).toBe(false);
    expect(response.body.sources).toEqual([]);
  });
});
