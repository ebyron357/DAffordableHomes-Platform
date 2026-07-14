import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const extensions = new Set(['.ts', '.tsx', '.mjs', '.css']);
const ignored = new Set(['node_modules', '.next', 'dist']);

function extensionOf(path) {
  const match = /\.[^.]+$/.exec(path);
  return match ? match[0] : '';
}

function collectFiles(directory) {
  const entries = readdirSync(directory);
  const files = [];
  for (const entry of entries) {
    if (ignored.has(entry)) continue;
    const path = join(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      files.push(...collectFiles(path));
    } else if (extensions.has(extensionOf(path))) {
      files.push(path);
    }
  }
  return files;
}

for (const file of [...collectFiles(join(repoRoot, 'apps')), ...collectFiles(join(repoRoot, 'packages'))]) {
  const source = readFileSync(file, 'utf8');
  assert.equal(source.includes('\t'), false, `${file} contains tabs`);
  assert.equal(/<<<<<<<|=======|>>>>>>>/.test(source), false, `${file} contains merge conflict markers`);
  assert.equal(/console\.log\(/.test(source), false, `${file} contains console.log`);
  assert.equal(/TODO|FIXME/.test(source), false, `${file} contains unresolved work markers`);
}
