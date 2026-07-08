import type { DocumentMetadata } from "./document-metadata";

export interface DocumentChunk {
  readonly id: string;
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly text: string;
  readonly startOffset: number;
  readonly endOffset: number;
  readonly metadata: DocumentMetadata;
}
