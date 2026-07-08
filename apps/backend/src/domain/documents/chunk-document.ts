import type { ChunkingOptions } from "./chunking-options";
import type { Document } from "./document";
import type { DocumentChunk } from "./chunk";

export function chunkDocument(document: Document, options: ChunkingOptions): DocumentChunk[] {
  const { maxChunkSize, overlap } = options;

  if (maxChunkSize <= 0) {
    throw new Error("maxChunkSize must be greater than 0");
  }

  if (overlap < 0 || overlap >= maxChunkSize) {
    throw new Error("overlap must be between 0 and maxChunkSize (exclusive)");
  }

  const { content } = document;
  const chunks: DocumentChunk[] = [];

  if (content.length === 0) {
    return chunks;
  }

  const step = maxChunkSize - overlap;
  let start = 0;
  let chunkIndex = 0;

  while (start < content.length) {
    const end = Math.min(start + maxChunkSize, content.length);

    chunks.push({
      id: `${document.id}#${chunkIndex}`,
      documentId: document.id,
      chunkIndex,
      text: content.slice(start, end),
      startOffset: start,
      endOffset: end,
      metadata: document.metadata,
    });

    if (end === content.length) {
      break;
    }

    start += step;
    chunkIndex += 1;
  }

  return chunks;
}
