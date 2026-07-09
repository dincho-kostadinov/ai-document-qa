import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ApiError } from "../../lib/api/api-error";
import { askQuestion } from "../../lib/api/questions-client";
import type { AnswerResponseDto } from "../../lib/api/types";

import { ChatView } from "./ChatView";

vi.mock("../../lib/api/questions-client", () => ({
  askQuestion: vi.fn(),
}));

const mockedAskQuestion = vi.mocked(askQuestion);

describe("ChatView", () => {
  it("shows the loading state then the answer on success", async () => {
    let resolveAsk!: (value: AnswerResponseDto) => void;
    mockedAskQuestion.mockReturnValue(
      new Promise((resolve) => {
        resolveAsk = resolve;
      }),
    );

    const user = userEvent.setup();
    render(<ChatView />);

    await user.type(screen.getByRole("textbox"), "What happened?");
    await user.click(screen.getByRole("button", { name: /ask/i }));

    expect(screen.getByRole("button", { name: /thinking/i })).toBeInTheDocument();

    resolveAsk({ answer: "The answer.", grounded: true, sources: [] });

    await waitFor(() => expect(screen.getByText("The answer.")).toBeInTheDocument());
  });

  it("shows an error banner when the request fails", async () => {
    mockedAskQuestion.mockRejectedValueOnce(new ApiError("Server exploded"));

    const user = userEvent.setup();
    render(<ChatView />);

    await user.type(screen.getByRole("textbox"), "What happened?");
    await user.click(screen.getByRole("button", { name: /ask/i }));

    await waitFor(() => expect(screen.getByText("Server exploded")).toBeInTheDocument());
  });

  it("keeps the previous answer visible while a new question is loading", async () => {
    mockedAskQuestion.mockResolvedValueOnce({ answer: "First answer.", grounded: true, sources: [] });

    const user = userEvent.setup();
    render(<ChatView />);

    await user.type(screen.getByRole("textbox"), "First question");
    await user.click(screen.getByRole("button", { name: /ask/i }));

    await waitFor(() => expect(screen.getByText("First answer.")).toBeInTheDocument());

    let resolveSecond!: (value: AnswerResponseDto) => void;
    mockedAskQuestion.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSecond = resolve;
      }),
    );

    await user.type(screen.getByRole("textbox"), "Second question");
    await user.click(screen.getByRole("button", { name: /ask/i }));

    expect(screen.getByText("First answer.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /thinking/i })).toBeInTheDocument();

    resolveSecond({ answer: "Second answer.", grounded: true, sources: [] });

    await waitFor(() => expect(screen.getByText("Second answer.")).toBeInTheDocument());
    expect(screen.queryByText("First answer.")).not.toBeInTheDocument();
  });

  it("does not call askQuestion for an empty question", async () => {
    const user = userEvent.setup();
    render(<ChatView />);

    await user.click(screen.getByRole("button", { name: /ask/i }));

    expect(mockedAskQuestion).not.toHaveBeenCalled();
  });
});
