import { app } from './app.js';
import { configs } from './shared/configs/env.js';

app.listen(configs.PORT, () => {
  console.log(
    `Server is running on port http://localhost:${configs.PORT}, in ${configs.NODE_ENV} mode`,
  );
});
