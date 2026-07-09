import type { AnswerResponseDto } from "../../lib/api/types";

interface AnswerResultProps {
  answer: AnswerResponseDto;
}

export function AnswerResult({ answer }: AnswerResultProps) {
  return (
    <section aria-label="Answer">
      <p>{answer.answer}</p>
      {answer.sources.length > 0 && (
        <div>
          <h2>Sources</h2>
          <ul>
            {answer.sources.map((source) => (
              <li key={source.documentId}>{source.fileName}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
