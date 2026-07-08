import type { EmbeddingVector } from "./embedding-vector";

export interface EmbeddingProvider {
  embed(texts: string[]): Promise<EmbeddingVector[]>;
}
