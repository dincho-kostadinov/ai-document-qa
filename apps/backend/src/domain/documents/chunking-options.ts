export interface ChunkingOptions {
  readonly maxChunkSize: number;
  readonly overlap: number;
}

export const DEFAULT_CHUNKING_OPTIONS: ChunkingOptions = {
  maxChunkSize: 800,
  overlap: 200,
};
