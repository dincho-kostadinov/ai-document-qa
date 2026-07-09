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

export interface ErrorResponseDto {
  error: {
    message: string;
    code: string;
  };
}
