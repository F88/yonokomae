import { defineWorkspace } from 'vitest/config';
import path from 'node:path';

// Central Vitest workspace configuration to help the VS Code Vitest extension
// enumerate only these explicit project configs. The current Vitest version
// flags the array signature as deprecated, but its runtime still expects it
// when this file is loaded directly. We'll migrate to the object form
// (defineWorkspace({ projects: [...] })) after upgrading Vitest.
// TODO(tech-debt): upgrade Vitest and switch to object workspace syntax.
export default defineWorkspace([
  // Application (contains its own multiple projects: unit + storybook)
  path.resolve(__dirname, 'packages/app/vitest.config.ts'),
  // Data seed packages (simple node env tests)
  path.resolve(__dirname, 'data/battle-seeds/vitest.config.ts'),
  path.resolve(__dirname, 'data/news-seeds/vitest.config.ts'),
  path.resolve(__dirname, 'data/historical-evidence/vitest.config.ts'),
]);
