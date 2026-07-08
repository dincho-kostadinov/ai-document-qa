import { chunkDocument } from "../../domain/documents/chunk-document";
import type { ChunkingOptions } from "../../domain/documents/chunking-options";
import type { DocumentLoadFailure, DocumentLoader } from "../../domain/documents/document-loader.port";
import { EmbeddingGenerationError } from "../../domain/embeddings/embedding-provider.errors";
import type { EmbeddingProvider } from "../../domain/embeddings/embedding-provider.port";
import type { EmbeddedChunk } from "../../domain/embeddings/embedded-chunk";
import type { VectorStore } from "../../domain/search/vector-store.port";

export interface IndexDocumentsUseCaseConfig {
  loader: DocumentLoader;
  embeddings: EmbeddingProvider;
  vectorStore: VectorStore;
  chunkingOptions: ChunkingOptions;
}

export type IndexingFailureReason = "embedding-failed" | "storage-failed";

export interface IndexingFailure {
  readonly documentId: string;
  readonly sourcePath: string;
  readonly reason: IndexingFailureReason;
  readonly message: string;
}

export interface IndexingReport {
  readonly documentsProcessed: number;
  readonly chunksIndexed: number;
  readonly loadFailures: DocumentLoadFailure[];
  readonly indexingFailures: IndexingFailure[];
}

export class IndexDocumentsUseCase {
  constructor(private readonly config: IndexDocumentsUseCaseConfig) {}

  async run(): Promise<IndexingReport> {
    const { loader, embeddings, vectorStore, chunkingOptions } = this.config;

    const loadReport = await loader.loadAll();
    const indexingFailures: IndexingFailure[] = [];
    let chunksIndexed = 0;

    for (const document of loadReport.documents) {
      const chunks = chunkDocument(document, chunkingOptions);

      if (chunks.length === 0) {
        continue;
      }

      try {
        const vectors = await embeddings.embed(chunks.map((chunk) => chunk.text));

        if (vectors.length !== chunks.length) {
          throw new Error(`Expected ${chunks.length} embeddings but received ${vectors.length}`);
        }

        const embeddedChunks: EmbeddedChunk[] = chunks.map((chunk, index) => {
          const embedding = vectors[index];

          if (!embedding) {
            throw new Error(`Missing embedding for chunk ${chunk.id}`);
          }

          return { chunk, embedding };
        });

        await vectorStore.upsertChunks(embeddedChunks);
        chunksIndexed += embeddedChunks.length;
      } catch (error) {
        indexingFailures.push({
          documentId: document.id,
          sourcePath: document.metadata.sourcePath,
          reason: error instanceof EmbeddingGenerationError ? "embedding-failed" : "storage-failed",
          message: error instanceof Error ? error.message : "Failed to index document",
        });
      }
    }

    return {
      documentsProcessed: loadReport.documents.length,
      chunksIndexed,
      loadFailures: loadReport.failures,
      indexingFailures,
    };
  }
}
