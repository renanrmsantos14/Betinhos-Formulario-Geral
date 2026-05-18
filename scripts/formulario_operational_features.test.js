const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

function includes(source, value, label = value) {
  assert.ok(source.includes(value), `Esperado: ${label}`);
}

[
  "reviewOverlay",
  "reviewSummaryList",
  "reviewRiskList",
  "confirmSaveButton",
  "cancelReviewButton",
  "riskPanel",
  "riskList",
  "saveLogList",
  "draftStatus",
  "clearDraftButton",
  "bdExistingPassenger",
  "loadPassengerForEdit",
  "updatePassenger"
].forEach((id) => includes(html, `id="${id}"`, `elemento #${id}`));

[
  "function openReviewBeforeSave",
  "function performSave",
  "function buildReviewItems",
  "function renderRiskPanel",
  "function renderSaveLog",
  "function addSaveLog",
  "function persistDraftSnapshot",
  "function restoreDraftSnapshot",
  "function clearDraftSnapshot",
  "async function updatePassenger",
  "function loadPassengerForEdit"
].forEach((signature) => includes(app, signature, signature));

includes(app, "DRAFT_STORE_KEY", "chave de rascunho local");
includes(app, "state.pendingSaveContext", "contexto de salvamento pendente");
includes(app, "passengerPayloadFromForm(false, true)", "edicao limpa campos opcionais no Dataverse");
includes(app, "payload[CONFIG.fields.passageiro.nascimento] = null", "edicao limpa nascimento vazio");

console.log("formulario_operational_features: ok");
