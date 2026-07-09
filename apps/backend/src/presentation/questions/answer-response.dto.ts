import type { Answer } from "../../domain/answers/answer";

export interface SourceReferenceDto {
  documentId: string;
  fileName: string;
  sourcePath: string;
}

export interface AnswerResponseDto {
  answer: string;
  grounded: boolean;
  sources: SourceReferenceDto[];
}

export function toAnswerResponseDto(answer: Answer): AnswerResponseDto {
  return {
    answer: answer.text,
    grounded: answer.grounded,
    sources: answer.sources.map((source) => ({
      documentId: source.documentId,
      fileName: source.fileName,
      sourcePath: source.sourcePath,
    })),
  };
}
