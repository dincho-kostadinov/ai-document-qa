import type { Answer } from "./answer";

export function createNoContextAnswer(): Answer {
  return {
    text: "I don't have enough information in the provided documents to answer that.",
    sources: [],
    grounded: false,
  };
}
