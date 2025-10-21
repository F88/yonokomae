#!/usr/bin/env node
import { execa } from 'execa';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensureGeneratedUpToDate() {
  try {
    await execa('pnpm', ['run', 'generate:battles'], { stdio: 'inherit' });
  } catch (e) {
    console.error('[data-battle-seeds] initial generate failed');
  }
}

async function run() {
  await ensureGeneratedUpToDate();
  // Run both the generator watcher and tsc -w in parallel
  const tsc = execa('pnpm', ['run', '_watch:tsc'], { stdio: 'inherit' });
  const gen = execa('pnpm', ['run', '_watch:gen'], { stdio: 'inherit' });

  const signals = ['SIGINT', 'SIGTERM'];
  for (const s of signals) {
    process.on(s, () => {
      tsc.kill(s);
      gen.kill(s);
    });
  }
  await Promise.race([tsc, gen]);
}

run().catch((e) => {
  console.error('[data-battle-seeds] watch failed', e);
  process.exit(1);
});
