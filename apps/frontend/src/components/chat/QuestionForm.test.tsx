import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { QuestionForm } from "./QuestionForm";

describe("QuestionForm", () => {
  it("calls onSubmit with the trimmed question when submitted", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<QuestionForm isLoading={false} onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox"), "  What happened?  ");
    await user.click(screen.getByRole("button", { name: /ask/i }));

    expect(onSubmit).toHaveBeenCalledWith("What happened?");
  });

  it("does not call onSubmit for an empty or whitespace-only question", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<QuestionForm isLoading={false} onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox"), "   ");

    expect(screen.getByRole("button", { name: /ask/i })).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits on Enter and inserts a newline on Shift+Enter", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<QuestionForm isLoading={false} onSubmit={onSubmit} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello{Shift>}{Enter}{/Shift}world");

    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea).toHaveValue("Hello\nworld");

    await user.type(textarea, "{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("Hello\nworld");
  });

  it("disables the textarea and button while loading", () => {
    render(<QuestionForm isLoading={true} onSubmit={vi.fn()} />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
