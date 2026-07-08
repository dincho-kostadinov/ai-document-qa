import type { EmbeddedChunk } from "../embeddings/embedded-chunk";
import type { EmbeddingVector } from "../embeddings/embedding-vector";
import type { ScoredChunk } from "./scored-chunk";
import type { SearchOptions } from "./search-options";

export interface VectorStore {
  upsertChunks(chunks: EmbeddedChunk[]): Promise<void>;
  search(queryEmbedding: EmbeddingVector, options: SearchOptions): Promise<ScoredChunk[]>;
}
