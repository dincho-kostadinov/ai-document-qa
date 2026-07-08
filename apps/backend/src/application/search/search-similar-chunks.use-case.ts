import type { EmbeddingProvider } from "../../domain/embeddings/embedding-provider.port";
import type { ScoredChunk } from "../../domain/search/scored-chunk";
import type { SearchOptions } from "../../domain/search/search-options";
import type { VectorStore } from "../../domain/search/vector-store.port";

export interface SearchSimilarChunksUseCaseConfig {
  embeddings: EmbeddingProvider;
  vectorStore: VectorStore;
  searchOptions: SearchOptions;
}

export class SearchSimilarChunksUseCase {
  constructor(private readonly config: SearchSimilarChunksUseCaseConfig) {}

  async search(question: string): Promise<ScoredChunk[]> {
    const { embeddings, vectorStore, searchOptions } = this.config;

    const [queryEmbedding] = await embeddings.embed([question]);

    if (!queryEmbedding) {
      throw new Error("Failed to generate an embedding for the query");
    }

    return vectorStore.search(queryEmbedding, searchOptions);
  }
}
