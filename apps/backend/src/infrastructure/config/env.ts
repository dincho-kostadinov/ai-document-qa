import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  // Optional until the Gemini client (Feature 003/004) is implemented.
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  GOOGLE_EMBEDDINGS_MODEL: z.string().default("text-embedding-004"),
  VECTOR_STORE_PATH: z.string().default("./data/vectors"),
  DOCUMENTS_PATH: z.string().default("./data/documents"),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  return envSchema.parse(process.env);
}
