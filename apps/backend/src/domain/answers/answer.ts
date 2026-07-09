import type { SourceReference } from "./source-reference";

export interface Answer {
  readonly text: string;
  readonly sources: SourceReference[];
  readonly grounded: boolean;
}
