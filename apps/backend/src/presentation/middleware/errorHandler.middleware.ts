import type { NextFunction, Request, Response } from "express";

import { logger } from "../../infrastructure/logging/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  logger.error({ err }, "Unhandled request error");

  const message = err instanceof Error ? err.message : "Unexpected error";

  res.status(500).json({
    error: {
      message: process.env.NODE_ENV === "production" ? "Internal server error" : message,
      code: "INTERNAL_ERROR",
    },
  });
}
