import { app } from './app.js';
import { configs } from './shared/configs/env.js';
import { logger } from './shared/utils/logger.js';

app.listen(configs.PORT, () => {
  logger.info(
    `Server is running on port http://localhost:${configs.PORT}, in ${configs.NODE_ENV} mode`,
  );
});
