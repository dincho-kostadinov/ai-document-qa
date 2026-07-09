import path from "node:path";

import { config as loadEnvFile } from "dotenv";

import { createApp } from "./app";
import { createAppDependencies } from "./infrastructure/composition/create-question-answering-dependencies";
import { loadEnv } from "./infrastructure/config/env";
import { logger } from "./infrastructure/logging/logger";

// __dirname is apps/backend/src (tsx) or apps/backend/dist (built) — both sit
// one level under apps/backend, so this resolves to apps/backend/.env either way,
// regardless of the process's current working directory.
const dotenvResult = loadEnvFile({ path: path.resolve(__dirname, "..", ".env") });

if (dotenvResult.error) {
  logger.debug(
    { err: dotenvResult.error },
    "No apps/backend/.env file found; relying on existing process environment variables",
  );
}

async function main(): Promise<void> {
  const env = loadEnv();
  const deps = createAppDependencies(env);

  const indexingReport = await deps.indexDocuments.run();
  logger.info({ indexingReport }, "Startup indexing complete");

  const app = createApp(env, {
    searchSimilarChunks: deps.searchSimilarChunks,
    generateAnswer: deps.generateAnswer,
  });

  app.listen(env.PORT, () => {
    logger.info(`Backend listening on port ${env.PORT}`);
  });
}

main().catch((error: unknown) => {
  logger.error({ err: error }, "Failed to start the backend");
  process.exit(1);
});
