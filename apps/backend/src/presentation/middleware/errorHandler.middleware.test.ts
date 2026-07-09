import type { Request, Response } from "express";
import { z } from "zod";
import { describe, expect, it, vi } from "vitest";

import { AnswerGenerationError } from "../../domain/answers/answer-generator.errors";
import { EmbeddingGenerationError } from "../../domain/embeddings/embedding-provider.errors";
import { VectorStoreError } from "../../domain/search/vector-store.errors";

import { errorHandler } from "./errorHandler.middleware";

function makeRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };

  return res as unknown as Response;
}

describe("errorHandler", () => {
  it("returns 400 with VALIDATION_ERROR for a ZodError", () => {
    const schema = z.object({ question: z.string().min(1) });
    const result = schema.safeParse({ question: "" });
    const res = makeRes();

    expect(result.success).toBe(false);

    if (!result.success) {
      errorHandler(result.error, {} as Request, res, vi.fn());
    }

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: expect.any(String), code: "VALIDATION_ERROR" },
    });
  });

  it("returns 500 with INTERNAL_ERROR for an EmbeddingGenerationError", () => {
    const res = makeRes();

    errorHandler(new EmbeddingGenerationError("embedding failed"), {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: expect.any(String), code: "INTERNAL_ERROR" },
    });
  });

  it("returns 500 with INTERNAL_ERROR for a VectorStoreError", () => {
    const res = makeRes();

    errorHandler(new VectorStoreError("store failed"), {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: expect.any(String), code: "INTERNAL_ERROR" },
    });
  });

  it("returns 500 with INTERNAL_ERROR for an AnswerGenerationError", () => {
    const res = makeRes();

    errorHandler(new AnswerGenerationError("generation failed"), {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: expect.any(String), code: "INTERNAL_ERROR" },
    });
  });

  it("returns 500 with a generic message for an unexpected error", () => {
    const res = makeRes();

    errorHandler(new Error("boom"), {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: "boom", code: "INTERNAL_ERROR" },
    });
  });
});
