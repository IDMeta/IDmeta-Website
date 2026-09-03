import puppeteer from '/Users/idmeta/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import { mkdir } from 'fs/promises';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath, URL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? '-' + process.argv[3] : '';
const width = Number(process.argv[4] || 1440);
const height = Number(process.argv[5] || 900);
const fullPage = process.argv[6] === 'full';
const clickSelector = process.argv[7];
const settleMs = Number(process.argv[8] || 800);

if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const existing = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.png')) : [];
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const n = nums.length ? Math.max(...nums) + 1 : 1;
const file = join(dir, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(resolve => setTimeout(resolve, settleMs));
if (clickSelector) {
  await page.click(clickSelector);
  await new Promise(resolve => setTimeout(resolve, 350));
}
await page.screenshot({ path: file, fullPage });
await browser.close();
console.log(`Saved: ${file}`);
