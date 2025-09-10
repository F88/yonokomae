#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'data/battle-seeds/src/battle');
const TARGET_EXT = '.ja.ts';
const MAX_LEN = 100; // threshold for splitting

/** Recursively collect files under dir matching .ja.ts */
function collectFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collectFiles(p, out);
    else if (e.isFile() && e.name.endsWith(TARGET_EXT)) out.push(p);
  }
  return out;
}

function splitIntoSegments(text) {
  const breakers = new Set(['。', '！', '？', '!', '?']);
  const segments = [];
  let buf = '';
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    buf += ch;
    if (breakers.has(ch)) {
      segments.push(buf);
      buf = '';
    }
  }
  if (buf.trim() !== '') segments.push(buf);
  return segments.map((s) => s.trim());
}

function processFile(filePath) {
  const orig = fs.readFileSync(filePath, 'utf8');
  const lines = orig.split(/\r?\n/);
  let changed = false;

  // Helper to determine if a value is already concatenated
  const isConcatenatedBlock = (startIdx) => {
    for (let k = startIdx; k < Math.min(lines.length, startIdx + 6); k += 1) {
      if (lines[k].includes('+')) return true;
      if (lines[k].trim().endsWith("',") || lines[k].trim().endsWith('",')) return false;
    }
    return false;
  };

  // Process keys in order of likelihood
  const keys = ['overview', 'scenario', 'description'];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const keyMatch = line.match(/^(\s*)(overview|scenario|description):\s*$/);
    if (!keyMatch) continue;
    const indent = keyMatch[1] || '';
    const key = keyMatch[2];

    // Next line should start the string
    const j = i + 1;
    if (j >= lines.length) continue;
    const next = lines[j];
    const strStart = next.match(/^(\s*)'([\s\S]*)$/);
    if (!strStart) continue;

    // If already concatenated, skip this block
    if (isConcatenatedBlock(j)) continue;

    // Find closing line with ', at the end
    let end = j;
    let literal = '';
    let found = false;
    for (; end < lines.length; end += 1) {
      const t = lines[end];
      literal += (end === j ? t.trimStart() : t.trim()) + '\n';
      if (t.trim().endsWith("',")) {
        found = true;
        break;
      }
    }
    if (!found) continue;

    // Extract between first ' and ending ',
    const firstQuote = literal.indexOf("'");
    const lastQuote = literal.lastIndexOf("',");
    if (firstQuote === -1 || lastQuote === -1 || lastQuote <= firstQuote) continue;
    const value = literal.slice(firstQuote + 1, lastQuote);

    if (value.length <= MAX_LEN) {
      i = end; // skip ahead
      continue;
    }

    const segs = splitIntoSegments(value);
    if (segs.length <= 1) {
      i = end;
      continue;
    }

    // Build replacement block
    const strIndent = lines[j].match(/^(\s*)/)[1] || indent + '  ';
    const pieces = segs.map((s, idx) => {
      const isLast = idx === segs.length - 1;
      const quoted = `'${s}'`;
      return strIndent + (isLast ? quoted + ',' : quoted + ' +');
    });

    // Replace lines j..end with pieces
    lines.splice(j, end - j + 1, ...pieces);
    changed = true;
    i = j + pieces.length - 1; // move index forward
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
  }
  return changed;
}

function main() {
  const files = collectFiles(ROOT);
  let count = 0;
  for (const f of files) {
    const c = processFile(f);
    if (c) count += 1;
  }
  console.log(`Processed ${files.length} files. Modified ${count} files.`);
}

main();
