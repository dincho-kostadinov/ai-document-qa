import { describe, expect, it, vi } from "vitest";

import { TextExtractorRegistry } from "./text-extractor.registry";

describe("TextExtractorRegistry", () => {
  it("resolves a registered extractor regardless of case or missing leading dot", () => {
    const registry = new TextExtractorRegistry();
    const extractor = vi.fn();

    registry.register(".txt", extractor);

    expect(registry.resolve("txt")).toBe(extractor);
    expect(registry.resolve(".TXT")).toBe(extractor);
  });

  it("returns undefined for an unregistered extension", () => {
    const registry = new TextExtractorRegistry();

    expect(registry.resolve(".pdf")).toBeUndefined();
  });

  it("throws when registering the same extension twice", () => {
    const registry = new TextExtractorRegistry();
    registry.register(".txt", vi.fn());

    expect(() => registry.register(".txt", vi.fn())).toThrow();
  });

  it("lists supported extensions", () => {
    const registry = new TextExtractorRegistry();
    registry.register(".txt", vi.fn());
    registry.register(".md", vi.fn());

    expect(registry.supportedExtensions().sort()).toEqual([".md", ".txt"]);
  });
});
