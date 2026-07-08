import { readFile } from "node:fs/promises";

import type { TextExtractor } from "./text-extractor.registry";

export const readPlainText: TextExtractor = async (filePath) => {
  return readFile(filePath, "utf-8");
};
