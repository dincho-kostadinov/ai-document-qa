import { AnswerGenerationError } from "../../domain/answers/answer-generator.errors";
import type { AnswerGenerator } from "../../domain/answers/answer-generator.port";
import type { GeneratedAnswer } from "../../domain/answers/generated-answer";
import { SYSTEM_INSTRUCTION } from "../../domain/answers/system-prompt";

import { generatedAnswerSchema } from "./generated-answer.schema";

export const RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    grounded: { type: "boolean" },
    answer: { type: "string" },
    citations: { type: "array", items: { type: "integer" } },
  },
  required: ["grounded", "answer", "citations"],
} as const;

export interface GenerateContentClient {
  models: {
    generateContent(params: {
      model: string;
      contents: string;
      config?: {
        systemInstruction?: string;
        temperature?: number;
        responseMimeType?: string;
        responseJsonSchema?: unknown;
      };
    }): Promise<{ text?: string }>;
  };
}

export class GoogleAnswerGenerator implements AnswerGenerator {
  constructor(
    private readonly client: GenerateContentClient,
    private readonly model: string,
    private readonly temperature: number,
  ) {}

  async generate(prompt: string): Promise<GeneratedAnswer> {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: this.temperature,
          responseMimeType: "application/json",
          responseJsonSchema: RESPONSE_JSON_SCHEMA,
        },
      });

      if (!response.text) {
        throw new Error("Received an empty response from the model");
      }

      const parsed: unknown = JSON.parse(response.text);

      return generatedAnswerSchema.parse(parsed);
    } catch (error) {
      throw new AnswerGenerationError("Failed to generate an answer", { cause: error });
    }
  }
}
