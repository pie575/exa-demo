import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const manifest = JSON.parse(await fs.readFile('source-snapshot/manifest.json', 'utf8'));
const entries = [];
for (const page of manifest.pages) {
  const content = await fs.readFile(page.path, 'utf8');
  if (/^openapi:/m.test(content)) entries.push(page);
}
await fs.mkdir('verification/api-content', {recursive: true});
const browser = await chromium.launch({executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true});
let next = 0;
const comparisons = [];
async function worker() {
  const context = await browser.newContext({viewport: {width: 1512, height: 982}, colorScheme: 'light'});
  const page = await context.newPage();
  while (next < entries.length) {
    const entry = entries[next++];
    const route = new URL(entry.source).pathname;
    const result = {route};
    for (const [name, base] of [['production', 'https://exa.ai'], ['local', 'http://localhost:3000']]) {
      try {
        if (name === 'production' && process.argv.includes('--reuse-production')) {
          const previous = JSON.parse(await fs.readFile(`verification/api-content/${route.replaceAll('/', '_')}.json`, 'utf8'));
          result.production = previous.production;
          continue;
        }
        const response = await page.goto(base + route, {waitUntil: 'domcontentloaded', timeout: 60000});
        await page.locator('#content-area').waitFor({timeout: 15000});
        await page.waitForTimeout(500);
        result[name] = {
          status: response.status(),
          text: await page.locator('#content-area').innerText(),
          headings: await page.locator('#content-area h1, #content-area h2, #content-area h3, #content-area h4').allTextContents(),
        };
      } catch (error) { result[name] = {error: error.message}; }
    }
    const normalize = text => (text || '').replace(/\s+/g, ' ').trim();
    result.identical = normalize(result.production.text) === normalize(result.local.text);
    result.productionLength = result.production.text?.length;
    result.localLength = result.local.text?.length;
    comparisons.push(result);
    await fs.writeFile(`verification/api-content/${route.replaceAll('/', '_')}.json`, JSON.stringify(result, null, 2) + '\n');
    console.log(`${comparisons.length}/${entries.length} ${route} ${result.identical ? 'identical' : `difference ${result.productionLength}/${result.localLength}`}`);
  }
  await context.close();
}
await Promise.all([worker(), worker(), worker()]);
comparisons.sort((a, b) => a.route.localeCompare(b.route));
await fs.writeFile('verification/api-content-audit.json', JSON.stringify({count: comparisons.length, identical: comparisons.filter(x => x.identical).length, comparisons}, null, 2) + '\n');
await browser.close();
