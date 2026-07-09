import type { Answer } from "../../domain/answers/answer";
import type { AnswerGenerator } from "../../domain/answers/answer-generator.port";
import { buildContext } from "../../domain/answers/build-context";
import { buildPrompt } from "../../domain/answers/build-prompt";
import { dedupeSourcesByDocument } from "../../domain/answers/dedupe-sources";
import { createNoContextAnswer } from "../../domain/answers/no-context-answer";
import type { SourceReference } from "../../domain/answers/source-reference";
import type { ScoredChunk } from "../../domain/search/scored-chunk";
import { logger } from "../../infrastructure/logging/logger";

export interface GenerateAnswerUseCaseConfig {
  generator: AnswerGenerator;
}

export class GenerateAnswerUseCase {
  constructor(private readonly config: GenerateAnswerUseCaseConfig) {}

  async generate(question: string, chunks: ScoredChunk[]): Promise<Answer> {
    if (chunks.length === 0) {
      return createNoContextAnswer();
    }

    const passages = buildContext(chunks);
    const prompt = buildPrompt(question, passages);
    const generated = await this.config.generator.generate(prompt);

    if (!generated.grounded) {
      return { text: generated.answer, sources: [], grounded: false };
    }

    const passageByIndex = new Map(passages.map((passage) => [passage.index, passage]));
    const citedSources: SourceReference[] = [];

    for (const citation of generated.citations) {
      const passage = passageByIndex.get(citation);

      if (!passage) {
        logger.warn({ citation }, "Model returned a citation index with no matching context passage; dropping it");
        continue;
      }

      citedSources.push(passage.source);
    }

    return {
      text: generated.answer,
      sources: dedupeSourcesByDocument(citedSources),
      grounded: true,
    };
  }
}
