// Test de fumée : ouvre index.html dans Chromium, vérifie l'absence d'erreurs
// et que chaque candidat produit une trajectoire de dette finie sur tout l'horizon.
// Usage : npm i -D playwright && npx playwright install chromium && node tests/smoke.js
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(String(e)));
  await page.route(/^https?:\/\//, r => r.request().url().includes("cdnjs") ? r.continue() : r.abort());
  await page.goto("file://" + path.resolve(__dirname, "..", "index.html"));
  await page.waitForTimeout(1500);
  const res = await page.evaluate(() => CANDS0.map(c => {
    const o = simulate(c, "credible", BASE0);
    const d = o.debt || o.d || [];
    return { id: c.id, n: d.length, ok: d.length > 0 && d.every(Number.isFinite), last: d[d.length - 1] };
  }));
  await browser.close();
  console.table(res);
  // Sans réseau, Chart.js (CDN) ne charge pas : on le signale sans échouer.
  const offline = errors.filter(e => e.includes("Chart is not defined"));
  if (offline.length) console.warn("Chart.js non chargé (pas d'accès au CDN) : graphique non testé.");
  errors.splice(0, errors.length, ...errors.filter(e => !offline.includes(e)));
  if (errors.length) { console.error("Erreurs JS :", errors); process.exit(1); }
  if (!res.every(r => r.ok)) { console.error("Trajectoire non finie"); process.exit(1); }
  console.log("OK");
})();
