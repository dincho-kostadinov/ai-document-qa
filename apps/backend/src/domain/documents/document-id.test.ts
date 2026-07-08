import { describe, expect, it } from "vitest";

import { computeDocumentId } from "./document-id";

describe("computeDocumentId", () => {
  it("returns the same id for the same relative path", () => {
    expect(computeDocumentId("feedback/mobile-login.md")).toBe(
      computeDocumentId("feedback/mobile-login.md"),
    );
  });

  it("returns different ids for different paths", () => {
    expect(computeDocumentId("a.md")).not.toBe(computeDocumentId("b.md"));
  });

  it("returns a 64-character hex string", () => {
    expect(computeDocumentId("a.md")).toMatch(/^[0-9a-f]{64}$/);
  });
});
