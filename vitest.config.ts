import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
      // Only pick up unit/integration tests under src/**
      include: ['src/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.tsx'],
      // Exclude Playwright E2E specs and build artifacts
      exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    },
  }),
);
