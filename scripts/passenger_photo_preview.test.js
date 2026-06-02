const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

function includes(source, value, label = value) {
  assert.ok(source.includes(value), `Esperado: ${label}`);
}

includes(html, "data-photo-preview-mode=\"confirm\"", "modal de foto deve suportar modo confirmacao");
includes(app, "function openPassengerPhotoViewer", "foto existente deve abrir popup view-only");
includes(app, "function openPassengerPhotoHoverZoom", "hover na foto do pax deve abrir zoom somente com imagem");
includes(app, "function buildPassengerPreviewPhotoHeader", "hover preview do passageiro deve ter header com foto");
includes(app, "const hasPhotoHeader = !!normalizePassengerPhotoUrl(passenger?.fotoUrl);", "header de foto deve depender do link salvo da foto");
includes(app, "if (hasPhotoHeader && (label === \"Nome\" || label === \"Cliente\")) return false;", "nome e cliente nao devem duplicar nas linhas quando header existe");
includes(app, "client.textContent = data.clientName || \"Cliente não informado\";", "header deve mostrar cliente abaixo do nome");
includes(app, "openPassengerPhotoViewer(photoViewerDataFromPassenger", "clique na foto deve abrir viewer com metadados");
includes(app, "if (openLockedPassengerEditPhotoViewer(wrap)) return;", "foto bloqueada no editar pax deve abrir preview em vez de toast");
includes(css, ".passenger-photo-preview-dialog.is-view-only", "modal view-only deve ter estilo proprio");
includes(css, ".passenger-preview-photo-header", "hover preview deve ter header de foto");
includes(css, ".passenger-photo-hover-zoom", "hover da mini foto deve ter zoom flutuante");

console.log("passenger_photo_preview: ok");
