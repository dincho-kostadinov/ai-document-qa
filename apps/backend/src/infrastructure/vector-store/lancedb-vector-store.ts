import { connect } from "@lancedb/lancedb";
import type { Connection, Table } from "@lancedb/lancedb";

import type { EmbeddedChunk } from "../../domain/embeddings/embedded-chunk";
import type { EmbeddingVector } from "../../domain/embeddings/embedding-vector";
import type { ScoredChunk } from "../../domain/search/scored-chunk";
import type { SearchOptions } from "../../domain/search/search-options";
import type { VectorStore } from "../../domain/search/vector-store.port";
import { VectorStoreError } from "../../domain/search/vector-store.errors";

import { CHUNKS_TABLE_NAME, fromChunkRow, toChunkRow } from "./lancedb-schema";
import type { ScoredChunkRow } from "./lancedb-schema";

export class LanceDbVectorStore implements VectorStore {
  private connection: Connection | undefined;

  constructor(private readonly storePath: string) {}

  async upsertChunks(chunks: EmbeddedChunk[]): Promise<void> {
    if (chunks.length === 0) {
      return;
    }

    try {
      // LanceDB's row-insert APIs are typed as Record<string, unknown>[]; ChunkRow is a
      // precise, closed shape with no index signature, so it needs an explicit cast here.
      const rows = chunks.map(toChunkRow) as unknown as Record<string, unknown>[];
      const connection = await this.getConnection();
      const table = await this.openTable(connection);

      if (!table) {
        await connection.createTable(CHUNKS_TABLE_NAME, rows);
        return;
      }

      await table.mergeInsert("id").whenMatchedUpdateAll().whenNotMatchedInsertAll().execute(rows);
    } catch (error) {
      throw new VectorStoreError("Failed to upsert chunks into the vector store", { cause: error });
    }
  }

  async search(queryEmbedding: EmbeddingVector, options: SearchOptions): Promise<ScoredChunk[]> {
    try {
      const connection = await this.getConnection();
      const table = await this.openTable(connection);

      if (!table) {
        return [];
      }

      const rows = (await table
        .vectorSearch(queryEmbedding)
        .distanceType("cosine")
        .limit(options.topK)
        .toArray()) as ScoredChunkRow[];

      return rows.map(fromChunkRow).filter((scoredChunk) => scoredChunk.score >= options.minScore);
    } catch (error) {
      throw new VectorStoreError("Failed to search the vector store", { cause: error });
    }
  }

  private async getConnection(): Promise<Connection> {
    if (!this.connection) {
      this.connection = await connect(this.storePath);
    }

    return this.connection;
  }

  private async openTable(connection: Connection): Promise<Table | undefined> {
    const tableNames = await connection.tableNames();

    return tableNames.includes(CHUNKS_TABLE_NAME) ? connection.openTable(CHUNKS_TABLE_NAME) : undefined;
  }
}
