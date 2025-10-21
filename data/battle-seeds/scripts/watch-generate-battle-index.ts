import chokidar from 'chokidar';
import { execa } from 'execa';
import path from 'path';

async function runGenerate() {
  try {
    const p = execa('pnpm', ['run', 'generate:battles'], {
      stdio: 'inherit',
    });
    await p;
  } catch (err) {
    console.error('[watch] generate:battles failed:', err);
  }
}

async function main() {
  const dir = path.resolve(process.cwd(), 'src/battle');
  console.log(`[watch] watching ${dir} for battle seed changes...`);
  await runGenerate();

  const watcher = chokidar.watch(dir, {
    ignored: /(^|[/\\])__generated[/\\]/,
    ignoreInitial: true,
    persistent: true,
  });

  let isGenerating = false;
  watcher.on('all', async (event: string, file: string) => {
    if (!/\.ja\.ts$/.test(file)) return;
    if (isGenerating) {
      console.log('[watch] Generation is already in progress. Skipping.');
      return;
    }

    console.log(`[watch] ${event}: ${file}`);
    isGenerating = true;

    try {
      await runGenerate();
    } finally {
      isGenerating = false;
    }
  });
}

main().catch((e) => {
  console.error('[watch] fatal', e);
  process.exit(1);
});
