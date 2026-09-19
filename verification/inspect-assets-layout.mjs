import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const results = [];
const testMargin = process.argv.includes('--test-image-margin');
for (const route of ['admin/team-management', 'integrations/exa-slack']) {
  const pair = { route };
  for (const [site, base] of [['production', 'https://exa.ai'], ['local', 'http://localhost:3000']]) {
    const page = await browser.newPage({ viewport: { width: 1512, height: 982 }, colorScheme: 'light' });
    await page.goto(base + '/docs/' + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
    if (site === 'local' && testMargin) await page.addStyleTag({ content: '#content span.contents > img[src^="/docs/images/"] { margin-block: 0; }' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      const images = [...document.querySelectorAll('#content img')];
      for (const image of images) image.loading = 'eager';
      await Promise.all(images.map(image => image.decode().catch(() => {})));
    });
    await page.waitForTimeout(1500);
    pair[site] = await page.evaluate(() => {
      const rect = element => {
        const r = element.getBoundingClientRect(), css = getComputedStyle(element);
        return { tag: element.tagName, text: element.innerText?.slice(0, 80), classes: element.className, x: r.x, y: r.y, width: r.width, height: r.height, margin: css.margin, padding: css.padding, display: css.display };
      };
      return {
        area: rect(document.querySelector('#content-area')),
        content: rect(document.querySelector('#content')),
        children: [...document.querySelector('#content').children].map(rect),
        images: [...document.querySelectorAll('#content img')].map(image => ({ ...rect(image), src: image.src, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, parent: rect(image.parentElement) })),
      };
    });
    await page.screenshot({ path: 'verification/' + route.replaceAll('/', '-') + '-' + site + (testMargin ? '-margin-test' : '') + '-full.png', fullPage: true });
    await page.close();
  }
  results.push(pair);
  console.log(route, 'area delta', pair.local.area.height - pair.production.area.height, 'content delta', pair.local.content.height - pair.production.content.height);
  for (let i = 0; i < pair.production.images.length; i++) {
    const a = pair.production.images[i], b = pair.local.images[i];
    console.log('image', i, 'height delta', b?.height - a.height, 'natural', a.naturalWidth, a.naturalHeight, b?.naturalWidth, b?.naturalHeight);
  }
}
await fs.writeFile('verification/assets-layout' + (testMargin ? '-margin-test' : '') + '-report.json', JSON.stringify(results, null, 2));
await browser.close();
