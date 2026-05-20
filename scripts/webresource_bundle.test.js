const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "webresource.html");

assert.ok(fs.existsSync(outputPath), "webresource.html deve ser gerado");

const html = fs.readFileSync(outputPath, "utf8");
assert.ok(html.includes("<style>"), "CSS deve estar inline");
assert.ok(html.includes("window.XlsxImportCore"), "core XLSX deve estar inline");
assert.ok(html.includes("function openXlsxImportPicker"), "app.js deve estar inline");
assert.ok(html.includes("id=\"tab-panel-import\""), "aba de importacao deve estar no bundle");
assert.ok(!html.includes("id=\"importReviewOverlay\""), "overlay antigo de importacao nao deve estar no bundle");
assert.ok(html.includes("clienteLabel: \"Embraer\""), "bundle deve fixar Embraer como cliente padrao do import");
assert.ok(html.includes("function persistMockPassengerRecord"), "bundle deve persistir passageiros no mock local");
assert.ok(html.includes("cr40f_idexterno"), "bundle deve conter o campo externo PG");
assert.ok(!html.includes('<link rel="stylesheet" href="styles.css"'), "bundle nao deve depender de styles.css externo");
assert.ok(!html.includes('<script src="app.js"'), "bundle nao deve depender de app.js externo");
assert.ok(!html.includes('<script src="vendor/xlsx.full.min.js"'), "bundle nao deve depender de SheetJS externo");
assert.ok(!html.includes('<script src="scripts/xlsx_import_core.js"'), "bundle nao deve depender do core externo");
assert.ok(!html.includes("<!-- INLINE_"), "bundle nao deve manter placeholders internos");

console.log("webresource_bundle: ok");
