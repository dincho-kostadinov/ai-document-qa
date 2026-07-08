import type { EmbeddedChunk } from "../../domain/embeddings/embedded-chunk";
import type { ScoredChunk } from "../../domain/search/scored-chunk";

export const CHUNKS_TABLE_NAME = "chunks";

export interface ChunkRow {
  id: string;
  documentId: string;
  chunkIndex: number;
  text: string;
  startOffset: number;
  endOffset: number;
  fileName: string;
  sourcePath: string;
  extension: string;
  sizeBytes: number;
  vector: number[];
}

export interface ScoredChunkRow extends ChunkRow {
  _distance: number;
}

export function toChunkRow(embeddedChunk: EmbeddedChunk): ChunkRow {
  const { chunk, embedding } = embeddedChunk;

  return {
    id: chunk.id,
    documentId: chunk.documentId,
    chunkIndex: chunk.chunkIndex,
    text: chunk.text,
    startOffset: chunk.startOffset,
    endOffset: chunk.endOffset,
    fileName: chunk.metadata.fileName,
    sourcePath: chunk.metadata.sourcePath,
    extension: chunk.metadata.extension,
    sizeBytes: chunk.metadata.sizeBytes,
    vector: embedding,
  };
}

export function fromChunkRow(row: ScoredChunkRow): ScoredChunk {
  return {
    chunk: {
      id: row.id,
      documentId: row.documentId,
      chunkIndex: row.chunkIndex,
      text: row.text,
      startOffset: row.startOffset,
      endOffset: row.endOffset,
      metadata: {
        fileName: row.fileName,
        sourcePath: row.sourcePath,
        extension: row.extension,
        sizeBytes: row.sizeBytes,
      },
    },
    score: 1 - row._distance,
  };
}
