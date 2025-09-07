import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import * as path from 'path';

/**
 * Basic smoke test: build ops, run analyzer in JSON mode (dist load) and validate schema.
 * Note: This test assumes build:packages and ops:build executed via parent test pipeline.
 */

describe('analyze-battle-seeds CLI', () => {
  it('outputs JSON with expected structure', () => {
    const repoRoot = path.resolve(__dirname, '../../../../..');
    // Run build steps synchronously (lightweight since cached) to ensure dist exists
    execSync('pnpm run build:packages', { cwd: repoRoot, stdio: 'ignore' });
    execSync('pnpm run ops:build', { cwd: repoRoot, stdio: 'ignore' });
    const out = execSync(
      'node dist/ops/analyze-battle-seeds.js --format=json',
      { cwd: repoRoot, encoding: 'utf8' },
    );
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty('total');
    expect(typeof parsed.total).toBe('number');
    expect(parsed).toHaveProperty('byTheme');
    expect(parsed).toHaveProperty('bySignificance');
    expect(parsed).toHaveProperty('power');
    expect(parsed.power).toHaveProperty('combined');
    expect(Array.isArray(parsed.topCombined)).toBe(true);
  });
});
