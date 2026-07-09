import type { ContextPassage } from "./context-passage";

export function buildPrompt(question: string, passages: ContextPassage[]): string {
  const context = passages
    .map((passage) => `[${passage.index}] (source: ${passage.source.fileName})\n${passage.text}`)
    .join("\n\n");

  return `Context:\n${context}\n\nQuestion: ${question}`;
}
