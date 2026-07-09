import { describe, expect, it } from "vitest";

import { AnswerGenerationError } from "../../domain/answers/answer-generator.errors";

import type { GenerateContentClient } from "./google-answer-generator";
import { GoogleAnswerGenerator, RESPONSE_JSON_SCHEMA } from "./google-answer-generator";

function makeClient(
  generateContent: GenerateContentClient["models"]["generateContent"],
): GenerateContentClient {
  return { models: { generateContent } };
}

describe("GoogleAnswerGenerator", () => {
  it("parses a valid structured JSON response", async () => {
    const client = makeClient(async () => ({
      text: JSON.stringify({ grounded: true, answer: "The answer.", citations: [1, 2] }),
    }));

    const generator = new GoogleAnswerGenerator(client, "gemini-2.5-flash", 0);

    await expect(generator.generate("prompt")).resolves.toEqual({
      grounded: true,
      answer: "The answer.",
      citations: [1, 2],
    });
  });

  it("sends responseMimeType, the JSON schema, temperature, and the system instruction", async () => {
    let receivedParams: Parameters<GenerateContentClient["models"]["generateContent"]>[0] | undefined;

    const client = makeClient(async (params) => {
      receivedParams = params;
      return { text: JSON.stringify({ grounded: true, answer: "ok", citations: [] }) };
    });

    const generator = new GoogleAnswerGenerator(client, "gemini-2.5-flash", 0);
    await generator.generate("prompt");

    expect(receivedParams?.config?.responseMimeType).toBe("application/json");
    expect(receivedParams?.config?.responseJsonSchema).toEqual(RESPONSE_JSON_SCHEMA);
    expect(receivedParams?.config?.temperature).toBe(0);
    expect(receivedParams?.config?.systemInstruction).toEqual(expect.any(String));
  });

  it("wraps client errors in AnswerGenerationError", async () => {
    const client = makeClient(async () => {
      throw new Error("network down");
    });

    const generator = new GoogleAnswerGenerator(client, "gemini-2.5-flash", 0);

    await expect(generator.generate("prompt")).rejects.toThrow(AnswerGenerationError);
  });

  it("throws when the response text is empty", async () => {
    const client = makeClient(async () => ({ text: undefined }));

    const generator = new GoogleAnswerGenerator(client, "gemini-2.5-flash", 0);

    await expect(generator.generate("prompt")).rejects.toThrow(AnswerGenerationError);
  });

  it("throws when the response text is not valid JSON", async () => {
    const client = makeClient(async () => ({ text: "not json" }));

    const generator = new GoogleAnswerGenerator(client, "gemini-2.5-flash", 0);

    await expect(generator.generate("prompt")).rejects.toThrow(AnswerGenerationError);
  });

  it("throws when a required field is missing", async () => {
    const client = makeClient(async () => ({ text: JSON.stringify({ grounded: true, answer: "ok" }) }));

    const generator = new GoogleAnswerGenerator(client, "gemini-2.5-flash", 0);

    await expect(generator.generate("prompt")).rejects.toThrow(AnswerGenerationError);
  });

  it("throws when the response has an unexpected extra field (strict schema)", async () => {
    const client = makeClient(async () => ({
      text: JSON.stringify({ grounded: true, answer: "ok", citations: [], extra: "nope" }),
    }));

    const generator = new GoogleAnswerGenerator(client, "gemini-2.5-flash", 0);

    await expect(generator.generate("prompt")).rejects.toThrow(AnswerGenerationError);
  });
});
