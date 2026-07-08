import type { Document } from "./document";

export type DocumentLoadFailureReason = "unsupported-type" | "read-error" | "corrupted" | "empty";

export interface DocumentLoadFailure {
  readonly sourcePath: string;
  readonly reason: DocumentLoadFailureReason;
  readonly message: string;
}

export interface DocumentLoadReport {
  readonly documents: Document[];
  readonly failures: DocumentLoadFailure[];
}

export interface DocumentLoader {
  loadAll(): Promise<DocumentLoadReport>;
}
