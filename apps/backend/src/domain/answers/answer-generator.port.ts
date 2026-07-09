import type { GeneratedAnswer } from "./generated-answer";

export interface AnswerGenerator {
  generate(prompt: string): Promise<GeneratedAnswer>;
}
