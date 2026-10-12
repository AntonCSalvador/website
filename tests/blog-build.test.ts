import assert from 'node:assert/strict';
import { test } from 'node:test';
import { writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// Disabling the loader for zero posts must not disable real posts in the next build.
test('first real post is listed and routed while draft stays unpublished', () => {
  const files = ['published-build-fixture', 'draft-build-fixture'];
  const output = '.astro/blog-build-fixture';
  assert.equal(existsSync(output), false, 'Refuse to overwrite existing test output');
  try {
    for (const [index, id] of files.entries()) {
      writeFileSync(`src/content/blog/${id}.md`, `---
title: ${id}
description: Temporary build verification content.
publicationDate: 2026-10-11
draft: ${index === 1}
---
Temporary article body.
`);
    }
    const build = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', output], { encoding: 'utf8' });
    assert.equal(build.status, 0, build.stdout + build.stderr);
    const index = readFileSync(`${output}/blog/index.html`, 'utf8');
    assert.match(index, /published-build-fixture/);
    assert.doesNotMatch(index, /draft-build-fixture/);
    assert.equal(existsSync(`${output}/blog/published-build-fixture/index.html`), true);
    assert.equal(existsSync(`${output}/blog/draft-build-fixture/index.html`), false);
  } finally {
    for (const id of files) rmSync(`src/content/blog/${id}.md`, { force: true });
    rmSync(output, { recursive: true, force: true });
  }
});
