import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { writeFileSync, rmSync } from 'node:fs';
import { chromium } from '@playwright/test';

const baseURL = process.env.TRAVEL_TEST_URL ?? 'http://127.0.0.1:4322/';
const project = new URL('../src/content/projects/future-browser-fixture.md', import.meta.url);

before(() => writeFileSync(project, `---
title: Future project fixture
summary: A separate project with its own account.
role: Builder
order: 99
technologies: [TypeScript]
---
This is test content, never a published project.
`));
after(() => rmSync(project, { force: true }));

// A catch-all Rewala branch would invent results for a newly added project.
test('a new project uses its own summary rather than another project’s results', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    await page.goto(baseURL);
    const row = page.locator('.project-row').filter({ has: page.getByRole('heading', { name: 'Future project fixture' }) });
    await row.waitFor();
    assert.match(await row.innerText(), /A separate project with its own account/);
    assert.doesNotMatch(await row.innerText(), /300\+|11,000|loyalty platform/);
  } finally { await browser.close(); }
});

// A shared fixed h3 skips a level on the standalone blog index.
test('writing empty state fits the heading hierarchy on both routes', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    await page.goto(new URL('blog/', baseURL).href);
    assert.equal(await page.locator('.writing-empty :is(h2,h3)').evaluate((heading) => heading.tagName), 'H2');
    await page.goto(baseURL);
    assert.equal(await page.locator('.writing-empty :is(h2,h3)').evaluate((heading) => heading.tagName), 'H3');
  } finally { await browser.close(); }
});
