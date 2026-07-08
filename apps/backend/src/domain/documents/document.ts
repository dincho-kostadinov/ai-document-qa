import type { DocumentMetadata } from "./document-metadata";

export interface Document {
  readonly id: string;
  readonly content: string;
  readonly metadata: DocumentMetadata;
}
