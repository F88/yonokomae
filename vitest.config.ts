import viteConfig from './vite.config';

import { defineConfig, defineProject, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Define two isolated projects: unit (jsdom) and storybook (browser)
      projects: [
        // Unit/integration tests (Node + JSDOM)
        defineProject({
          resolve: {
            alias: {
              '@': path.resolve(dirname, './src'),
            },
          },
          test: {
            name: 'unit',
            globals: true,
            environment: 'jsdom',
            css: true,
            setupFiles: './src/test/setup.ts',
            include: ['src/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.tsx'],
            exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
          },
        }),
        // Storybook portable-stories tests (real browser)
        defineProject({
          resolve: {
            alias: {
              '@': path.resolve(dirname, './src'),
            },
          },
          optimizeDeps: {
            include: ['react', 'react-dom', 'react/jsx-dev-runtime'],
          },
          plugins: [
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
              // Use pnpm script defined in package.json
              storybookScript: 'pnpm run storybook -- --ci',
            }),
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              provider: 'playwright',
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
            // Important: use Storybook-specific setup; avoid Node-only libs here
            setupFiles: ['./.storybook/vitest.setup.ts'],
          },
        }),
      ],
    },
  }),
);
