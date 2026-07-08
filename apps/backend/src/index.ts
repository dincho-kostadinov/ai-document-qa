import { createApp } from "./app";
import { loadEnv } from "./infrastructure/config/env";
import { logger } from "./infrastructure/logging/logger";

const env = loadEnv();
const app = createApp(env);

app.listen(env.PORT, () => {
  logger.info(`Backend listening on port ${env.PORT}`);
});
