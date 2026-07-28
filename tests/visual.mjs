import { chromium } from 'file:///C:/Users/usu_compras12/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const output = 'C:\\Users\\usu_compras12\\.codex\\visualizations\\2026\\07\\28\\019faa1f-3f01-7e42-8d41-16e495934371';
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await desktop.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
await desktop.screenshot({ path: `${output}\\aprova360-home.png`, fullPage: true });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await mobile.goto('http://127.0.0.1:8080/onboarding.html', { waitUntil: 'networkidle' });
await mobile.screenshot({ path: `${output}\\aprova360-onboarding-mobile.png`, fullPage: true });
await mobile.goto('http://127.0.0.1:8080/dashboard.html', { waitUntil: 'networkidle' });
await mobile.screenshot({ path: `${output}\\aprova360-dashboard-mobile.png`, fullPage: true });
await browser.close();
console.log('VISUALS_OK');
