import cors from "cors";
import express from "express";

import type { GenerateAnswerUseCase } from "./application/answers/generate-answer.use-case";
import type { SearchSimilarChunksUseCase } from "./application/search/search-similar-chunks.use-case";
import type { Env } from "./infrastructure/config/env";
import { errorHandler } from "./presentation/middleware/errorHandler.middleware";
import { createQuestionsRouter } from "./presentation/questions/questions.route";
import { healthRouter } from "./presentation/routes/health.route";

export interface AppDeps {
  searchSimilarChunks: SearchSimilarChunksUseCase;
  generateAnswer: GenerateAnswerUseCase;
}

export function createApp(env: Env, deps: AppDeps): express.Express {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.use(healthRouter);
  app.use(createQuestionsRouter({ search: deps.searchSimilarChunks, answer: deps.generateAnswer }));

  app.use(errorHandler);

  return app;
}
