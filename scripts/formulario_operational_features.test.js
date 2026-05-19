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

function extractFunction(source, name) {
  const match = new RegExp(`function\\s+${name}\\s*\\(`).exec(source);
  assert.ok(match, `Funcao nao encontrada: ${name}`);
  const start = match.index;
  const braceStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Funcao incompleta: ${name}`);
}

function buildPassengerMatcher() {
  const functionNames = [
    "cleanGuid",
    "sameId",
    "normalize",
    "onlyDigits",
    "scorePassengerCandidate",
    "phoneNumbersMatch",
    "phoneNumbersNearlyMatch",
    "emailsProbablySame",
    "splitEmail",
    "nameSimilarity",
    "normalizeName",
    "tokenFuzzyNameScore",
    "stringSimilarity",
    "hammingDistance",
    "damerauLevenshteinDistance",
    "levenshteinDistance"
  ];
  const body = `${functionNames.map((name) => extractFunction(app, name)).join("\n")}
return { scorePassengerCandidate, nameSimilarity };`;
  return Function(body)();
}

function buildPhoneParser() {
  const start = app.indexOf("function countryFlagFromIso");
  const end = app.indexOf("function formatCpf");
  assert.ok(start >= 0 && end > start, "Bloco de telefone nao encontrado");
  const phoneBlock = app.slice(start, end);
  const body = `${extractFunction(app, "onlyDigits")}
${phoneBlock}
return { parsePhoneNumber, parsePhoneNumberForInput, parsePhoneNumberForSelectedCountry, phoneStorageValue };`;
  return Function(body)();
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

const matcher = buildPassengerMatcher();
const phone = buildPhoneParser();
assert.ok(
  matcher.scorePassengerCandidate(
    { label: "Ricardo Almeida", clienteId: "cliente-a", telefone: "", email: "" },
    { id: "pax-1", label: "Rciardo Almedia", clienteId: "cliente-a", telefone: "", email: "" }
  ),
  "deve capturar nome com letras transpostas e mesmo cliente"
);
assert.ok(
  matcher.scorePassengerCandidate(
    { label: "Marina Costa", clienteId: "", telefone: "", email: "" },
    { id: "pax-2", label: "Marina Cotsa", clienteId: "", telefone: "", email: "" }
  ),
  "deve capturar erro claro de digitacao mesmo sem telefone/email"
);
assert.ok(
  matcher.scorePassengerCandidate(
    { label: "Carlos Eduardo Silva", clienteId: "cliente-a", telefone: "", email: "" },
    { id: "pax-3", label: "Silva Carlos Eduardo", clienteId: "cliente-a", telefone: "", email: "" }
  ),
  "deve capturar nome em ordem diferente com mesmo cliente"
);

assert.equal(
  phone.parsePhoneNumberForInput("+54 11 9999-9999", "55").countryCode,
  "54",
  "deve detectar DDI explicito ao colar"
);
assert.equal(
  phone.parsePhoneNumberForSelectedCountry("+54 11 9999-9999", "55").countryCode,
  "55",
  "troca manual do seletor deve vencer a deteccao anterior"
);
assert.equal(
  phone.parsePhoneNumberForInput("4155552671", "1", { manualCountry: true }).e164,
  "+14155552671",
  "pais selecionado manualmente deve aceitar numero nacional"
);
assert.equal(
  phone.parsePhoneNumberForInput("14155552671", "1", { manualCountry: true }).e164,
  "+14155552671",
  "pais selecionado manualmente deve corrigir DDI duplicado"
);
assert.equal(
  phone.parsePhoneNumberForInput("02079460056", "44", { manualCountry: true }).e164,
  "+442079460056",
  "deve remover tronco local quando o pais selecionado exigir E.164"
);
assert.equal(
  phone.parsePhoneNumberForInput("+55 11 99999-9999", "351", { manualCountry: true }).countryCode,
  "55",
  "DDI explicito deve sobrescrever seletor manual"
);
assert.equal(
  phone.parsePhoneNumberForInput("5511999999999", "351", { manualCountry: true }).countryCode,
  "351",
  "seletor manual deve vencer DDI puro sem sinal de internacional"
);
assert.equal(
  phone.phoneStorageValue("+55 (11) 98765-4321", "55"),
  "+5511987654321",
  "valor salvo deve sair canonico em E.164"
);

includes(app, "MAX_FREQUENT_SERVICE_DAYS", "limite para periodo recorrente");
includes(app, "Data de retorno nao pode ser anterior a saida", "validacao retorno antes da saida");
includes(app, "Periodo frequente muito grande", "validacao de recorrencia grande demais");

console.log("formulario_operational_features: ok");
