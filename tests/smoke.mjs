import { chromium } from 'file:///C:/Users/usu_compras12/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
});
const paths = [
  'index.html', 'dashboard.html', 'curso.html', 'capitulo.html?id=1',
  'capitulo.html?id=2', 'exercicios.html', 'simulados.html',
  'flashcards.html', 'planner.html', 'revisoes.html',
  'caderno-erros.html', 'desempenho.html', 'anotacoes.html',
  'configuracoes.html'
];
const results = [];
for (const path of paths) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(`PAGE: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().includes('fonts.googleapis')) {
      errors.push(`CONSOLE: ${message.text()}`);
    }
  });
  const response = await page.goto(`http://127.0.0.1:8765/${path}`, { waitUntil: 'networkidle' });
  results.push({
    path,
    status: response?.status(),
    title: await page.title(),
    h1: await page.locator('h1').first().textContent().catch(() => null),
    errors
  });
  await page.close();
}

const interaction = await browser.newPage({ viewport: { width: 390, height: 844 } });
const interactionErrors = [];
interaction.on('pageerror', error => interactionErrors.push(error.message));
await interaction.goto('http://127.0.0.1:8765/exercicios.html', { waitUntil: 'networkidle' });
await interaction.locator('[data-question="EST-001"] input[value="1"]').check();
await interaction.locator('[data-action="answer-question"][data-id="EST-001"]').click();
const feedback = await interaction.locator('[data-question="EST-001"] .feedback').textContent();
await interaction.goto('http://127.0.0.1:8765/capitulo.html?id=1', { waitUntil: 'networkidle' });
await interaction.locator('.reflection').first().fill('Conquistar a vaga');
await interaction.waitForTimeout(100);
const savedReflection = await interaction.evaluate(() => JSON.parse(localStorage.getItem('aprovacao_reflections')).q0);
await interaction.locator('[data-action="complete-chapter"]').click();
const reviewCount = await interaction.evaluate(() => JSON.parse(localStorage.getItem('aprovacao_reviews')).length);
await interaction.goto('http://127.0.0.1:8765/flashcards.html', { waitUntil: 'networkidle' });
await interaction.locator('[data-action="flip-card"]').click();
const flipped = await interaction.locator('.flashcard').evaluate(node => node.classList.contains('flipped'));
const mobileOverflow = await interaction.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
results.push({ interaction: { feedback, savedReflection, reviewCount, flipped, mobileOverflow, errors: interactionErrors } });
await interaction.close();
await browser.close();

console.log(JSON.stringify(results, null, 2));
if (results.some(result => result.errors?.length || result.status && result.status !== 200) || interactionErrors.length) {
  process.exit(1);
}
