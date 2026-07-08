import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createDefaultTextExtractorRegistry } from "./extractors/default-text-extractor-registry";
import { FileSystemDocumentLoader } from "./file-system-document-loader";

describe("FileSystemDocumentLoader", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "doc-loader-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("loads supported files recursively and reports metadata", async () => {
    await writeFile(join(dir, "top.md"), "# Top level", "utf-8");
    await mkdir(join(dir, "nested"), { recursive: true });
    await writeFile(join(dir, "nested", "child.txt"), "nested content", "utf-8");

    const loader = new FileSystemDocumentLoader({
      documentsPath: dir,
      extractors: createDefaultTextExtractorRegistry(),
    });

    const report = await loader.loadAll();

    expect(report.failures).toEqual([]);
    expect(report.documents).toHaveLength(2);

    const sourcePaths = report.documents.map((doc) => doc.metadata.sourcePath).sort();
    expect(sourcePaths).toEqual(["nested/child.txt", "top.md"]);
  });

  it("records unsupported file types without throwing", async () => {
    await writeFile(join(dir, "image.png"), "not a real image", "utf-8");

    const loader = new FileSystemDocumentLoader({
      documentsPath: dir,
      extractors: createDefaultTextExtractorRegistry(),
    });

    const report = await loader.loadAll();

    expect(report.documents).toEqual([]);
    expect(report.failures).toEqual([
      {
        sourcePath: "image.png",
        reason: "unsupported-type",
        message: expect.any(String),
      },
    ]);
  });

  it("records empty files without throwing", async () => {
    await writeFile(join(dir, "empty.txt"), "   ", "utf-8");

    const loader = new FileSystemDocumentLoader({
      documentsPath: dir,
      extractors: createDefaultTextExtractorRegistry(),
    });

    const report = await loader.loadAll();

    expect(report.documents).toEqual([]);
    expect(report.failures[0]).toMatchObject({ sourcePath: "empty.txt", reason: "empty" });
  });

  it("throws when the documents directory does not exist", async () => {
    const loader = new FileSystemDocumentLoader({
      documentsPath: join(dir, "does-not-exist"),
      extractors: createDefaultTextExtractorRegistry(),
    });

    await expect(loader.loadAll()).rejects.toThrow();
  });

  it("produces deterministic ids across repeated runs", async () => {
    await writeFile(join(dir, "a.md"), "content", "utf-8");

    const loader = new FileSystemDocumentLoader({
      documentsPath: dir,
      extractors: createDefaultTextExtractorRegistry(),
    });

    const first = await loader.loadAll();
    const second = await loader.loadAll();

    expect(first.documents[0]?.id).toBe(second.documents[0]?.id);
  });
});
