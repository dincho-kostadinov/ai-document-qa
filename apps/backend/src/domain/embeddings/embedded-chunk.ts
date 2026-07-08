import type { DocumentChunk } from "../documents/chunk";
import type { EmbeddingVector } from "./embedding-vector";

export interface EmbeddedChunk {
  readonly chunk: DocumentChunk;
  readonly embedding: EmbeddingVector;
}
