import { describe, expect, it } from "vitest";

import { EmbeddingGenerationError } from "../../domain/embeddings/embedding-provider.errors";

import type { EmbedContentClient } from "./google-embedding-provider";
import { GoogleEmbeddingProvider } from "./google-embedding-provider";

function makeClient(embedContent: EmbedContentClient["models"]["embedContent"]): EmbedContentClient {
  return { models: { embedContent } };
}

describe("GoogleEmbeddingProvider", () => {
  it("returns embedding vectors for each input text", async () => {
    const client = makeClient(async () => ({
      embeddings: [{ values: [0.1, 0.2] }, { values: [0.3, 0.4] }],
    }));

    const provider = new GoogleEmbeddingProvider(client, "text-embedding-004");

    await expect(provider.embed(["a", "b"])).resolves.toEqual([
      [0.1, 0.2],
      [0.3, 0.4],
    ]);
  });

  it("returns an empty array for empty input without calling the client", async () => {
    let called = false;
    const client = makeClient(async () => {
      called = true;
      return { embeddings: [] };
    });

    const provider = new GoogleEmbeddingProvider(client, "text-embedding-004");

    await expect(provider.embed([])).resolves.toEqual([]);
    expect(called).toBe(false);
  });

  it("wraps client errors in EmbeddingGenerationError", async () => {
    const client = makeClient(async () => {
      throw new Error("network down");
    });

    const provider = new GoogleEmbeddingProvider(client, "text-embedding-004");

    await expect(provider.embed(["a"])).rejects.toThrow(EmbeddingGenerationError);
  });

  it("throws when the response embedding count does not match the request", async () => {
    const client = makeClient(async () => ({ embeddings: [{ values: [0.1] }] }));

    const provider = new GoogleEmbeddingProvider(client, "text-embedding-004");

    await expect(provider.embed(["a", "b"])).rejects.toThrow(EmbeddingGenerationError);
  });

  it("throws when a returned embedding has no values", async () => {
    const client = makeClient(async () => ({ embeddings: [{ values: undefined }] }));

    const provider = new GoogleEmbeddingProvider(client, "text-embedding-004");

    await expect(provider.embed(["a"])).rejects.toThrow(EmbeddingGenerationError);
  });
});
