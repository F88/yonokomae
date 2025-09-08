import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import * as path from 'path';

/**
 * Basic smoke test: build ops, run analyzer in JSON mode (dist load) and validate schema.
 * Note: This test assumes build:packages and ops:build executed via parent test pipeline.
 */

describe('analyze-battle-seeds CLI', () => {
  it('outputs JSON with expected structure', { timeout: 20_000 }, () => {
    const repoRoot = path.resolve(__dirname, '../../../../..');
    const candidates = [
      'dist/ops/analyze-battle-seeds.js',
      'dist/ops/ops/analyze-battle-seeds.js',
    ];
    let cliRel = candidates.find((p) => existsSync(path.join(repoRoot, p)));
    if (!cliRel) {
      // Build only if missing (reduces test time on repeated runs)
      execSync('pnpm run build:packages', { cwd: repoRoot, stdio: 'ignore' });
      execSync('pnpm run ops:build', { cwd: repoRoot, stdio: 'ignore' });
      cliRel = candidates.find((p) => existsSync(path.join(repoRoot, p)));
      if (!cliRel) {
        throw new Error(
          `analyze-battle-seeds CLI not found after build. Tried:\n` +
            candidates.map((c) => '  - ' + c).join('\n'),
        );
      }
    }
    const out = execSync(`node ${cliRel} --format=json`, {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    const parsed = JSON.parse(out);
    expect(parsed).toHaveProperty('total');
    expect(typeof parsed.total).toBe('number');
    expect(parsed).toHaveProperty('byTheme');
    expect(parsed).toHaveProperty('bySignificance');
    expect(parsed).toHaveProperty('power');
    expect(parsed.power).toHaveProperty('combined');
    expect(Array.isArray(parsed.topCombined)).toBe(true);
  }); // timeout configured above
});
