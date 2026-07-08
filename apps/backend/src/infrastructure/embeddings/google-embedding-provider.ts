import { EmbeddingGenerationError } from "../../domain/embeddings/embedding-provider.errors";
import type { EmbeddingProvider } from "../../domain/embeddings/embedding-provider.port";
import type { EmbeddingVector } from "../../domain/embeddings/embedding-vector";

export interface EmbedContentClient {
  models: {
    embedContent(params: { model: string; contents: string[] }): Promise<{
      embeddings?: Array<{ values?: number[] }>;
    }>;
  };
}

export class GoogleEmbeddingProvider implements EmbeddingProvider {
  constructor(
    private readonly client: EmbedContentClient,
    private readonly model: string,
  ) {}

  async embed(texts: string[]): Promise<EmbeddingVector[]> {
    if (texts.length === 0) {
      return [];
    }

    try {
      const response = await this.client.models.embedContent({
        model: this.model,
        contents: texts,
      });

      const embeddings = response.embeddings ?? [];

      if (embeddings.length !== texts.length) {
        throw new Error(`Expected ${texts.length} embeddings, received ${embeddings.length}`);
      }

      return embeddings.map((embedding, index) => {
        if (!embedding.values) {
          throw new Error(`Missing embedding values for input at index ${index}`);
        }

        return embedding.values;
      });
    } catch (error) {
      throw new EmbeddingGenerationError("Failed to generate embeddings", { cause: error });
    }
  }
}
