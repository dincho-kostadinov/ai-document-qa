export interface GeneratedAnswer {
  readonly grounded: boolean;
  readonly answer: string;
  readonly citations: number[];
}
