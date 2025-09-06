import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

function captureStdout(run: () => Promise<void> | void): Promise<string> {
  return new Promise((resolve) => {
    void (async () => {
      const origWrite = process.stdout.write;
      let buf = '';
      process.stdout.write = (chunk: unknown, encoding?: unknown) => {
        buf +=
          typeof chunk === 'string'
            ? chunk
            : Buffer.from(chunk as string).toString(
                (encoding as BufferEncoding) || 'utf8',
              );
        return true;
      };
      try {
        await run();
      } finally {
        process.stdout.write = origWrite;
        resolve(buf);
      }
    })();
  });
}

const importFresh = async (modulePath: string) => {
  vi.resetModules();
  return import(modulePath);
};

describe('ops CLI TSV exporters', () => {
  const origArgv = process.argv.slice();

  afterEach(() => {
    process.argv = origArgv.slice();
  });

  it('export-usage-examples-to-tsv: writes TSV to stdout when no args', async () => {
    process.argv = ['node', 'export-usage-examples-to-tsv'];
    const out = await captureStdout(async () => {
      await importFresh('../export-usage-examples-to-tsv');
    });
    const lines = out.trim().split(/\r?\n/);
    expect(lines[0]).toBe('title\tdescription');
    expect(lines.length).toBeGreaterThan(1);
  });

  it('export-usage-examples-to-tsv: writes TSV file when path is given', async () => {
    const tmpFile = path.join(os.tmpdir(), `usage-examples-${Date.now()}.tsv`);
    try {
      process.argv = ['node', 'export-usage-examples-to-tsv', tmpFile];
      await importFresh('../export-usage-examples-to-tsv');
      const text = fs.readFileSync(tmpFile, 'utf8');
      const first = text.split(/\r?\n/)[0];
      expect(first).toBe('title\tdescription');
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  it('export-usage-examples-to-tsv: shows help with --help', async () => {
    process.argv = ['node', 'export-usage-examples-to-tsv', '--help'];
    const out = await captureStdout(async () => {
      await importFresh('../export-usage-examples-to-tsv');
    });
    expect(out).toMatch(/Usage:/i);
    expect(out).toMatch(/USAGE_EXAMPLES/i);
  });

  it('export-users-voice-to-tsv: writes TSV to stdout when no args', async () => {
    process.argv = ['node', 'export-users-voice-to-tsv'];
    const out = await captureStdout(async () => {
      await importFresh('../export-users-voice-to-tsv');
    });
    const lines = out.trim().split(/\r?\n/);
    expect(lines[0]).toBe('name\tage\tvoice');
    expect(lines.length).toBeGreaterThan(1);
  });

  it('export-users-voice-to-tsv: writes TSV file when path is given', async () => {
    const tmpFile = path.join(os.tmpdir(), `users-voice-${Date.now()}.tsv`);
    try {
      process.argv = ['node', 'export-users-voice-to-tsv', tmpFile];
      await importFresh('../export-users-voice-to-tsv');
      const text = fs.readFileSync(tmpFile, 'utf8');
      const first = text.split(/\r?\n/)[0];
      expect(first).toBe('name\tage\tvoice');
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  it('export-users-voice-to-tsv: shows help with -h', async () => {
    process.argv = ['node', 'export-users-voice-to-tsv', '-h'];
    const out = await captureStdout(async () => {
      await importFresh('../export-users-voice-to-tsv');
    });
    expect(out).toMatch(/Usage:/i);
    expect(out).toMatch(/USER_VOICES/i);
  });
});
