import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3000/docs', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
const result = await page.evaluate(() => ({
  width: innerWidth,
  html: { client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, overflow: getComputedStyle(document.documentElement).overflowX },
  body: { client: document.body.clientWidth, scroll: document.body.scrollWidth, overflow: getComputedStyle(document.body).overflowX },
  elements: [...document.querySelectorAll('body *')].filter(element => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.right > innerWidth + 1;
  }).map(element => {
    const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
    return { tag: element.tagName, id: element.id, classes: element.className, x: rect.x, y: rect.y, width: rect.width, right: rect.right, overflow: style.overflowX, position: style.position, visibility: style.visibility, display: style.display, html: element.outerHTML.slice(0, 300) };
  }).sort((a, b) => b.right - a.right).slice(0, 30),
}));
await fs.writeFile('verification/mobile-theme/overflow-diagnosis.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await page.screenshot({ path: 'verification/mobile-theme/local-fullpage.png', fullPage: true });
await browser.close();
