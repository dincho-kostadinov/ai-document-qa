import type { DocumentChunk } from "../documents/chunk";

export interface ScoredChunk {
  readonly chunk: DocumentChunk;
  readonly score: number;
}
