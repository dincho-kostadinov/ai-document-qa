import { readPlainText } from "./plain-text.extractor";
import { TextExtractorRegistry } from "./text-extractor.registry";

export function createDefaultTextExtractorRegistry(): TextExtractorRegistry {
  const registry = new TextExtractorRegistry();

  registry.register(".txt", readPlainText);
  registry.register(".md", readPlainText);

  return registry;
}
