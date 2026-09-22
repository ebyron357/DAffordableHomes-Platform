import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const SKILLS_ROOT = '.agents/skills';
const INSTALLER = 'install.sh | sh';
const PERMISSION = /install it only after (?:asking the user's )?permission/;

function skillFiles() {
  if (!existsSync(SKILLS_ROOT)) return [];
  return readdirSync(SKILLS_ROOT)
    .map((name) => join(SKILLS_ROOT, name, 'SKILL.md'))
    .filter((file) => existsSync(file));
}

test('vendored skills never instruct an unreviewed remote install', () => {
  const files = skillFiles();
  assert.ok(files.length > 0, 'expected vendored skills to be present');

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    if (!source.includes(INSTALLER)) continue;

    // Reinstalling the bundle can reintroduce the upstream wording, which pipes a
    // network-fetched script straight into a shell with no permission gate.
    assert.match(
      source,
      PERMISSION,
      `${file} pipes a remote installer into a shell without requiring permission`
    );
  }
});

test('vendored skills keep privileged credentials out of the repository', () => {
  for (const file of skillFiles()) {
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /HIGGSFIELD_(?:API_KEY|TOKEN|SECRET)\s*=\s*\S/);
  }
});
