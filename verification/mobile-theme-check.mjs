import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const directory = 'verification/mobile-theme';
await fs.mkdir(directory, { recursive: true });
const routes = ['/docs', '/docs/reference/search', '/docs/search/quickstart', '/docs/admin/pricing', '/docs/changelog'].filter(route => !process.env.CHECK_ROUTE || route === process.env.CHECK_ROUTE);
const modes = [
  { name: 'mobile-light', width: 390, height: 844, colorScheme: 'light' },
  { name: 'desktop-dark', width: 1512, height: 982, colorScheme: 'dark' },
].filter(mode => !process.env.CHECK_MODE || mode.name === process.env.CHECK_MODE);
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const results = [];
const prior = process.argv.includes('--reuse-production')
  ? JSON.parse(await fs.readFile(directory + '/report.json', 'utf8'))
  : [];

for (const mode of modes) {
  const context = await browser.newContext({ viewport: { width: mode.width, height: mode.height }, colorScheme: mode.colorScheme, deviceScaleFactor: 1 });
  for (const route of routes) {
    const result = { route, mode: mode.name, production: null, local: null };
    for (const [site, base] of [['production', 'https://exa.ai'], ['local', 'http://localhost:3000']]) {
      const cached = prior.find(item => item.route === route && item.mode === mode.name);
      if (site === 'production' && cached?.production && !cached.production.error) {
        result.production = cached.production;
        continue;
      }
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForSelector('h1', { timeout: 20000 });
        await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 4000))]));
        await page.waitForTimeout(1200);
        const name = mode.name + '-' + route.replaceAll('/', '-').replace(/^-/, '') + '-' + site;
        const file = directory + '/' + name + '.png';
        await page.screenshot({ path: file });
        result[site] = await page.evaluate(() => ({
          title: document.querySelector('h1')?.innerText,
          dark: document.documentElement.classList.contains('dark'),
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          overflowingElements: [...document.querySelectorAll('body *')].filter(element => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.right > innerWidth + 1 && getComputedStyle(element).position === 'fixed';
          }).map(element => ({ tag: element.tagName, id: element.id, classes: element.className, right: element.getBoundingClientRect().right })),
          brokenVisibleImages: [...document.images].filter(image => {
            const rect = image.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.top < innerHeight && rect.bottom > 0 && (!image.complete || image.naturalWidth === 0);
          }).map(image => image.src),
          geometry: Object.fromEntries(['#header', '#header h1', '#content-area', '#sidebar', '#table-of-contents'].map(selector => {
            const element = document.querySelector(selector);
            const rect = element?.getBoundingClientRect();
            return [selector, rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null];
          })),
        }));
        Object.assign(result[site], { file, errors });
      } catch (error) {
        result[site] = { error: error.message, errors };
      }
      await page.close();
    }
    result.deltas = {};
    for (const [selector, a] of Object.entries(result.production.geometry || {})) {
      const b = result.local.geometry?.[selector];
      if (!a || !b) continue;
      for (const axis of ['x', 'y', 'width', 'height']) {
        if (selector === '#content-area' && axis === 'height') continue;
        const delta = b[axis] - a[axis];
        if (Math.abs(delta) > 1) result.deltas[selector + ' ' + axis] = Math.round(delta * 100) / 100;
      }
    }
    results.push(result);
    await fs.writeFile(directory + '/report.json', JSON.stringify(results, null, 2) + '\n');
    console.log(mode.name, route, JSON.stringify({ deltas: result.deltas, production: result.production.error, local: result.local.error, overflow: result.local.horizontalOverflow, broken: result.local.brokenVisibleImages }));
  }
  await context.close();
}
await browser.close();
await fs.writeFile(directory + '/comparison.html', '<!doctype html><meta charset="utf-8"><title>Mobile and dark mode comparisons</title><style>body{font:15px system-ui;background:#ddd;margin:24px}section{margin:32px 0}article{display:flex;gap:16px;align-items:start}figure{margin:0;width:50%}img{width:100%;height:auto}figcaption{font-weight:bold;padding:8px;background:white}</style>' + results.map(result => '<section><h2>' + result.mode + ': ' + result.route + '</h2><article>' + ['production', 'local'].map(site => '<figure><figcaption>' + site + '</figcaption><img src="' + result[site].file?.split('/').pop() + '"></figure>').join('') + '</article></section>').join(''));
