import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// This test exercises the battle index generator script in an isolated, incremental way.
// Scenarios:
//  1. Baseline run (no temp duplicates) should succeed (exit 0)
//  2. Duplicate basename across different directories triggers hard error (exit 1)
//  3. Duplicate battle id across different files (distinct basenames) triggers hard error (exit 1)
// All temp artifacts are created under src/battle/__tmp_dup_test__ and cleaned after each scenario.

const PKG_ROOT = path.resolve(__dirname, '..'); // points to data/battle-seeds
const BATTLE_ROOT = path.join(PKG_ROOT, 'src', 'battle');
const TMP_ROOT = path.join(BATTLE_ROOT, '__tmp_dup_test__');

function runGenerator(): { code: number; stdout: string; stderr: string } {
  const result = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['-y', 'tsx', 'scripts/generate-battle-index.ts'],
    {
      cwd: PKG_ROOT,
      encoding: 'utf8',
      env: { ...process.env },
    },
  );
  return {
    code: result.status ?? -1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

async function cleanTmp() {
  await fs.rm(TMP_ROOT, { recursive: true, force: true });
}

async function writeFile(rel: string, content: string) {
  const abs = path.join(TMP_ROOT, rel);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, 'utf8');
}

// Minimal seed content sufficient for generator (publishState + id); rest casted.
function seedContent(id: string, publishState = 'draft') {
  return `export default { id: '${id}', publishState: '${publishState}' } as any;`;
}

describe('generate-battle-index duplicate detection', () => {
  it('baseline run succeeds; duplicate basename and id scenarios fail', async () => {
    // Ensure clean state
    await cleanTmp();

    // 1. Baseline (no duplicates introduced by this test)
    const base = runGenerator();
    expect(base.code).toBe(0);
    expect(base.stderr).not.toMatch(/duplicate entries detected/);

    // 2. Duplicate basename across different folders
    await writeFile(
      'a/duplicate-basename.ja.ts',
      seedContent('dup-basename-a'),
    );
    await writeFile(
      'b/duplicate-basename.ja.ts',
      seedContent('dup-basename-b'),
    );
    const dupBase = runGenerator();
    expect(dupBase.code).toBe(1);
    expect(dupBase.stderr + dupBase.stdout).toMatch(
      /duplicate entries detected/,
    );
    expect(dupBase.stderr + dupBase.stdout).toMatch(/basenames/);
    // Cleanup for next scenario
    await cleanTmp();

    // 3. Duplicate battle id (distinct basenames)
    await writeFile('c/dup-id-1.ja.ts', seedContent('DUP-ID-CASE'));
    await writeFile('d/dup-id-2.ja.ts', seedContent('DUP-ID-CASE'));
    const dupId = runGenerator();
    expect(dupId.code).toBe(1);
    expect(dupId.stderr + dupId.stdout).toMatch(/duplicate entries detected/);
    expect(dupId.stderr + dupId.stdout).toMatch(/battleIds/);

    // Final cleanup
    await cleanTmp();

    // 4. Success again after cleanup
    const finalRun = runGenerator();
    expect(finalRun.code).toBe(0);
  }, 60_000); // generous timeout for spawning & TSX startup
});
