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

function excludes(source, value, label = value) {
  assert.ok(!source.includes(value), `Nao esperado: ${label}`);
}

function extractCssRule(source, selector) {
  const start = source.indexOf(selector);
  assert.ok(start >= 0, `Regra CSS nao encontrada: ${selector}`);
  const end = source.indexOf("}", start);
  assert.ok(end > start, `Regra CSS incompleta: ${selector}`);
  return source.slice(start, end + 1);
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

function buildMockDbHarness() {
  const body = `
const MOCK_STORE_KEY = "formulario_geral_mock_db_v1";
const state = { xrm: null, mockMode: true };
const storage = new Map();
const localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); }
};
${extractFunction(app, "cleanGuid")}
${extractFunction(app, "sameId")}
${extractFunction(app, "uniquePassengersById")}
${extractFunction(app, "getMockDb")}
${extractFunction(app, "setMockDb")}
${extractFunction(app, "persistMockPassengerRecord")}
return { getMockDb, setMockDb, persistMockPassengerRecord };`;
  return Function(body)();
}

function buildLaunchParamHarness() {
  const body = `
let window = { location: { search: "" } };
${extractFunction(app, "cleanGuid")}
${extractFunction(app, "getUrlParam")}
${extractFunction(app, "parseLaunchDataParam")}
${extractFunction(app, "findRecordIdInLaunchData")}
${extractFunction(app, "findGuidInValue")}
${extractFunction(app, "getRecordIdFromHostContext")}
${extractFunction(app, "getRecordIdFromUrl")}
return function parse(search, hostId = "") {
  window = {
    location: { search },
    parent: hostId
      ? { Xrm: { WebApi: {}, Page: { data: { entity: { getId: () => hostId } } } } }
      : null,
    top: null,
    opener: null
  };
  return getRecordIdFromUrl();
};`;
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
excludes(app, "function createManualImportedTrecho", "importacao nao deve criar servico manual dentro da PG");
excludes(app, "add-manual-trecho", "acao de adicionar servico manual por PG deve ficar removida");
excludes(app, "Adicionar serviço manual", "botao de servico manual nao deve existir");
excludes(app, "originStatus: \"Manual\"", "trecho manual nao deve ser criado pela importacao");
excludes(app, "importOrigin: \"manual\"", "origem tecnica manual nao deve ser criada pela importacao");

includes(app, "async function searchPassengersServer", "busca server-side de passageiros");
includes(app, "async function ensurePassengersByIds", "carga pontual por ids de passageiros");
includes(app, "INITIAL_PASSENGER_LOOKUP_LIMIT", "solicitante deve carregar Banco de Dados no inicio");
includes(app, "renderPassengerPickerHint(query ? \"Pesquisando passageiros...\" : \"Carregando Banco de Dados...\")", "picker deve listar Banco de Dados sem exigir texto");
excludes(app, "Digite pelo menos 1 caractere", "busca no Banco de Dados nao deve exigir 1 caractere");
includes(app, "apelido: \"new_apelido\"", "motorista deve usar campo de apelido");
includes(app, "label: r[f.funcionario.apelido] || r[f.funcionario.nome]", "motorista deve exibir apelido com fallback para nome completo");

includes(html, "id=\"passengerMatchOverlay\"", "overlay de possivel duplicidade de passageiro");
includes(html, "viewport-fit=cover", "webresource deve permitir calculo correto de safe area no iPhone");
includes(app, "function currentViewportMetrics", "app deve calcular viewport real via visualViewport");
includes(app, "window.visualViewport?.addEventListener(\"resize\", syncViewportMetrics)", "iPhone deve recalcular altura visual ao mudar viewport");
includes(html, "id=\"closeRwButton\"", "topbar deve ter botao de fechar RW");
includes(app, "function closeWebResourceToGeral", "botao fechar deve voltar para Geral");
includes(app, "el.closeSuccess?.addEventListener(\"click\", closeWebResourceToGeral);", "OK de sucesso deve fechar RW pela mesma funcao do botao fechar");
includes(app, "pageType: \"entitylist\"", "fechar RW deve navegar para lista Model-driven");
includes(app, "entityName: CONFIG.entities.reserva", "fechar RW deve usar tabela real Geral");
includes(css, "--app-viewport-height", "CSS deve usar altura visual calculada");
includes(css, "--shell-padding-top: 8px;", "mobile nao deve duplicar safe-area do host Power Apps");
includes(css, ".status-select > span,", "regra do label de status nao deve afetar valor do select customizado");
includes(css, ".topbar .status-select > span", "mobile deve ocultar so o label direto do status");
excludes(css, ".topbar .status-select span {\n    display: none;", "mobile nao pode esconder o texto selecionado do status");
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

const mockDb = buildMockDbHarness();
mockDb.setMockDb({ reservas: [{ id: "res-1" }], relacoes: [{ reservaId: "res-1" }] });
assert.deepEqual(mockDb.getMockDb().passageiros, [], "mock antigo sem passageiros deve continuar valido");
mockDb.persistMockPassengerRecord({ id: "local-pax-1", label: "Pessoa Local", clienteId: "cliente-embraer" });
assert.equal(mockDb.getMockDb().passageiros.length, 1, "mock deve persistir passageiro local");
mockDb.persistMockPassengerRecord({ id: "local-pax-1", label: "Pessoa Editada", clienteId: "cliente-embraer" });
assert.equal(mockDb.getMockDb().passageiros.length, 1, "mock deve atualizar passageiro local sem duplicar");
assert.equal(mockDb.getMockDb().passageiros[0].label, "Pessoa Editada", "mock deve manter hot edit local");

const parseLaunchRecordId = buildLaunchParamHarness();
const launchGuid = "11111111-2222-3333-4444-555555555555";
assert.equal(
  parseLaunchRecordId(`?data=${encodeURIComponent(JSON.stringify({ entityId: `{${launchGuid}}` }))}`),
  launchGuid,
  "abertura por command bar deve aceitar data.entityId"
);
assert.equal(
  parseLaunchRecordId(`?data=${encodeURIComponent(JSON.stringify({ selectedItemReferences: [{ Id: `{${launchGuid}}` }] }))}`),
  launchGuid,
  "abertura por lista deve aceitar selectedItemReferences"
);
assert.equal(
  parseLaunchRecordId(`?ids=%7B${launchGuid}%7D`),
  launchGuid,
  "abertura por comando de grid deve aceitar ids"
);
assert.equal(
  parseLaunchRecordId("", `{${launchGuid}}`),
  launchGuid,
  "web resource em formulario principal deve ler o id do formulario pai"
);

includes(app, "MAX_FREQUENT_SERVICE_DAYS", "limite para periodo recorrente");
includes(app, "Data de retorno nao pode ser anterior a saida", "validacao retorno antes da saida");
includes(app, "Periodo frequente muito grande", "validacao de recorrencia grande demais");
includes(app, "buildRecurringRetornoPrevisto", "recorrencia deve recalcular previsao de retorno por data gerada");
excludes(app, "Agendar Retorno' ao mesmo tempo", "Retorno e Repetir podem ser usados juntos na criacao");
includes(app, "collectInactiveActivationDrafts", "save deve interceptar abas preenchidas sem ativar");
includes(app, "hasInactiveReturnDraft", "retorno preenchido sem ativar deve ter estado pendente");
includes(app, "hasInactiveRepeatDraft", "repetir preenchido sem ativar deve ter estado pendente");
{
  const proceedStart = app.indexOf("function proceedSaveContext");
  assert.ok(proceedStart >= 0, "Funcao proceedSaveContext deve existir");
  const proceedEnd = app.indexOf("async function performSave", proceedStart);
  assert.ok(proceedEnd > proceedStart, "Funcao proceedSaveContext deve vir antes de performSave");
  const proceedSaveContext = app.slice(proceedStart, proceedEnd);
  const validationIndex = proceedSaveContext.indexOf("const validation = validateContext(context);");
  const guardIndex = proceedSaveContext.indexOf("const inactiveDrafts = collectInactiveActivationDrafts();");
  assert.ok(validationIndex >= 0, "proceedSaveContext deve validar campos obrigatorios");
  assert.ok(guardIndex >= 0, "proceedSaveContext deve checar abas pendentes");
  assert.ok(
    validationIndex < guardIndex,
    "guard de ativacao deve rodar depois das validacoes obrigatorias"
  );
  includes(proceedSaveContext, "skipActivationGuard", "salvar sem ativar nao deve reabrir o mesmo popup");
}
includes(html, "id=\"activationGuardOverlay\"", "popup de confirmacao para abas preenchidas sem ativar");
includes(html, "id=\"activationGuardActivate\"", "popup deve permitir ativar e agendar");
includes(css, ".tab.is-pending::after", "aba pendente deve ter bolinha amarela propria");

includes(html, "id=\"importXlsxButton\"", "botao de upload XLSX");
includes(html, "id=\"xlsxImportInput\"", "input de arquivo XLSX");
includes(html, "data-tab=\"import\"", "aba de revisao do import XLSX");
includes(html, "id=\"tab-panel-import\"", "painel de revisao do import XLSX");
excludes(html, "id=\"importReviewOverlay\"", "overlay antigo de revisao do import XLSX");
excludes(html, "import-review-dialog\" role=\"dialog\"", "importacao nao deve abrir como dialog modal");
excludes(html, "id=\"importSaveAll\"", "aba de importacao nao deve exibir botao de salvar todos validos");
excludes(html, "Salvar todos válidos", "botao de salvar todos validos deve ser removido");
excludes(html, "id=\"importReviewCancel\"", "aba de importacao nao deve exibir botao voltar aos detalhes");
excludes(html, "Voltar aos detalhes", "botao voltar aos detalhes deve ser removido");
excludes(app, "saveAllValidImportedTrechos", "handler de salvar todos validos deve ser removido");
excludes(app, "closeImportReview", "handler de voltar aos detalhes deve ser removido");
includes(html, "scripts/xlsx_import_core.js", "core de import XLSX carregado antes do app");
excludes(html, "vendor/xlsx.full.min.js", "SheetJS nao deve carregar no boot");
includes(app, "async function ensureXlsxLibrary", "SheetJS deve carregar sob demanda");
includes(app, "script.src = \"vendor/xlsx.full.min.js\";", "SheetJS local deve continuar disponivel para importacao");
includes(app, "idExterno: \"cr40f_idexterno\"", "campo externo PG no payload da reserva");
includes(app, "importDefaults:", "configuracao padrao de importacao");
includes(app, "clienteLabel: \"Embraer\"", "cliente padrao Embraer para importacao");
includes(app, "function getImportClient", "resolucao do cliente padrao Embraer");
includes(app, "function ensureImportedSolicitanteRecord", "criacao/resolucao automatica do solicitante importado");
includes(app, "function selectImportedExistingMatch", "match automatico seguro de cadastro existente");
includes(app, "function createImportedPersonRecord", "criacao automatica de solicitante/passageiro importado");
includes(app, "function openXlsxImportPicker", "abertura do seletor XLSX");
includes(app, "async function handleXlsxImportFile", "leitura do XLSX");
includes(app, "function renderImportReview", "render do resumo de importacao");
includes(app, "async function saveImportedTrecho", "salvamento de trecho importado");
includes(app, "async function applyImportedTrechoToForm", "abrir formulario preenchido pelo trecho");
includes(app, "async function checkImportedProgramDuplicates", "checagem de duplicidade por servico importado");
includes(app, "function scoreImportedTrechoDuplicate", "pontuacao de duplicidade por horario/trajeto/endereco/passageiros");
includes(app, "possibleDuplicateMatches", "alerta de servico parecido sem bloquear automaticamente");
includes(app, "function handleImportFieldCopy", "campo bloqueado deve copiar valor clicado");
includes(app, "Serviço criado com sucesso", "mensagem simples ao criar 1 servico");
includes(app, "serviços criados com sucesso!", "mensagem simples ao criar varios servicos");
includes(app, "Serviço editado com sucesso!", "mensagem simples ao editar");
excludes(app, "serviço(s) solicitado(s) com sucesso!", "mensagem antiga com plural generico removida");
excludes(app, "Tipo do Veículo:", "mensagem de conclusao nao deve detalhar veiculo");
includes(app, "dataset.importCopy = \"1\"", "campos bloqueados devem expor acao de copia");
includes(app, "function addClassIfPresent", "classList.add dinamico deve ignorar token vazio");
includes(app, "addClassIfPresent(button, `is-${normalizeImportedReviewStatus(trecho) || \"\"}`)", "status de importacao deve usar classe segura");
excludes(app, "classList.add(isDuplicated ? \"duplicado\" : \"\")", "inspector nao pode quebrar com classList.add vazio");
includes(app, "function buildImportDecisionPanel", "revisao importada deve expor decisao operacional da PG");
includes(app, "import-decision-panel", "revisao importada deve destacar manter espera ou separar busca");
includes(app, "Interpretação da PG", "revisao importada deve apresentar interpretacao operacional generica");
includes(app, "Multi-coleta", "revisao importada deve reconhecer PG com coletas sequenciais");
excludes(app, "Manter 1 OS", "revisao importada nao deve exibir botao desnecessario quando a PG ja e uma OS");
includes(app, "É o mesmo carro", "revisao importada deve permitir mesclar trechos selecionados da mesma PG");
includes(app, "toggle-same-car-selection", "lista de importacao deve permitir selecionar trechos para merge");
includes(app, "merge-same-car", "lista de importacao deve expor acao de merge mesmo carro");
includes(app, "Separar ida/busca", "Split deve aparecer com linguagem operacional");
includes(app, "keep-waiting", "usuario deve conseguir registrar manter espera");
excludes(app, "keep-one", "revisao importada nao deve expor acao visual de manter 1 OS");
excludes(app, "manual-operational-review", "botao de revisar manual deve ser removido");
excludes(app, "Revisar manual", "botao de revisar manual nao deve aparecer");
includes(app, "VALIDAR", "acao principal da revisao deve ser VALIDAR");
includes(app, "IGNORAR", "acao secundaria da revisao deve ser IGNORAR");
includes(app, "function buildImportIgnoredList", "trechos ignorados devem ir para lista propria");
includes(app, "import-ignored-list", "lista de ignorados deve ter classe propria");
includes(app, "const hasSplitAction", "Split deve ser escondido quando ja estiver separado");
includes(app, "function buildImportTimeline", "revisao importada deve mostrar timeline de saida e retorno");
includes(app, "Janela da PG", "timeline deve explicar a janela operacional da PG");
includes(app, "trajetoCidades", "revisao importada deve permitir revisar trajeto por cidades");
includes(app, "function createImportPassengerDraft", "rascunho de passageiro extra na edicao do servico importado");
includes(app, "add-import-passenger", "inspector lateral deve permitir adicionar passageiro na edicao do servico importado");
includes(app, "import-add-inline-button", "botao inline deve atender a adicao de passageiro, nao de servico");
excludes(app, "PG já existe no Dataverse. Este item não pode ser editado", "bloqueio nao pode ser explicado so pela PG");
includes(app, "Serviço repetido provável", "servico repetido deve ser explicado por similaridade operacional");
includes(app, "Possível duplicidade", "servico parecido deve avisar antes de salvar");
includes(app, "Serviço repetido não abre no formulário. Edite o registro original no Dataverse.", "servico repetido nao abre no formulario");
includes(app, "Não edite este serviço", "copy forte para bloqueio de servico repetido");
excludes(app, "Criar novo trecho mesmo assim?", "sem brecha de confirmacao para criar duplicado");
includes(app, "bindLookup(payload, CONFIG.nav.cliente, CONFIG.entitySets.cliente, context.importClient.id)", "reserva importada vinculada ao cliente Embraer");
includes(app, "bindLookup(payload, CONFIG.nav.solicitante, CONFIG.entitySets.passageiro, context.solicitanteRecord?.id", "reserva importada vinculada ao solicitante automatico");
excludes(app, "importReviewOverlay: $(\"importReviewOverlay\")", "binding antigo do overlay de importacao");
includes(app, "passageiros: Array.isArray(parsed?.passageiros)", "mock db local deve persistir passageiros");
includes(app, "function persistMockPassengerRecord", "helper de persistencia local de passageiro");
includes(app, "const storedPassengers = getMockDb().passageiros", "mock deve recarregar passageiros salvos localmente");
includes(app, "persistMockPassengerRecord(newPassenger)", "cadastro manual deve salvar passageiro no banco local");
includes(app, "persistMockPassengerRecord(updatedPassenger)", "hot edit local deve salvar alteracoes do passageiro");
includes(app, "persistMockPassengerRecord(record)", "importacao deve salvar solicitante/passageiro no banco local");

const passengerTextareaRule = extractCssRule(css, ".passenger-edit-field textarea.passenger-edit-control {");
includes(passengerTextareaRule, "resize: vertical;", "textarea de passageiro readonly deve permitir ajuste de tamanho");
includes(passengerTextareaRule, "max-height: none;", "textarea de passageiro nao deve limitar resize vertical");
excludes(passengerTextareaRule, "resize: none;", "textarea de passageiro nao pode bloquear resize");

const importCopyPointerRule = extractCssRule(css, ".import-trecho.is-locked [data-import-copy] input[readonly]");
excludes(importCopyPointerRule, "textarea[readonly]", "textarea importado bloqueado deve manter pointer events para resize");

console.log("formulario_operational_features: ok");
