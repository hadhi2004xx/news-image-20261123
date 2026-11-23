// Renders front.html to entry.png at exactly 1024x1024 with headless Chromium.
import { chromium } from '/home/hatch/workspace/ubh/tools/pw/node_modules/playwright-core/index.mjs';

const exe = '/home/hatch/workspace/ubh/tools/pw-browsers/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell';
const out = process.argv[2] ?? 'entry.png';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
await page.goto(new URL('./front.html', import.meta.url).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const dims = await page.evaluate(() => ({ sw: document.body.scrollWidth, sh: document.body.scrollHeight }));
console.log('body scroll size:', JSON.stringify(dims));
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log('wrote', out);
