import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    globalSetup: './tests/setup/global-setup.ts',
    setupFiles: './tests/setup/test-env.ts',
    fileParallelism: false,
  },
});
