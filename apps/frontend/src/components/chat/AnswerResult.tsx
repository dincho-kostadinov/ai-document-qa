import type { AnswerResponseDto } from "../../lib/api/types";

import styles from "./AnswerResult.module.css";

interface AnswerResultProps {
  answer: AnswerResponseDto;
}

export function AnswerResult({ answer }: AnswerResultProps) {
  return (
    <section className={styles.card} aria-label="Answer">
      <span className={`${styles.badge} ${answer.grounded ? styles.badgeGrounded : styles.badgeUngrounded}`}>
        {answer.grounded ? "From your documents" : "No match found"}
      </span>
      <p className={styles.answer}>{answer.answer}</p>
      {answer.sources.length > 0 && (
        <div>
          <h2 className={styles.sourcesHeading}>Sources</h2>
          <ul className={styles.sourcesList}>
            {answer.sources.map((source) => (
              <li key={source.documentId} className={styles.sourceItem}>
                {source.fileName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
