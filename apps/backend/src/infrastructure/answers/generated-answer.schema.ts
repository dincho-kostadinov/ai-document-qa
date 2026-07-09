import { z } from "zod";

export const generatedAnswerSchema = z
  .object({
    grounded: z.boolean(),
    answer: z.string(),
    citations: z.array(z.number()),
  })
  .strict();
