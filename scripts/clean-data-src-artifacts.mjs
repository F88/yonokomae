#!/usr/bin/env node
/**
 * Clean up stale compiled artifacts under data package src trees.
 * - Remove .js, .d.ts, .d.ts.map, .js.map found below data/<any>/src recursively
 * - Only affects data packages, not app or packages/*
 */
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const GLOB_DIRS = [
  'data/battle-seeds/src',
  'data/historical-evidence/src',
  'data/news-seeds/src',
];

const removeIfMatch = async (file) => {
  if (
    file.endsWith('.js') ||
    file.endsWith('.d.ts') ||
    file.endsWith('.d.ts.map') ||
    file.endsWith('.js.map')
  ) {
    try {
      await fs.unlink(file);
      process.stdout.write(`[clean] removed ${file}\n`);
    } catch (err) {
      if (err && err.code !== 'ENOENT') {
        process.stderr.write(
          `[clean][warn] failed to remove ${file}: ${err.message}\n`,
        );
      }
    }
  }
};

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    return; // skip missing
  }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full);
    } else if (e.isFile()) {
      await removeIfMatch(full);
    }
  }
}

async function main() {
  for (const rel of GLOB_DIRS) {
    await walk(path.join(ROOT, rel));
  }
}

main().catch((err) => {
  console.error('[clean] failed', err);
  process.exit(1);
});
