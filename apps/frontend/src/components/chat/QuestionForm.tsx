"use client";

import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

import styles from "./QuestionForm.module.css";

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={1000}
        disabled={isLoading}
        placeholder="Ask a question about the documents..."
        rows={3}
      />
      <div className={styles.footer}>
        <span className={styles.hint}>Enter to send · Shift+Enter for a new line</span>
        <button
          type="submit"
          className={styles.submit}
          disabled={isLoading || question.trim().length === 0}
        >
          {isLoading && <span className={styles.spinner} aria-hidden="true" />}
          {isLoading ? "Thinking…" : "Ask"}
        </button>
      </div>
    </form>
  );
}
