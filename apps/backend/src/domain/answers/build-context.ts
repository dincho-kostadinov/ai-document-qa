import type { ScoredChunk } from "../search/scored-chunk";
import type { ContextPassage } from "./context-passage";

export function buildContext(chunks: ScoredChunk[]): ContextPassage[] {
  return chunks.map((scoredChunk, index) => ({
    index: index + 1,
    text: scoredChunk.chunk.text,
    source: {
      documentId: scoredChunk.chunk.documentId,
      fileName: scoredChunk.chunk.metadata.fileName,
      sourcePath: scoredChunk.chunk.metadata.sourcePath,
    },
  }));
}
