import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const browser = await chromium.launch({executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true});
const context = await browser.newContext({viewport: {width: 1512, height: 982}, colorScheme: 'light', permissions: ['clipboard-read', 'clipboard-write']});
const page = await context.newPage();
page.setDefaultTimeout(15000);
const checks = [], errors = [];
page.on('pageerror', error => errors.push(error.message));
const check = async (name, action) => {
  try { const detail = await action(); checks.push({name, passed: true, detail}); }
  catch (error) { checks.push({name, passed: false, error: error.message}); }
  console.log(JSON.stringify(checks.at(-1)));
};
const assert = (condition, message) => { if (!condition) throw Error(message); };
const goto = async route => {
  await page.goto('http://localhost:3000' + route, {waitUntil: 'domcontentloaded', timeout: 90000});
  await page.locator('h1').waitFor();
  await page.waitForTimeout(1000);
};

await check('Homepage radio tabs switch visible language and API examples', async () => {
  await goto('/docs');
  const outcomes = [];
  for (const name of ['docs-home-lang', 'docs-home-api']) {
    const radios = page.locator(`input[name="${name}"]`);
    assert(await radios.count() > 1, `${name} radios missing`);
    for (let i = 0; i < await radios.count(); i++) {
      const radio = radios.nth(i), id = await radio.getAttribute('id');
      await page.locator(`label[for="${id}"]`).first().click();
      assert(await radio.isChecked(), `${id} did not become checked`);
      outcomes.push(id);
    }
  }
  return outcomes;
});

await check('Local full-text search opens, finds text, and navigates with keyboard', async () => {
  await goto('/docs/search/quickstart');
  await page.locator('.docs-sidebar-search').first().click();
  const input = page.locator('.local-search-input');
  await input.fill('snapshot');
  await page.locator('.local-search-result').first().waitFor();
  const first = await page.locator('.local-search-result').first().innerText();
  assert(first.includes('Snapshot'), `Unexpected result: ${first}`);
  await input.press('Enter');
  await page.waitForURL('**/docs/search/snapshot');
  return first;
});

await check('Search shortcut, empty result state, and Escape', async () => {
  await goto('/docs/search/snapshot');
  await page.keyboard.press('Meta+k');
  const input = page.locator('.local-search-input');
  await input.fill('zzzznotanexadoc987654321');
  await page.locator('.local-search-empty').waitFor();
  await input.press('Escape');
  assert(!await page.locator('.local-search-dialog').isVisible(), 'Escape did not close dialog');
  return 'No results state displayed; Escape closed dialog';
});

await check('Bottom search launcher opens the local index', async () => {
  const launcher = page.locator('[data-assistant-bar] [data-local-search-bound]');
  await launcher.click();
  await page.locator('.local-search-input').waitFor();
  await page.locator('.local-search-input').press('Escape');
  await launcher.focus();
  await launcher.press('Enter');
  await page.locator('.local-search-input').waitFor();
  await page.locator('.local-search-input').press('Escape');
  return 'Native bottom bar opens local search with pointer and keyboard';
});

await check('Quickstart JavaScript code tab and clipboard copy work', async () => {
  await goto('/docs/search/quickstart');
  const tab = page.getByRole('tab', {name: 'JavaScript', exact: true}).first();
  await tab.click();
  const code = await page.locator('pre:visible').first().innerText();
  assert(code.includes('import Exa'), 'JavaScript code not displayed');
  await page.getByRole('button', {name: 'Copy the contents from the code block', exact: true}).filter({visible: true}).first().click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  assert(copied.includes('import Exa'), 'Clipboard content missing JavaScript sample');
  return {codeLength: copied.length};
});

await check('Theme control switches to dark mode', async () => {
  await page.getByRole('button', {name: 'Change theme preference'}).click();
  await page.getByText('Dark', {exact: true}).click();
  assert(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'Dark class missing');
  await page.getByRole('button', {name: 'Change theme preference'}).click();
  await page.getByText('Light', {exact: true}).click();
});

for (const route of ['/docs/reference/search', '/docs/websets/api/websets/create-a-webset', '/docs/reference/team-management/create-api-key']) {
  await check('Native API schema and examples ' + route, async () => {
    await goto(route);
    const body = await page.locator('body').innerText();
    assert(body.includes('Body') || body.includes('Authorizations'), 'Native API schema not found');
    assert(await page.locator('pre').count() > 0, 'Native API code examples missing');
    return {title: await page.locator('h1').innerText(), codeBlocks: await page.locator('pre').count()};
  });
}

await check('Agent example spreadsheet switches all seven output tabs', async () => {
  await goto('/docs/agent/examples');
  const radios = page.locator('input[name="agent-output-preview"]');
  assert(await radios.count() === 7, 'Expected seven example output tabs');
  for (let i = 0; i < await radios.count(); i++) {
    const radio = radios.nth(i), id = await radio.getAttribute('id');
    await page.locator(`label[for="${id}"]`).click();
    assert(await radio.isChecked(), `${id} failed to become active`);
  }
});

await check('Mobile navigation and mobile search are usable', async () => {
  await page.setViewportSize({width: 390, height: 844});
  await goto('/docs/search/quickstart');
  const navigation = page.getByRole('button', {name: /^Navigation/});
  await navigation.click();
  const link = page.locator('[data-base-ui-portal] a[href="/docs/search/deep-search"]').filter({visible: true}).first();
  await link.click();
  await page.waitForURL('**/docs/search/deep-search');
  await page.locator('#search-bar-entry-mobile').click();
  await page.locator('.local-search-input').fill('billing');
  await page.locator('.local-search-result').first().waitFor();
  assert((await page.locator('.local-search-result').first().innerText()).includes('Billing'), 'Mobile search result mismatch');
});

await fs.writeFile('verification/interaction-audit.json', JSON.stringify({checks, errors, passed: checks.every(check => check.passed)}, null, 2) + '\n');
await browser.close();
if (checks.some(check => !check.passed)) process.exitCode = 1;
