const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

function includes(source, value, label = value) {
  assert.ok(source.includes(value), `Esperado: ${label}`);
}

function excludes(source, value, label = value) {
  assert.ok(!source.includes(value), `Nao esperado: ${label}`);
}

[
  "riskList",
  "saveLogList",
  "draftStatus",
  "confirmSaveButton",
  "bdExistingPassenger"
].forEach((id) => {
  excludes(app, `$("` + id + `")`, `binding fantasma #${id}`);
});

includes(app, "{ value: 202410005, label: \"Pendente\" }", "fallback real de Status de Faturamento");
includes(app, "{ value: 202410000, label: \"Cartao de credito\" }", "fallback real de Forma de Pagamento");
includes(app, "{ value: 202410000, label: \"Guarulhos\" }", "fallback real de Tipo do Servico");
includes(app, "{ value: 202410000, label: \"Basico\" }", "fallback real de Tipo do Veiculo");
excludes(app, "{ value: 1, label: \"Aeroporto ida e volta\" }", "fallback antigo inventado");
excludes(app, "{ value: 30, label: \"Ativo\" }", "fallback antigo inventado para status passageiro");

includes(app, "const MIN_PASSENGER_SEARCH_LENGTH", "limite minimo para busca server-side");
includes(app, "async function searchPassengersServer", "busca server-side de passageiros");
includes(app, "async function ensurePassengersByIds", "carga pontual por ids de passageiros");
excludes(app, "retrieveAll(CONFIG.entities.passageiro, [", "carga inicial de 5000 passageiros");

includes(html, "id=\"passengerMatchOverlay\"", "overlay de possivel duplicidade de passageiro");
includes(app, "function findPassengerDuplicateCandidates", "validacao multipla de duplicidade");
includes(app, "function scorePassengerCandidate", "pontuacao de candidato duplicado");
includes(app, "Certeza que este nao e o passageiro desejado?", "pergunta de confirmacao de duplicidade");
includes(app, "Telefone igual", "validacao por telefone");
includes(app, "Email igual", "validacao por email");
includes(app, "Nome muito parecido", "validacao por nome parecido");
includes(app, "Mesmo cliente", "validacao por cliente");

includes(app, "MAX_FREQUENT_SERVICE_DAYS", "limite para periodo recorrente");
includes(app, "Data de retorno nao pode ser anterior a saida", "validacao retorno antes da saida");
includes(app, "Periodo frequente muito grande", "validacao de recorrencia grande demais");

console.log("formulario_operational_features: ok");
