import path from "node:path";

import { z } from "zod";

// This file lives at apps/backend/{src,dist}/infrastructure/config — five
// directories below the repo root in both the source and built layouts, since
// "src"/"dist" sit at the same depth. data/ lives at the repo root (ADR-006),
// not inside apps/backend, so relative env values must be resolved against
// this anchor rather than process.cwd(), which varies by how the process is
// launched (npm workspace scripts, tsx, Docker's WORKDIR, ...).
const REPO_ROOT = path.resolve(__dirname, "../../../../..");

function resolveFromRepoRoot(value: string): string {
  return path.isAbsolute(value) ? value : path.resolve(REPO_ROOT, value);
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  GOOGLE_EMBEDDINGS_MODEL: z.string().default("gemini-embedding-001"),
  VECTOR_STORE_PATH: z.string().default("./data/vectors").transform(resolveFromRepoRoot),
  DOCUMENTS_PATH: z.string().default("./data/documents").transform(resolveFromRepoRoot),
  CHUNK_SIZE: z.coerce.number().default(800),
  CHUNK_OVERLAP: z.coerce.number().default(200),
  SIMILARITY_TOP_K: z.coerce.number().default(5),
  SIMILARITY_THRESHOLD: z.coerce.number().default(0.5),
  GEMINI_TEMPERATURE: z.coerce.number().default(0),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  return envSchema.parse(process.env);
}
