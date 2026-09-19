import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 1512, height: 982 } });
const page = await context.newPage();
const checks = [];
const errors = [];
page.on('pageerror', error => errors.push(error.message));

await page.goto('http://localhost:3000/docs', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.docs-home');
const home = await page.evaluate(() => ({
  radios: [...document.querySelectorAll('.docs-home input[type="radio"]')].map(input => ({ id: input.id, name: input.name, checked: input.checked })),
  images: [...document.querySelectorAll('.docs-home img')].map(image => ({ src: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0 })),
  cards: [...document.querySelectorAll('.docs-api-card')].map(card => card.getAttribute('href')),
}));
checks.push({ name: 'Homepage image assets and interactive tab controls', ...home });
const homeRadio = page.locator('.docs-home input[type="radio"]').last();
if (await homeRadio.count()) {
  const id = await homeRadio.getAttribute('id');
  const label = page.locator(`label[for="${id}"]`).first();
  if (await label.isVisible()) {
    await label.click();
    checks.push({ name: 'Homepage language control changes selected state', passed: await homeRadio.isChecked() });
  }
}

await page.goto('http://localhost:3000/docs/search/quickstart', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('h1');
const tabs = page.getByRole('tab', { name: 'JavaScript', exact: true });
if (await tabs.count()) {
  await tabs.first().click();
  checks.push({ name: 'Search quickstart JavaScript code tab', passed: (await tabs.first().getAttribute('aria-selected')) === 'true' });
} else {
  const button = page.getByText('JavaScript', { exact: true }).first();
  await button.click();
  checks.push({ name: 'Search quickstart JavaScript code tab', passed: await page.locator('pre:visible').first().innerText().then(text => text.includes('import Exa')) });
}

for (const [route, expected] of [
  ['/docs/reference/search', 'Search'],
  ['/docs/websets/api/websets/create-a-webset', 'Create a webset'],
  ['/docs/reference/team-management/create-api-key', 'Create API Key'],
]) {
  await page.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1');
  const title = await page.locator('h1').innerText();
  checks.push({ name: 'Native API rendering ' + route, title, expected, codeBlocks: await page.locator('pre').count(), body: (await page.locator('body').innerText()).slice(-900) });
}

await fs.writeFile('verification/content-interactions.json', JSON.stringify({ checks, errors }, null, 2) + '\n');
console.log(JSON.stringify({ checks, errors }, null, 2));
await browser.close();
