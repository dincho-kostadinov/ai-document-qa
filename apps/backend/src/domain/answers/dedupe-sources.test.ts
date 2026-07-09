import { describe, expect, it } from "vitest";

import type { SourceReference } from "./source-reference";

import { dedupeSourcesByDocument } from "./dedupe-sources";

function makeSource(documentId: string): SourceReference {
  return { documentId, fileName: `${documentId}.txt`, sourcePath: `${documentId}.txt` };
}

describe("dedupeSourcesByDocument", () => {
  it("collapses multiple sources from the same document into one", () => {
    const sources = [makeSource("doc-1"), makeSource("doc-1"), makeSource("doc-2")];

    expect(dedupeSourcesByDocument(sources)).toEqual([makeSource("doc-1"), makeSource("doc-2")]);
  });

  it("preserves first-occurrence order", () => {
    const sources = [makeSource("doc-2"), makeSource("doc-1"), makeSource("doc-2")];

    expect(dedupeSourcesByDocument(sources).map((source) => source.documentId)).toEqual(["doc-2", "doc-1"]);
  });

  it("returns an empty array for no sources", () => {
    expect(dedupeSourcesByDocument([])).toEqual([]);
  });
});
