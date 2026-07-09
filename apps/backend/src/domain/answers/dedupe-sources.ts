import type { SourceReference } from "./source-reference";

export function dedupeSourcesByDocument(sources: SourceReference[]): SourceReference[] {
  const seen = new Set<string>();
  const deduped: SourceReference[] = [];

  for (const source of sources) {
    if (seen.has(source.documentId)) {
      continue;
    }

    seen.add(source.documentId);
    deduped.push(source);
  }

  return deduped;
}
