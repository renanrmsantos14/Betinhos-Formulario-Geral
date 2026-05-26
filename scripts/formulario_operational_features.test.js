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
includes(html, "id=\"globalImportHistoryActions\"", "topbar deve ter undo/redo global em todas as abas");
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
includes(html, "section-head inline activation-head", "cabecalho de ativacao deve ter layout proprio");
includes(css, ".activation-head .activation-switch", "switch de ativacao deve ter estilo compacto proprio");
includes(css, ".switch", "switch deve ter regra CSS propria");
includes(css, "cursor: pointer;", "controles clicaveis devem exibir cursor de clique");
includes(css, "input[type=\"datetime-local\"]:not(:disabled)", "seletor de data/hora deve ter cursor clicavel");
includes(css, "::-webkit-calendar-picker-indicator", "icone nativo de calendario deve ter cursor clicavel");
{
  const returnPanelStart = html.indexOf("id=\"tab-panel-return\"");
  const returnPanelEnd = html.indexOf("<section class=\"form-section\">", returnPanelStart);
  const returnHead = html.slice(returnPanelStart, returnPanelEnd);
  assert.ok(
    returnHead.indexOf("<h2>Agendar retorno</h2>") < returnHead.indexOf("class=\"switch activation-switch\""),
    "switch de retorno deve ficar a direita do titulo"
  );

  const repeatPanelStart = html.indexOf("id=\"tab-panel-repeat\"");
  const repeatPanelEnd = html.indexOf("<section class=\"form-section\">", repeatPanelStart);
  const repeatHead = html.slice(repeatPanelStart, repeatPanelEnd);
  assert.ok(
    repeatHead.indexOf("<h2>Serviços frequentes</h2>") < repeatHead.indexOf("class=\"switch activation-switch\""),
    "switch de repetir deve ficar a direita do titulo"
  );
}

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
const createImportedPersonRecordFn = extractFunction(app, "createImportedPersonRecord");
includes(createImportedPersonRecordFn, "[CONFIG.fields.passageiro.email]: normalizeEmail(person.email || \"\")", "passageiro novo importado deve gravar email quando existir");
includes(createImportedPersonRecordFn, "[CONFIG.fields.passageiro.telefone]: phoneStorageValue(person.telefone || \"\", \"55\")", "passageiro novo importado deve gravar telefone");
includes(createImportedPersonRecordFn, "[CONFIG.fields.passageiro.cr]: person.centroCusto || \"\"", "passageiro novo importado deve gravar CR");
includes(createImportedPersonRecordFn, "bindLookup(payload, CONFIG.nav.cliente, CONFIG.entitySets.cliente, importClient.id)", "passageiro novo importado deve gravar cliente");
excludes(createImportedPersonRecordFn, "setChoice(payload", "passageiro novo importado nao deve gravar choices automaticos");
excludes(createImportedPersonRecordFn, "CONFIG.fields.passageiro.cadastro", "passageiro novo importado nao deve gravar data de cadastro pela importacao");
includes(app, "function openXlsxImportPicker", "abertura do seletor XLSX");
includes(app, "async function handleXlsxImportFile", "leitura do XLSX");
includes(app, "function renderImportReview", "render do resumo de importacao");
includes(app, "function renderImportReviewFilters", "importReviewStats deve virar barra de filtros");
includes(app, "state.importReviewFilter = importReviewFilters().ALL", "nova importacao deve iniciar no filtro Todos");
includes(app, "dataset.importFilter", "filtros devem ser clicaveis por data attribute");
includes(app, "buildImportReviewFilterButton(\"Todos\"", "filtro Todos deve existir");
includes(app, "buildImportReviewFilterButton(\"Validados\"", "filtro Validados deve existir");
includes(app, "buildImportReviewFilterButton(\"Pendentes\"", "filtro Pendentes deve existir");
includes(app, "buildImportReviewFilterButton(\"Ignorados\"", "filtro Ignorados deve existir");
excludes(app, "function importStat", "importReviewStats nao deve renderizar cards passivos antigos");
excludes(app, "importStat(\"Linhas\"", "cards passivos Linhas/PGs/Trechos devem sair do header");
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
excludes(app, "É o mesmo carro", "revisao importada nao deve expor botao de mesmo carro");
excludes(app, "toggle-same-car-selection", "lista de importacao nao deve expor seletor de merge");
excludes(app, "merge-same-car", "lista de importacao nao deve expor acao de merge mesmo carro");
excludes(app, "Abrir formulário", "inspector de importacao nao deve exibir botao Abrir formulario");
includes(app, "function undoImportReviewChange", "importacao deve ter undo funcional");
includes(app, "function redoImportReviewChange", "importacao deve ter redo funcional");
includes(app, "captureImportReviewHistory(\"Editar campo do serviço\")", "edicao de campo do servico deve entrar no historico");
includes(app, "captureImportReviewHistory(`Editar passageiro importado: ${field.label}`)", "edicao no popup de passageiro importado deve entrar no historico");
includes(app, "function renderGlobalImportHistoryControls", "botoes de historico devem ser renderizados no topo global");
includes(app, "function handleGlobalImportHistoryAction", "topbar deve acionar undo/redo em qualquer aba");
includes(app, "data-import-history-action", "botoes de historico devem manter contrato de acao");
includes(app, "function importHistoryIconSvg", "botoes de historico devem usar icones SVG");
includes(app, "function focusImportHistoryTarget", "undo/redo deve focar item restaurado");
includes(app, "Foco: ${focusLabel}", "toast de undo/redo deve informar o foco restaurado");
includes(app, "function notifyImportHistoryToast", "undo/redo deve exibir toast de confirmacao");
includes(app, "handleImportHistoryShortcut", "Ctrl+Z/Ctrl+Y devem acionar historico do importador");
includes(css, ".import-history-button", "botoes Voltar/Para frente devem ter estilo proprio");
includes(css, ".import-history-icon", "icones de historico devem ter estilo proprio");
excludes(css, ".import-service-merge-toggle", "CSS do seletor de merge da galeria deve sair");
excludes(css, ".import-same-car-button", "CSS do botao Mesmo carro deve sair");
includes(app, "Separar ida/busca", "Split deve aparecer com linguagem operacional");
includes(app, "keep-waiting", "usuario deve conseguir registrar manter espera");
includes(app, "function buildImportInspectorReviewActions", "inspector deve expor acoes de Validar/Ignorar ao lado da edicao");
includes(app, "const hasKeepAction = hasReturn && !isMultiPickup && !isSeparable", "servico separavel nao deve exibir Manter espera");
includes(css, ".import-inspector-head > div:not(.import-inspector-actions)", "regra do titulo nao deve empilhar botoes do inspector");
const importInspectorActionsRule = extractCssRule(css, ".import-inspector-actions {");
includes(importInspectorActionsRule, "flex-wrap: nowrap;", "botoes do inspector devem ficar lado a lado");
includes(importInspectorActionsRule, "--import-inspector-action-height: 32px;", "botoes do inspector devem compartilhar altura fixa");
const importInspectorActionButtonRule = extractCssRule(css, ".import-inspector-actions .import-edit-toggle,");
includes(importInspectorActionButtonRule, "height: var(--import-inspector-action-height);", "editar, validar e ignorar devem ter a mesma altura");
const importValidateActionRule = extractCssRule(css, ".import-inspector-actions .primary-action[data-import-action=\"confirm-review\"]");
includes(importValidateActionRule, "var(--success)", "botao Validar deve usar verde semantico");
excludes(app, "keep-one", "revisao importada nao deve expor acao visual de manter 1 OS");
excludes(app, "manual-operational-review", "botao de revisar manual deve ser removido");
excludes(app, "Revisar manual", "botao de revisar manual nao deve aparecer");
includes(app, "Validar", "acao principal da revisao deve ser Validar");
includes(app, "Ignorar", "acao secundaria da revisao deve ser Ignorar");
includes(app, "function getValidatedImportTrechos", "servicos validados devem sair da fila principal");
includes(app, "status !== statuses.CONFIRMED && status !== statuses.SAVED && status !== statuses.IGNORED", "fila principal nao deve exibir confirmados, salvos ou ignorados");
includes(app, "buildImportCollapsedStatusList(\"Validados\"", "galeria deve ter grupo fechado de Validados");
includes(app, "buildImportCollapsedStatusList(\"Ignorados\"", "galeria deve ter grupo fechado de Ignorados");
includes(app, "import-collapsed-list", "grupos resolvidos devem ter classe propria");
includes(app, "openValidated: activeFilter === importReviewFilters().VALIDATED", "filtro Validados deve abrir lista validada");
includes(app, "openIgnored: activeFilter === importReviewFilters().IGNORED", "filtro Ignorados deve abrir lista ignorada");
includes(css, ".import-filter-count", "contador pequeno deve existir dentro do filtro");
includes(css, ".import-filter.is-active", "filtro ativo deve ter estado visual claro");
includes(css, ".import-collapsed-list[open] .import-collapsed-list-marker::after", "grupo resolvido deve indicar quando esta aberto");
includes(app, "function buildImportIgnoredList", "trechos ignorados devem ir para lista propria");
includes(app, "import-ignored-list", "lista de ignorados deve ter classe propria");
includes(app, "const hasSplitAction", "Split deve ser escondido quando ja estiver separado");
excludes(app, "function buildImportTimeline", "formulario importado nao deve renderizar bloco Janela da PG");
excludes(app, "Janela da PG", "formulario importado nao deve exibir Janela da PG");
excludes(css, ".import-timeline", "CSS do bloco Janela da PG deve sair do importador");
includes(app, "trajetoCidades", "revisao importada deve permitir revisar trajeto por cidades");
includes(app, "dataset.importInputType = type", "campos importados devem expor tipo para largura responsiva");
includes(app, "dataset.importInputType = \"textarea\"", "textareas importados devem ter tipo proprio no layout");
includes(css, ".import-hot-grid {\n  display: flex;", "grade do formulario importado deve usar largura dinamica");
includes(css, "flex-wrap: wrap;\n  align-items: stretch;", "grade do formulario importado deve quebrar sem empilhar desnecessariamente");
const importDateTimeFieldRule = extractCssRule(css, ".import-field[data-import-input-type=\"datetime-local\"] {");
includes(importDateTimeFieldRule, "var(--datetime-field-width)", "DateTime importado deve usar largura especifica do formulario principal");
const importDateFieldRule = extractCssRule(css, ".import-field[data-import-input-type=\"date\"] {");
includes(importDateFieldRule, "var(--date-field-width)", "Date importado deve usar largura especifica do formulario principal");
const importPassengerExistingDotRule = extractCssRule(css, ".import-passenger-row.is-use-existing .import-passenger-status-dot {");
includes(importPassengerExistingDotRule, "var(--success)", "bolinha de passageiro existente deve ser verde");
const importPassengerNewDotRule = extractCssRule(css, ".import-passenger-row.is-create-new .import-passenger-status-dot {");
includes(importPassengerNewDotRule, "var(--accent)", "bolinha de passageiro novo deve ter cor diferente do existente");
const importPassengerAmbiguousDotRule = extractCssRule(css, ".import-passenger-row.is-ambiguous .import-passenger-status-dot {");
includes(importPassengerAmbiguousDotRule, "var(--warning)", "bolinha de passageiro a decidir deve ser aviso");
const importPassengerRowBeforeRule = extractCssRule(css, ".import-passenger-row.import-passenger::before {");
includes(importPassengerRowBeforeRule, "content: none !important;", "passageiro importado nao deve exibir selo textual sobre a linha");
excludes(css, "content: \"Confirmado\";", "passageiro importado nao deve ter selo Confirmado em CSS");
includes(app, "function createImportPassengerDraft", "rascunho de passageiro extra na edicao do servico importado");
includes(app, "add-import-passenger", "inspector lateral deve permitir adicionar passageiro na edicao do servico importado");
includes(app, "function openImportedPassengerEdit", "clicar em passageiro importado deve abrir tela de edicao propria");
includes(app, "function getImportedPassengerEditFields", "passageiro importado deve usar schema de campos no popup de passageiro");
const importedPassengerEditFields = extractFunction(app, "getImportedPassengerEditFields");
excludes(importedPassengerEditFields, 'key: "origem"', "popup de passageiro importado nao deve cadastrar origem no passageiro");
excludes(importedPassengerEditFields, 'key: "destino"', "popup de passageiro importado nao deve cadastrar destino no passageiro");
const importedPassengerPreviewFields = extractFunction(app, "importedPassengerPreviewRecord");
excludes(importedPassengerPreviewFields, "origem:", "hover do passageiro importado nao deve tratar origem como dado cadastral");
excludes(importedPassengerPreviewFields, "destino:", "hover do passageiro importado nao deve tratar destino como dado cadastral");
const importPassengerDraftFields = extractFunction(app, "createImportPassengerDraft");
excludes(importPassengerDraftFields, "origem:", "rascunho manual de passageiro importado nao deve herdar origem do servico");
excludes(importPassengerDraftFields, "destino:", "rascunho manual de passageiro importado nao deve carregar destino proprio");
includes(app, "renderImportedPassengerEditFields(passenger)", "passageiro importado deve renderizar no popup passenger-edit");
includes(app, "function saveImportedPassengerEditField", "popup deve salvar alteracoes locais do passageiro importado");
includes(app, "activeImportedPassengerEditRef", "popup deve guardar o passageiro importado ativo");
includes(app, "[\"nome\", \"telefone\", \"email\", \"centroCusto\"].includes(field.key)", "edicao local deve atualizar dados que serao gravados no novo passageiro");
excludes(app, "function buildImportPassengerDraftEditor", "importacao nao deve abrir editor inline de passageiro");
excludes(css, ".import-passenger-draft-editor", "CSS do editor inline de passageiro importado deve sair");
excludes(css, ".import-passenger-row.is-draft-editing", "linha do passageiro importado nao deve virar formulario inline");
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
