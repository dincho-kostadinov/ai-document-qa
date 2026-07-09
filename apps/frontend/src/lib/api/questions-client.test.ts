import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "./api-error";
import { askQuestion } from "./questions-client";

describe("askQuestion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the parsed answer on success", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ answer: "hi", grounded: true, sources: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(askQuestion("question")).resolves.toEqual({ answer: "hi", grounded: true, sources: [] });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/questions"),
      expect.objectContaining({ method: "POST", cache: "no-store" }),
    );
  });

  it("throws an ApiError with the server message for a non-ok JSON response", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ error: { message: "Invalid question", code: "VALIDATION_ERROR" } }), {
          status: 400,
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(askQuestion("")).rejects.toMatchObject({
      message: "Invalid question",
      code: "VALIDATION_ERROR",
    });
  });

  it("throws a generic ApiError when the error response body isn't valid JSON", async () => {
    const fetchMock = vi.fn(async () => new Response("not json", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(askQuestion("question")).rejects.toBeInstanceOf(ApiError);
  });

  it("throws a generic ApiError when fetch itself rejects", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("network down");
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(askQuestion("question")).rejects.toBeInstanceOf(ApiError);
  });

  it("throws a generic ApiError when the success response body isn't valid JSON", async () => {
    const fetchMock = vi.fn(async () => new Response("not json", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(askQuestion("question")).rejects.toBeInstanceOf(ApiError);
  });
});
