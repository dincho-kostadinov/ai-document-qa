import cors from "cors";
import express from "express";

import type { Env } from "./infrastructure/config/env";
import { errorHandler } from "./presentation/middleware/errorHandler.middleware";
import { healthRouter } from "./presentation/routes/health.route";

export function createApp(env: Env): express.Express {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.use(healthRouter);

  app.use(errorHandler);

  return app;
}
