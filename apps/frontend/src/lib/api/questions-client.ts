import { env } from "../env";

import { ApiError } from "./api-error";
import type { AnswerResponseDto, ErrorResponseDto } from "./types";

export async function askQuestion(question: string): Promise<AnswerResponseDto> {
  let response: Response;

  try {
    response = await fetch(`${env.apiBaseUrl}/api/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Unable to reach the server. Please try again.");
  }

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    let code: string | undefined;

    try {
      const body = (await response.json()) as ErrorResponseDto;
      message = body.error.message;
      code = body.error.code;
    } catch {
      // response body wasn't valid JSON — fall back to the generic message above
    }

    throw new ApiError(message, code);
  }

  try {
    return (await response.json()) as AnswerResponseDto;
  } catch {
    throw new ApiError("Received an unexpected response from the server.");
  }
}
