import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from '@playwright/test';

// Missing preference handling or a resume on intersection would violate the visitor's choice.
test('hero honors reduced motion and preserves an explicit pause across scrolling', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:4321/');
    await page.locator('.motion-toggle').waitFor({ state: 'visible' });
    const hero = page.locator('.hero');
    await page.waitForFunction(() => document.querySelector('.hero')?.getAttribute('data-motion') === 'paused');
    assert.equal(await hero.getAttribute('data-motion'), 'paused');
    assert.equal(await page.locator('.ascii-canvas').count(), 1);
    const snapshot = () => page.locator('.ascii-canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
    const still = await snapshot();
    await page.waitForTimeout(150);
    assert.equal(await snapshot(), still);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => document.querySelector('.hero')?.getAttribute('data-motion') === 'running');
    await page.getByRole('button', { name: 'Next photo' }).click();
    const start = await snapshot();
    await page.waitForTimeout(400);
    assert.notEqual(await snapshot(), start);
    await page.getByRole('button', { name: 'Pause animation' }).click();
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await hero.scrollIntoViewIfNeeded();
    assert.equal(await hero.getAttribute('data-motion'), 'paused');
    await page.getByRole('button', { name: 'Play animation' }).click();
    await page.waitForFunction(() => document.querySelector('.hero')?.getAttribute('data-motion') === 'running');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.hero')?.getAttribute('data-motion') === 'paused');
    await hero.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.hero')?.getAttribute('data-motion') === 'running');
    const before = await page.locator('#hero-title').boundingBox();
    await page.waitForTimeout(400);
    assert.deepEqual(await page.locator('#hero-title').boundingBox(), before);
    await page.getByRole('button', { name: 'Pause animation' }).focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    assert.equal(await page.getByRole('button', { name: 'Pause animation' }).evaluate((button) => getComputedStyle(button).outlineStyle), 'solid');
  } finally {
    await browser.close();
  }
});

// No-JS visitors still get a real, generated ASCII frame and usable introduction.
test('mobile hero remains readable and illustrated without JavaScript', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await page.goto('http://127.0.0.1:4321/');
    assert.equal(await page.locator('.hero').getAttribute('data-motion'), 'paused');
    assert.equal(await page.locator('.ascii-static text').count(), 108);
    assert.equal(await page.locator('.ascii-static text').first().evaluate(el => el.textContent?.length), 144);
    assert.equal(await page.locator('.ascii-static').isVisible(), true);
    const heading = await page.locator('#hero-title').boundingBox();
    assert.ok(heading && heading.x >= 0 && heading.x + heading.width <= 390);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    assert.equal(await page.getByRole('button', { name: /animation/ }).isVisible(), false);
    assert.ok(await page.getByRole('link', { name: 'Explore my work' }).isVisible());
    assert.equal(await page.getByRole('link', { name: 'TFT profile' }).getAttribute('href'), 'https://tactics.tools/player/na/BAGSANDER/2427');
    assert.equal(await page.getByRole('link', { name: 'Fortnite profile' }).getAttribute('href'), 'https://fortnitetracker.com/fortnite/profile/epic/P0NCH0%20GUY/matchmaking/overview');
  } finally {
    await browser.close();
  }
});
