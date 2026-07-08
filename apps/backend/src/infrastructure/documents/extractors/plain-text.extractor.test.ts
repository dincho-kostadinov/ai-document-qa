import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readPlainText } from "./plain-text.extractor";

describe("readPlainText", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "doc-loader-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("reads UTF-8 file content", async () => {
    const filePath = join(dir, "sample.txt");
    await writeFile(filePath, "hello world", "utf-8");

    await expect(readPlainText(filePath)).resolves.toBe("hello world");
  });
});
