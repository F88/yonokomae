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
    const cliRel = 'dist/ops-build/ops/analyze-battle-seeds.js';
    if (!existsSync(path.join(repoRoot, cliRel))) {
      // Build only if missing (reduces test time on repeated runs)
      execSync('pnpm run build:packages', { cwd: repoRoot, stdio: 'ignore' });
      execSync('pnpm run ops:build', { cwd: repoRoot, stdio: 'ignore' });
      if (!existsSync(path.join(repoRoot, cliRel))) {
        throw new Error(
          `analyze-battle-seeds CLI not found after build: ${cliRel}`,
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
    // New fields
    expect(parsed).toHaveProperty('byPublishState');
    expect(parsed).toHaveProperty('draftIds');
    expect(parsed).toHaveProperty('filter');
  }); // timeout configured above

  it('supports published-only filtering flag', { timeout: 20_000 }, () => {
    const repoRoot = path.resolve(__dirname, '../../../../..');
    const cliRel = 'dist/ops-build/ops/analyze-battle-seeds.js';
    if (!existsSync(path.join(repoRoot, cliRel))) {
      execSync('pnpm run build:packages', { cwd: repoRoot, stdio: 'ignore' });
      execSync('pnpm run ops:build', { cwd: repoRoot, stdio: 'ignore' });
    }
    const out = execSync(`node ${cliRel} --format=json --published-only`, {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    const parsed = JSON.parse(out);
    expect(parsed.filter).toBe('published-only');
    if (parsed.draftIds.length > 0) {
      // None of the returned battles should be draft ids
      const draftSet = new Set(parsed.draftIds);
      // Cross-check via index listing
      for (const idx of parsed.index) {
        expect(draftSet.has(idx.id)).toBe(false);
      }
    }
  });
});
