import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from '@playwright/test';

const baseURL = process.env.TRAVEL_TEST_URL ?? 'http://127.0.0.1:4322/';

// Delaying the content swap until an animation ends would leave the wrong trip selected.
test('rapid destination changes select the latest trip immediately and keep it selected', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(baseURL);
    const travel = page.locator('#travel');
    await travel.getByText('Boston, Massachusetts', { exact: true }).click();
    await travel.getByText('Toronto, Ontario', { exact: true }).click();
    await travel.getByRole('button', { name: 'Iceland', exact: true }).click();
    assert.equal(await travel.getAttribute('data-selected-trip'), 'iceland');
    assert.equal(await page.locator('#trip-iceland').isVisible(), true);
    assert.equal(await page.locator('#trip-toronto').isVisible(), false);
    // Dispatch within the same browser task: content must update before any animation or timer can finish.
    const immediate = await travel.evaluate((root) => {
      for (const id of ['boston', 'toronto', 'iceland']) {
        root.querySelector<HTMLAnchorElement>(`.destination-list [data-trip-select="${id}"]`)!.click();
      }
      return { selected: (root as HTMLElement).dataset.selectedTrip, panelHidden: root.querySelector<HTMLElement>('#trip-iceland')!.hidden };
    });
    assert.deepEqual(immediate, { selected: 'iceland', panelHidden: false });
    await page.waitForTimeout(650);
    assert.equal(await travel.getAttribute('data-selected-trip'), 'iceland');
    assert.equal(await page.locator('#trip-iceland').isVisible(), true);
  } finally {
    await browser.close();
  }
});

// A missing keyboard handler, mismatched pin/list state, or motion in reduced mode breaks access.
test('pins and list work by keyboard, overview resets the map, and reduced motion stays still', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(baseURL);
    for (const id of ['boston', 'cincinnati', 'orlando', 'toronto', 'iceland']) {
      const pin = page.locator(`.map-pin[data-trip-select="${id}"]`);
      await pin.focus();
      await page.keyboard.press('Space');
      assert.equal(await page.locator('#travel').getAttribute('data-selected-trip'), id);
      assert.equal(await page.locator(`#trip-${id}`).isVisible(), true);
      assert.equal(await page.locator(`.destination-list [data-trip-select="${id}"]`).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator(`#trip-${id} .hiker`).evaluate((element) => element.getAnimations().length), 0);
      const list = page.locator(`.destination-list [data-trip-select="${id}"]`);
      await list.focus();
      await page.keyboard.press('Enter');
      assert.equal(await pin.getAttribute('aria-pressed'), 'true');
    }
    await page.getByRole('button', { name: 'Show all destinations' }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#travel').getAttribute('data-map-view'), 'overview');
    assert.equal(await page.locator('#trip-iceland').isVisible(), true);
    // A selected link color below 4.5:1 loses contrast against the travel surface.
    const contrast = await page.locator('.destination-list [aria-pressed="true"]').evaluate((link) => {
      const luminance = (color: string) => {
        const channels = color.match(/\d+/g)!.slice(0, 3).map((value) => {
          const channel = Number(value) / 255;
          return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
        });
        return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
      };
      const foreground = luminance(getComputedStyle(link).color);
      const background = luminance(getComputedStyle(document.querySelector('.travel-section')!).backgroundColor);
      return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05);
    });
    assert.ok(contrast >= 4.5, `Selected destination link contrast is ${contrast.toFixed(3)}:1`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  } finally {
    await browser.close();
  }
});

// Hiding panels before enhancement would make real destinations unreachable without JavaScript.
test('every destination and empty gallery remains reachable without JavaScript', async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await page.goto(baseURL);
    for (const id of ['boston', 'cincinnati', 'orlando', 'toronto', 'iceland']) {
      await page.locator(`.destination-list a[href="#trip-${id}"]`).click();
      assert.equal(await page.locator(`#trip-${id}`).isVisible(), true);
      assert.match(await page.locator(`#trip-${id}`).innerText(), /Photos coming soon/);
    }
    assert.equal(await page.getByRole('button', { name: 'Show all destinations' }).isVisible(), false);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  } finally {
    await browser.close();
  }
});
