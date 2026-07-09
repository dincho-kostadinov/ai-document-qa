"use client";

import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

interface QuestionFormProps {
  isLoading: boolean;
  onSubmit: (question: string) => void;
}

export function QuestionForm({ isLoading, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState("");

  function submit() {
    const trimmed = question.trim();

    if (!trimmed || isLoading) {
      return;
    }

    onSubmit(trimmed);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={1000}
        disabled={isLoading}
        placeholder="Ask a question about the documents..."
        rows={3}
      />
      <button type="submit" disabled={isLoading || question.trim().length === 0}>
        {isLoading ? "Thinking…" : "Ask"}
      </button>
    </form>
  );
}
