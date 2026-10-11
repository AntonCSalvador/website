import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { copyFileSync, rmSync } from 'node:fs';
import { chromium, type Page } from '@playwright/test';

const baseURL = process.env.GALLERY_TEST_URL ?? 'http://127.0.0.1:4322/';
const fixturePage = new URL('../src/pages/gallery-browser-fixture.astro', import.meta.url);
const fixtureImage = new URL('../public/__gallery-test.svg', import.meta.url);

before(() => {
  copyFileSync(new URL('./fixtures/gallery.astro.txt', import.meta.url), fixturePage);
  copyFileSync(new URL('./fixtures/gallery.svg', import.meta.url), fixtureImage);
});
after(() => {
  rmSync(fixturePage, { force: true });
  rmSync(fixtureImage, { force: true });
});

async function openFixture(page: Page) {
  await page.goto(new URL('gallery-browser-fixture/', baseURL).href);
  await page.locator('[data-photo-gallery="boston"] .photo-link').waitFor();
}

// Removing showModal, cancel handling, or opener focus restoration breaks the real gallery.
test('thumbnail opens a modal photo and Escape restores focus to its thumbnail', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await openFixture(page);
    const gallery = page.locator('[data-photo-gallery="boston"]');
    const link = gallery.locator('.photo-link');
    await link.click();
    assert.equal(await gallery.locator('dialog').isVisible(), true);
    assert.equal(await gallery.locator('dialog').evaluate((dialog: HTMLDialogElement) => dialog.open), true);
    assert.equal(await gallery.locator('dialog').evaluate((dialog) => dialog.matches(':modal')), true);
    assert.equal(await gallery.locator('.photo-enlarged').getAttribute('alt'), 'Synthetic green rectangle for browser testing');
    assert.match(await gallery.locator('.photo-caption').innerText(), /not a travel photo/);
    assert.equal(await gallery.locator('.photo-close').evaluate((button) => button === document.activeElement), true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector<HTMLDialogElement>('[data-photo-gallery="boston"] dialog')!.open);
    assert.equal(await link.evaluate((element) => element === document.activeElement), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  } finally { await browser.close(); }
});

// Swallowing image errors or hiding the close control would strand visitors in a broken photo.
test('failed image has a polite recovery message and a working close control', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    await openFixture(page);
    const gallery = page.locator('[data-photo-gallery="boston"]');
    await gallery.locator('.photo-link').evaluate((link) => link.setAttribute('href', '/missing-gallery-test.jpg'));
    await gallery.locator('.photo-link').click();
    assert.equal(await gallery.locator('dialog').isVisible(), true);
    await gallery.getByRole('status').waitFor({ state: 'visible' });
    assert.match(await gallery.getByRole('status').innerText(), /couldn't load/);
    assert.equal(await gallery.locator('.photo-enlarged').isVisible(), false);
    await gallery.getByRole('button', { name: 'Close photo' }).click();
    assert.equal(await gallery.locator('dialog').evaluate((dialog: HTMLDialogElement) => dialog.open), false);
    assert.equal(await gallery.locator('.photo-link').evaluate((link) => link === document.activeElement), true);
  } finally { await browser.close(); }
});

// Retaining a modal after its actual travel panel is hidden leaves stale trip content on screen.
test('changing the active trip closes a photo belonging to the previous panel', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    await openFixture(page);
    // Move the rendered production fixture into the real static travel panel.
    await page.evaluate(() => document.querySelector('#trip-boston')!.append(document.querySelector('#test-fixtures [data-photo-gallery="boston"]')!));
    await page.locator('.destination-list [data-trip-select="boston"]').click();
    assert.match(await page.locator('.trip-selection-status').innerText(), /1 photo/);
    const gallery = page.locator('#trip-boston [data-photo-gallery]');
    await gallery.locator('.photo-link').click();
    assert.equal(await gallery.locator('dialog').isVisible(), true);
    // Native modal content is inert; this represents an external/programmatic trip change.
    await page.locator('.destination-list [data-trip-select="iceland"]').evaluate((control: HTMLAnchorElement) => control.click());
    await page.waitForFunction(() => !document.querySelector<HTMLDialogElement>('#trip-boston dialog')!.open);
    assert.equal(await page.locator('#trip-iceland').isVisible(), true);
    assert.equal(await gallery.locator('.photo-link').evaluate((link) => link === document.activeElement), false);
  } finally { await browser.close(); }
});

// Empty or source-less metadata must not launch an unusable dialog.
test('empty galleries have no launch controls and valid photos remain links without JavaScript', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await openFixture(page);
    for (const id of ['empty', 'missing-source']) {
      const gallery = page.locator(`[data-photo-gallery="${id}"]`);
      assert.match(await gallery.innerText(), /Photos coming soon/);
      assert.equal(await gallery.locator('a, button, dialog').count(), 0);
    }
    await page.locator('[data-photo-gallery="boston"] .photo-link').click();
    assert.equal(new URL(page.url()).pathname, '/__gallery-test.svg');
  } finally { await browser.close(); }
});
