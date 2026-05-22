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
assert.ok(html.includes("split-trecho"), "bundle deve expor acao Split na revisao de importacao");
assert.ok(html.includes("importedTrechoReturnDateTimeLocal"), "bundle deve editar horario previsto de retorno importado");
assert.ok(html.includes("import-decision-panel"), "bundle deve conter painel de decisao operacional da PG");
assert.ok(html.includes("Interpretação da PG"), "bundle deve apresentar interpretacao operacional generica");
assert.ok(html.includes("Multi-coleta"), "bundle deve reconhecer PG com coletas sequenciais");
assert.ok(html.includes("Manter 1 OS"), "bundle deve permitir confirmar OS unica quando nao for espera");
assert.ok(html.includes("É o mesmo carro"), "bundle deve permitir mesclar trechos selecionados da mesma PG");
assert.ok(html.includes("toggle-same-car-selection"), "bundle deve permitir selecionar trechos para merge");
assert.ok(html.includes("merge-same-car"), "bundle deve expor acao de merge mesmo carro");
assert.ok(html.includes("Separar ida/busca"), "bundle deve expor Split com linguagem operacional");
assert.ok(html.includes("keep-waiting"), "bundle deve permitir registrar manter espera");
assert.ok(html.includes("import-timeline"), "bundle deve conter timeline de saida e retorno");
assert.ok(html.includes("Janela da PG"), "bundle deve explicar a janela operacional da PG");
assert.ok(html.includes(".passenger-edit-field textarea.passenger-edit-control"), "bundle deve conter regra dos textareas de passageiro");
assert.ok(html.includes("resize: vertical;"), "bundle deve manter textareas redimensionaveis");
assert.ok(html.includes("max-height: none;"), "bundle deve permitir crescimento vertical dos textareas");
assert.ok(!html.includes(".import-trecho.is-locked [data-import-copy] textarea[readonly]"), "bundle nao pode bloquear pointer events de textarea importado readonly");
assert.ok(!html.includes(".import-trecho.is-duplicated [data-import-copy] textarea[readonly]"), "bundle nao pode bloquear pointer events de textarea duplicado readonly");
assert.ok(!html.includes('<link rel="stylesheet" href="styles.css"'), "bundle nao deve depender de styles.css externo");
assert.ok(!html.includes('<script src="app.js"'), "bundle nao deve depender de app.js externo");
assert.ok(!html.includes('<script src="vendor/xlsx.full.min.js"'), "bundle nao deve depender de SheetJS externo");
assert.ok(!html.includes('<script src="scripts/xlsx_import_core.js"'), "bundle nao deve depender do core externo");
assert.ok(!html.includes("<!-- INLINE_"), "bundle nao deve manter placeholders internos");

console.log("webresource_bundle: ok");
