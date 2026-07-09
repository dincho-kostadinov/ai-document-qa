import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { logger } from "../../infrastructure/logging/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: err.issues[0]?.message ?? "Invalid request body",
        code: "VALIDATION_ERROR",
      },
    });
    return;
  }

  logger.error({ err }, "Unhandled request error");

  const message = err instanceof Error ? err.message : "Unexpected error";

  res.status(500).json({
    error: {
      message: process.env.NODE_ENV === "production" ? "Internal server error" : message,
      code: "INTERNAL_ERROR",
    },
  });
}
