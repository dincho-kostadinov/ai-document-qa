import { z } from "zod";

export const questionRequestSchema = z.object({
  question: z.string().trim().min(1).max(1000),
});

export type QuestionRequestDto = z.infer<typeof questionRequestSchema>;
