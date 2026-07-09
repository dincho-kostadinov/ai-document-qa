import { createApp } from "./app";
import { loadEnv } from "./infrastructure/config/env";
import { createAppDependencies } from "./infrastructure/composition/create-question-answering-dependencies";
import { logger } from "./infrastructure/logging/logger";

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
