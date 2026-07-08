import { readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

import type { Document } from "../../domain/documents/document";
import { computeDocumentId } from "../../domain/documents/document-id";
import type {
  DocumentLoadFailure,
  DocumentLoadReport,
  DocumentLoader,
} from "../../domain/documents/document-loader.port";

import type { TextExtractorRegistry } from "./extractors/text-extractor.registry";

export interface FileSystemDocumentLoaderConfig {
  documentsPath: string;
  extractors: TextExtractorRegistry;
}

export class FileSystemDocumentLoader implements DocumentLoader {
  constructor(private readonly config: FileSystemDocumentLoaderConfig) {}

  async loadAll(): Promise<DocumentLoadReport> {
    const { documentsPath, extractors } = this.config;

    const entries = await readdir(documentsPath, { recursive: true, withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile());

    const documents: Document[] = [];
    const failures: DocumentLoadFailure[] = [];

    for (const entry of files) {
      const parentPath = entry.parentPath ?? entry.path;
      const absolutePath = join(parentPath, entry.name);
      const sourcePath = relative(documentsPath, absolutePath).split("\\").join("/");
      const extension = extname(entry.name);

      const extractor = extractors.resolve(extension);

      if (!extractor) {
        failures.push({
          sourcePath,
          reason: "unsupported-type",
          message: `No extractor registered for extension "${extension}"`,
        });
        continue;
      }

      let sizeBytes: number;

      try {
        sizeBytes = (await stat(absolutePath)).size;
      } catch (error) {
        failures.push({
          sourcePath,
          reason: "read-error",
          message: error instanceof Error ? error.message : "Failed to read file stats",
        });
        continue;
      }

      let content: string;

      try {
        content = await extractor(absolutePath);
      } catch (error) {
        failures.push({
          sourcePath,
          reason: "corrupted",
          message: error instanceof Error ? error.message : "Failed to extract document content",
        });
        continue;
      }

      if (content.trim().length === 0) {
        failures.push({
          sourcePath,
          reason: "empty",
          message: "Document content is empty",
        });
        continue;
      }

      documents.push({
        id: computeDocumentId(sourcePath),
        content,
        metadata: {
          fileName: entry.name,
          sourcePath,
          extension,
          sizeBytes,
        },
      });
    }

    return { documents, failures };
  }
}
