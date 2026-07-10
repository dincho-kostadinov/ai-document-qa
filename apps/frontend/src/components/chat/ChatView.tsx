"use client";

import { useState } from "react";

import { ApiError } from "../../lib/api/api-error";
import { askQuestion } from "../../lib/api/questions-client";
import type { AnswerResponseDto } from "../../lib/api/types";

import { AnswerResult } from "./AnswerResult";
import styles from "./ChatView.module.css";
import { ErrorBanner } from "./ErrorBanner";
import { QuestionForm } from "./QuestionForm";

type RequestPhase = "idle" | "loading" | "error";

interface ChatState {
  phase: RequestPhase;
  answer: AnswerResponseDto | null;
  errorMessage: string | null;
}

const initialState: ChatState = { phase: "idle", answer: null, errorMessage: null };

export function ChatView() {
  const [state, setState] = useState<ChatState>(initialState);

  async function handleSubmit(question: string) {
    setState((current) => ({ ...current, phase: "loading", errorMessage: null }));

    try {
      const answer = await askQuestion(question);
      setState({ phase: "idle", answer, errorMessage: null });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
      setState((current) => ({ ...current, phase: "error", errorMessage: message }));
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>AI Document Q&amp;A</h1>
          <p className={styles.subtitle}>Ask a question and get an answer sourced from your documents.</p>
        </div>
        <QuestionForm isLoading={state.phase === "loading"} onSubmit={handleSubmit} />
        {state.phase === "error" && state.errorMessage && <ErrorBanner message={state.errorMessage} />}
        {state.answer && <AnswerResult answer={state.answer} />}
      </div>
    </main>
  );
}
