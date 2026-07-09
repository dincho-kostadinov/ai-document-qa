import type { SourceReference } from "./source-reference";

export interface ContextPassage {
  readonly index: number;
  readonly text: string;
  readonly source: SourceReference;
}
