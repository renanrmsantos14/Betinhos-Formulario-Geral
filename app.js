(() => {
  "use strict";

  const CONFIG = {
    entities: {
      reserva: "cr40f_reservadeveculos",
      passageiro: "cr40f_bancodedados",
      cliente: "cr40f_clientes1",
      funcionario: "cr40f_funcionarios",
      servicoPassageiro: "cr40f_servicosporpassageiro",
      financeiro: "cr40f_financeiro"
    },
    entitySets: {
      reserva: "cr40f_reservadeveculoses",
      passageiro: "cr40f_bancodedadoses",
      cliente: "cr40f_clientes1s",
      funcionario: "cr40f_funcionarioses",
      servicoPassageiro: "cr40f_servicosporpassageiros",
      financeiro: "cr40f_financeiros"
    },
    fields: {
      reserva: {
        id: "cr40f_reservadeveculosid",
        readableId: "cr40f_id",
        status: "cr40f_status",
        statusFaturamento: "cr40f_statusdefaturamento",
        dataSaida: "cr40f_dataehorriodesada",
        previsaoRetorno: "cr40f_horrioprevistoderetorno",
        tipoServico: "cr40f_tipodoservico",
        tipoVeiculo: "cr40f_tipodeveiculo",
        destino: "cr40f_destino",
        enderecoView: "cr40f_endereodesada",
        enderecoPersonalizado: "new_enderecodesaidapersonalizado",
        obsOperacao: "cr40f_obsdeoperao",
        obsInterna: "cr40f_observaointerna",
        obsFinal: "new_observacaofinal",
        perfilPassageiro: "cr40f_perfildopassageiro",
        email: "cr40f_email",
        paxView: "cr40f_passageirosetelefonedecontato",
        trajeto: "cr40f_trajeto",
        cotacao: "cr40f_cotao",
        receber: "cr40f_receber",
        cr: "cr40f_cr",
        formaPagamento: "cr40f_formadepagamento",
        idTenaris: "cr40f_idtenaris",
        idExterno: "new_idexterno"
      },
      passageiro: {
        id: "cr40f_bancodedadosid",
        nome: "cr40f_nomedopassageiro",
        telefone: "cr40f_telefone",
        enderecoSaida: "cr40f_enderecodesaida",
        preferencias: "cr40f_preferenciasdopassageiro",
        email: "cr40f_email",
        cr: "cr40f_cr",
        cargo: "cr40f_cargo",
        nascimento: "cr40f_datadenascimento",
        sexo: "cr40f_sexo",
        idioma: "cr40f_idioma",
        departamento: "cr40f_departamento",
        cadastro: "cr40f_datadecadastro",
        classificacao: "cr40f_classificacao",
        status: "cr40f_status",
        tipoVeiculo: "new_tipodoveiculo"
      },
      cliente: {
        id: "cr40f_clientes1id",
        nome: "cr40f_nomedocliente"
      },
      funcionario: {
        id: "cr40f_funcionariosid",
        nome: "cr40f_nomecompleto",
        apelido: "new_apelido"
      },
      servicoPassageiro: {
        id: "cr40f_servicosporpassageiroid",
        ordem: "cr40f_ordemdeselecao",
        endereco: "new_enderecodesaidacolunaservicosporpassageiro"
      },
      financeiro: {
        id: "cr40f_financeiroid",
        label: "cr40f_idfinanceiro"
      }
    },
    nav: {
      cliente: "cr40f_Cliente",
      solicitante: "cr40f_Solicitante",
      motorista: "cr40f_Motorista",
      financeiro: "cr40f_Financeiro",
      servicoGeral: "cr40f_Geral",
      servicoBancoDados: "cr40f_BancodeDados"
    },
    importDefaults: {
      clienteId: "",
      clienteLabel: "Embraer"
    }
  };

  const URL_PARAMS = new URLSearchParams(window.location.search);
  const QUERY_MOCK_MODE = (URL_PARAMS.get("mock") === "1" || URL_PARAMS.get("mockData") === "1");
  const MOCK_STORE_KEY = "formulario_geral_mock_db_v1";
  const DRAFT_STORE_KEY = "formulario_geral_draft_v1";
  const PASSENGER_RECENCY_KEY = "formulario_geral_passenger_recency_v1";
  const XLSX_SOURCE_ELEMENT_ID = "xlsxLibrarySource";
  const BRAND_LOGO_WEBRESOURCE = "cr40f_LogoBetinhosB";
  const MAX_FREQUENT_SERVICE_DAYS = 90;
  const MAX_FREQUENT_SERVICE_RECORDS = 120;
  const IMPORT_SAVE_CONCURRENCY = 3;
  const INITIAL_PASSENGER_LOOKUP_LIMIT = 5000;
  const IMPORT_XLSX_STATUS_OPERATION_MAP = Object.freeze({
    "agendado": "Confirmado",
    "aguardando faturamento": "Confirmado",
    "em analise financeira": "Confirmado",
    "em execucao": "Confirmado",
    "lancamentos financeiros recusados": "Confirmado",
    "recusado pela central": "Cancelado"
  });
  const IMPORT_XLSX_AUTO_IGNORE_STATUSES = Object.freeze(new Set([
    "aguardando prestador"
  ]));

  const FALLBACK = buildFallbackChoices();

  function buildFallbackChoices() {
    return {
      statusOperacao: [
        { value: 202410002, label: "Cancelado" },
        { value: 100000001, label: "Requer Analise" },
        { value: 202410010, label: "Cancelado com Ressalvas" },
        { value: 202410000, label: "Pre-reserva" },
        { value: 202410004, label: "Solicitado" },
        { value: 202410001, label: "Confirmado" },
        { value: 202410005, label: "Programado" },
        { value: 202410006, label: "Em Execucao" },
        { value: 202410008, label: "Concluido" }
      ],
      statusFaturamento: [
        { value: 202410011, label: "Nao Faturavel" },
        { value: 202410005, label: "Pendente" },
        { value: 100000001, label: "Composicao Realizada" },
        { value: 202410000, label: "Cancelado Sem Taxa" },
        { value: 202410002, label: "Cancelado Com Taxa" },
        { value: 202410003, label: "Cortesia" },
        { value: 202410004, label: "Permuta" },
        { value: 202410006, label: "Pagante em Viagem" },
        { value: 202410007, label: "Pagamento Pendente" },
        { value: 202410012, label: "Pagamento Em Atraso" },
        { value: 202410008, label: "Faturamento Mensal" },
        { value: 202410010, label: "Pago" }
      ],
      tipoServico: [
        { value: 202410000, label: "Guarulhos" },
        { value: 202410001, label: "Sao Paulo" },
        { value: 202410002, label: "Outras Cidades" },
        { value: 202410003, label: "Vale do Paraiba" },
        { value: 202410004, label: "Rio de Janeiro" },
        { value: 202410005, label: "Pindamonhangaba" },
        { value: 202410006, label: "Sao Jose dos Campos" },
        { value: 202410007, label: "Congonhas" },
        { value: 202410008, label: "Campinas" },
        { value: 202410009, label: "Dentro de Sao Paulo" },
        { value: 202410010, label: "Litoral" },
        { value: 202410011, label: "Regiao dos Lagos" },
        { value: 202410012, label: "Extrema" },
        { value: 202410013, label: "Nova Odessa" },
        { value: 202410014, label: "Baixada Santista" },
        { value: 202410015, label: "Minas Gerais" },
        { value: 202410016, label: "GPX" }
      ],
      tipoVeiculo: [
        { value: 202410000, label: "Basico" },
        { value: 202410001, label: "Executivo" },
        { value: 202410002, label: "Blindado" },
        { value: 202410003, label: "Van" },
        { value: 202410004, label: "Van Blindado" },
        { value: 202410005, label: "Spin" },
        { value: 202410006, label: "Somente Motorista" }
      ],
      formaPagamento: [
        { value: 202410000, label: "Cartao de credito" },
        { value: 202410001, label: "Pedido de compra" },
        { value: 202410002, label: "Pix" }
      ],
      bdStatus: [
        { value: 202410001, label: "Ativo" }
      ],
      bdClassificacao: [
        { value: 202410000, label: "Passageiro Frequente" },
        { value: 202410001, label: "Visitante" },
        { value: 202410002, label: "Solicitante" },
        { value: 202410003, label: "Grupo" },
        { value: 202410004, label: "Lead" }
      ],
      bdSexo: [
        { value: 202410000, label: "Masculino" },
        { value: 202410001, label: "Feminino" }
      ],
      bdIdioma: [
        { value: 202410000, label: "Portugues" },
        { value: 202410001, label: "Ingles" },
        { value: 202410002, label: "Espanhol" }
      ],
      bdCargo: [
        { value: 202410000, label: "C-Level" },
        { value: 202410001, label: "Presidente" },
        { value: 202410002, label: "Vice Presidente" },
        { value: 202410003, label: "Diretor" },
        { value: 202410004, label: "Assistente Executiva" },
        { value: 202410005, label: "Gerente" },
        { value: 202410006, label: "Supervisor" },
        { value: 202410007, label: "Analista" },
        { value: 202410008, label: "Comprador" },
        { value: 202410009, label: "Engenheiro" },
        { value: 100000001, label: "Conselheiro" }
      ],
      bdTipoVeiculo: [
        { value: 202410000, label: "Basico" },
        { value: 202410001, label: "Executivo" },
        { value: 202410002, label: "Blindado" },
        { value: 202410003, label: "Van" },
        { value: 202410004, label: "Van Blindado" },
        { value: 202410005, label: "Spin" },
        { value: 202410006, label: "Somente Motorista" }
      ],
      simple: []
    };
  }

  const $ = (id) => document.getElementById(id);

  const el = {
    brandLogo: $("brandLogo"),
    loading: $("loadingOverlay"),
    success: $("successOverlay"),
    successMessage: $("successMessage"),
    closeSuccess: $("closeSuccess"),
    toastStack: $("toastStack"),
    saveButton: $("saveButton"),
    saveButtonText: $("saveButtonText"),
    closeRwButton: $("closeRwButton"),
    recordIdBox: $("recordIdBox"),
    recordIdText: $("recordIdText"),
    globalImportHistoryActions: $("globalImportHistoryActions"),
    importXlsxButton: $("importXlsxButton"),
    xlsxImportInput: $("xlsxImportInput"),
    importReviewTitle: $("importReviewTitle"),
    importReviewSummary: $("importReviewSummary"),
    importReviewEmpty: $("importReviewEmpty"),
    importReviewStats: $("importReviewStats"),
    importReviewIssues: $("importReviewIssues"),
    importReviewPrograms: $("importReviewPrograms"),
    content: document.querySelector(".content"),
    tabs: [...document.querySelectorAll(".tab")],
    panels: [...document.querySelectorAll(".panel")],
    statusOperacao: $("statusOperacao"),
    statusFaturamento: $("statusFaturamento"),
    saidaData: $("saidaData"),
    saidaHora: $("saidaHora"),
    saidaMinuto: $("saidaMinuto"),
    retPrevDateTime: $("retPrevDateTime"),
    retPrevHora: $("retPrevHora"),
    retPrevMinuto: $("retPrevMinuto"),
    cliente: $("cliente"),
    solicitante: $("solicitante"),
    tipoServico: $("tipoServico"),
    tipoVeiculo: $("tipoVeiculo"),
    motorista: $("motorista"),
    trajeto: $("trajeto"),
    observacao: $("observacao"),
    receber: $("receber"),
    cotacao: $("cotacao"),
    op: $("op"),
    opWrap: $("opWrap"),
    formaPagamento: $("formaPagamento"),
    cr: $("cr"),
    passengerRows: $("passengerRows"),
    passengerEmpty: $("passengerEmpty"),
    passengerBlock: document.querySelector(".passenger-block"),
    toggleEnderecoPersonalizado: $("toggleEnderecoPersonalizado"),
    addPassenger: $("addPassenger"),
    passengerPickerOverlay: $("passengerPickerOverlay"),
    passengerPickerSearch: $("passengerPickerSearch"),
    passengerPickerResults: $("passengerPickerResults"),
    passengerPickerClose: $("passengerPickerClose"),
    passengerPickerCancel: $("passengerPickerCancel"),
    customAddressWrap: $("customAddressWrap"),
    enderecoPersonalizado: $("enderecoPersonalizado"),
    destino: $("destino"),
    bdStatus: $("bdStatus"),
    bdNome: $("bdNome"),
    bdTelefonePais: $("bdTelefonePais"),
    bdTelefone: $("bdTelefone"),
    bdEndereco: $("bdEndereco"),
    bdEmail: $("bdEmail"),
    bdClassificacao: $("bdClassificacao"),
    bdCliente: $("bdCliente"),
    bdSexo: $("bdSexo"),
    bdIdioma: $("bdIdioma"),
    bdCr: $("bdCr"),
    bdDepartamento: $("bdDepartamento"),
    bdCargo: $("bdCargo"),
    bdNascimento: $("bdNascimento"),
    bdPreferencias: $("bdPreferencias"),
    bdTipoVeiculo: $("bdTipoVeiculo"),
    passengerEditOverlay: $("passengerEditOverlay"),
    passengerEditTitle: $("passengerEditTitle"),
    passengerEditStatus: $("passengerEditStatus"),
    passengerEditFields: $("passengerEditFields"),
    passengerEditToggle: $("passengerEditToggle"),
    passengerEditClose: $("passengerEditClose"),
    passengerMatchOverlay: $("passengerMatchOverlay"),
    passengerMatchSummary: $("passengerMatchSummary"),
    passengerMatchList: $("passengerMatchList"),
    passengerMatchCancel: $("passengerMatchCancel"),
    passengerMatchContinue: $("passengerMatchContinue"),
    activationGuardOverlay: $("activationGuardOverlay"),
    activationGuardList: $("activationGuardList"),
    activationGuardReview: $("activationGuardReview"),
    activationGuardSkip: $("activationGuardSkip"),
    activationGuardActivate: $("activationGuardActivate"),
    returnReceiveScopeOverlay: $("returnReceiveScopeOverlay"),
    returnReceiveScopeReview: $("returnReceiveScopeReview"),
    returnReceiveScopeLast: $("returnReceiveScopeLast"),
    returnReceiveScopeAll: $("returnReceiveScopeAll"),
    clearAllFormsOverlay: $("clearAllFormsOverlay"),
    clearAllFormsCancel: $("clearAllFormsCancel"),
    clearAllFormsConfirm: $("clearAllFormsConfirm"),
    createPassenger: $("createPassenger"),
    agendarRetorno: $("agendarRetorno"),
    receberRetorno: $("receberRetorno"),
    retornoData: $("retornoData"),
    retornoHora: $("retornoHora"),
    retornoMinuto: $("retornoMinuto"),
    retornoEndereco: $("retornoEndereco"),
    retornoDestino: $("retornoDestino"),
    retornoObservacao: $("retornoObservacao"),
    repetirServico: $("repetirServico"),
    frequenteInicio: $("frequenteInicio"),
    frequenteFim: $("frequenteFim"),
    frequenteTipo: $("frequenteTipo"),
    contabilizarFds: $("contabilizarFds"),
    tabImport: $("tabImport"),
    tabBd: $("tabBd"),
    tabReturn: $("tabReturn"),
    tabRepeat: $("tabRepeat")
  };

  const state = {
    xrm: getXrm(),
    recordId: getRecordIdFromUrl(),
    isNew: true,
    currentTab: "details",
    obsAtual: "motorista",
    retObsAtual: "motorista",
    loading: false,
    record: null,
    passageiros: [],
    clientes: [],
    motoristas: [],
    ordensPagamento: [],
    relacoes: [],
    passengerSelectionRecency: [],
    selectedPassengers: [],
    scheduleDrafts: [],
    enderecoRascunho: [],
    enderecoPersonalizadoAtivo: false,
    obs: { motorista: "", interna: "", final: "", passageiro: "" },
    obsRet: { motorista: "", interna: "", final: "", passageiro: "" },
    options: {
      statusOperacao: FALLBACK.statusOperacao,
      statusFaturamento: FALLBACK.statusFaturamento,
      tipoServico: [],
      tipoVeiculo: [],
      formaPagamento: [],
      bdStatus: [],
      bdClassificacao: [],
      bdSexo: [],
      bdIdioma: [],
      bdCargo: [],
      bdTipoVeiculo: []
    },
    mockMode: false,
    passengerRowSeq: 0,
    scheduleDraftSeq: 0,
    pendingSaveContext: null,
    importReview: null,
    importReviewFilter: "all",
    saveLog: [],
    draftTimer: null,
    draftRestoring: false,
    lastDraftSavedAt: null,
    draftCommonEdited: false,
    globalHistory: {
      undo: [],
      redo: [],
      pending: null
    },
    activationDraftEditState: {
      return: false,
      repeat: false
    },
    activationGuardDrafts: [],
    importDraftEditState: {
      common: false,
      retorno: false
    }
  };
  const customSelectRoots = new WeakMap();
  let activeCustomSelect = null;
  let customSelectSeq = 0;
  let activePassengerPreview = null;
  let passengerPreviewPositionRaf = null;
  let passengerPreviewCloseTimer = null;
  const passengerRowHoverSuppressTimers = new WeakMap();
  let passengerPickerTargetOrder = null;
  let passengerPickerSearchTimer = null;
  let passengerPickerSearchSeq = 0;
  let activePassengerEditId = "";
  let activeImportedPassengerEditRef = null;
  let passengerEditEnabled = false;
  let passengerEditStatusTimer = null;
  const passengerEditSaveTimers = new Map();
  let passengerMatchResolve = null;
  let passengerMatchCandidates = [];
  let clearAllFormsConfirmationResolve = null;
  const importPassengerCreateLocks = new Map();
  const IMPORT_REVIEW_HISTORY_LIMIT = 80;
  const GLOBAL_HISTORY_LIMIT = 80;
  let isRestoringImportHistory = false;
  let isRestoringGlobalHistory = false;
  let xlsxLibraryLoadPromise = null;
  let contentTouchStartY = 0;
  let contentTouchPull = 0;

  state.mockMode = QUERY_MOCK_MODE || state.xrm === null;

  async function init() {
    state.isNew = !state.recordId;
    syncViewportMetrics();
    setLoading(true);
    applyBrandLogo();
    bindStaticEvents();
    populateTimeSelects();
    loadPassengerSelectionRecency();
    await loadReferenceData();
    await loadCurrentRecord();
    hydrateForm();
    renderAll();
    clearDraftSnapshot(false);
    initializeCustomSelects();
    syncDateTimeFieldRowWidths();
    setLoading(false);
    if (state.mockMode) {
      toast("Modo local ativo: dados mock gerados para teste completo da experiência.", "warning", 7000);
      return;
    }
  }

  function getXrm() {
    const scopes = [window, window.parent, window.top, window.opener].filter(Boolean);
    for (const scope of scopes) {
      try {
        if (scope.Xrm && scope.Xrm.WebApi) return scope.Xrm;
      } catch (_) {
        continue;
      }
    }
    return null;
  }

  function closeWebResourceToGeral() {
    clearDraftSnapshot(false);
    const xrm = state.xrm || getXrm();
    if (xrm?.Navigation?.navigateTo) {
      setLoading(true);
      xrm.Navigation.navigateTo({
        pageType: "entitylist",
        entityName: CONFIG.entities.reserva
      }, { target: 1 }).catch((error) => {
        console.warn("Falha ao voltar para Geral", error);
        setLoading(false);
        fallbackCloseWebResource();
      });
      return;
    }
    fallbackCloseWebResource();
  }

  function fallbackCloseWebResource() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    try {
      window.close();
    } catch (_) {
      toast("Não foi possível fechar automaticamente.", "warning", 5000);
    }
  }

  function getRecordIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const direct = getUrlParam(params, ["id", "recordId", "recordid", "entityId", "entityid", "ids", "recordIds", "selectedIds"]);
    if (direct) return findGuidInValue(direct) || cleanGuid(direct);
    const data = getUrlParam(params, ["data"]);
    if (!data) return getRecordIdFromHostContext();
    const directGuid = findGuidInValue(data);
    if (directGuid) return directGuid;
    try {
      const decoded = parseLaunchDataParam(data);
      return findRecordIdInLaunchData(decoded) || getRecordIdFromHostContext();
    } catch (_) {
      return getRecordIdFromHostContext();
    }
  }

  function getUrlParam(params, names) {
    for (const name of names) {
      const exact = params.get(name);
      if (exact) return exact;
    }
    const wanted = new Set(names.map((name) => name.toLowerCase()));
    for (const [key, value] of params.entries()) {
      if (wanted.has(String(key).toLowerCase()) && value) return value;
    }
    return "";
  }

  function parseLaunchDataParam(data) {
    const raw = String(data || "");
    const candidates = [raw];
    try {
      const decoded = decodeURIComponent(raw);
      if (decoded && decoded !== raw) candidates.push(decoded);
    } catch (_) {
    }
    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate);
      } catch (_) {
      }
    }
    return raw;
  }

  function findRecordIdInLaunchData(value) {
    if (!value) return "";
    if (typeof value === "string") return findGuidInValue(value);
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findRecordIdInLaunchData(item);
        if (found) return found;
      }
      return "";
    }
    if (typeof value !== "object") return "";

    const priorityKeys = [
      "id",
      "Id",
      "recordId",
      "recordid",
      "recordID",
      "entityId",
      "entityid",
      "ids",
      "recordIds",
      "selectedIds",
      "selectedItemIds",
      "selectedItemReferences",
      "SelectedItemReferences"
    ];
    for (const key of priorityKeys) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const found = findRecordIdInLaunchData(value[key]);
        if (found) return found;
      }
    }
    for (const item of Object.values(value)) {
      const found = findRecordIdInLaunchData(item);
      if (found) return found;
    }
    return "";
  }

  function findGuidInValue(value) {
    const match = String(value || "").match(/[({]?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[)}]?/i);
    return match ? cleanGuid(match[0]) : "";
  }

  function getRecordIdFromHostContext() {
    const scopes = [window, window.parent, window.top, window.opener].filter(Boolean);
    for (const scope of scopes) {
      try {
        const formId = scope.Xrm?.Page?.data?.entity?.getId?.();
        const cleanFormId = findGuidInValue(formId);
        if (cleanFormId) return cleanFormId;

        const pageContext = scope.Xrm?.Utility?.getPageContext?.();
        const contextId = findRecordIdInLaunchData(pageContext?.input || pageContext);
        if (contextId) return contextId;
      } catch (_) {
      }
    }
    return "";
  }

  function shouldAutofocusSearchInputs() {
    try {
      const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
      const noHover = window.matchMedia?.("(hover: none)")?.matches;
      if (coarsePointer || noHover) return false;
    } catch (_) {
    }
    return true;
  }

  function isMobilePassengerPreviewDisabled() {
    try {
      const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
      const noHover = window.matchMedia?.("(hover: none)")?.matches;
      const mobileWidth = window.matchMedia?.("(max-width: 760px)")?.matches;
      return !!(coarsePointer || noHover || mobileWidth);
    } catch (_) {
      return currentViewportMetrics().width <= 760;
    }
  }

  function currentViewportMetrics() {
    const visual = window.visualViewport;
    const width = Math.floor(visual?.width || window.innerWidth || document.documentElement.clientWidth || 0);
    const height = Math.floor(visual?.height || window.innerHeight || document.documentElement.clientHeight || 0);
    const offsetLeft = Math.floor(visual?.offsetLeft || 0);
    const offsetTop = Math.floor(visual?.offsetTop || 0);
    return { width, height, offsetLeft, offsetTop };
  }

  function syncViewportMetrics() {
    const metrics = currentViewportMetrics();
    if (metrics.height > 0) {
      document.documentElement.style.setProperty("--app-viewport-height", `${metrics.height}px`);
    }
    document.documentElement.classList.toggle("is-ios-viewport", /iPad|iPhone|iPod/.test(navigator.userAgent || ""));
    repositionOpenCustomSelectPanels();
    repositionPassengerPreview();
  }

  function resolveEnvironmentBaseUrl() {
    if (state.xrm?.Utility?.getGlobalContext) {
      try {
        return state.xrm.Utility.getGlobalContext().getClientUrl();
      } catch (_) {
      }
    }
    const origin = window.location.origin || "";
    if (/^https:\/\/[^/]+\.crm\d*\.dynamics\.com$/i.test(origin)) return origin;
    return "";
  }

  function buildBrandLogoUrl() {
    const baseUrl = resolveEnvironmentBaseUrl();
    return baseUrl ? `${baseUrl}/WebResources/${BRAND_LOGO_WEBRESOURCE}` : "";
  }

  function applyBrandLogo() {
    const logo = el.brandLogo;
    if (!logo) return;
    const logoUrl = buildBrandLogoUrl();
    if (!logoUrl) return;

    logo.hidden = false;
    logo.src = logoUrl;
    logo.addEventListener("error", () => {
      logo.hidden = true;
    }, { once: true });
  }

  function cleanGuid(value) {
    return String(value || "").replace(/[{}]/g, "").trim();
  }

  function loadPassengerSelectionRecency() {
    const stored = readPassengerSelectionRecency();
    state.passengerSelectionRecency = stored;
  }

  function readPassengerSelectionRecency() {
    try {
      const raw = window.localStorage.getItem(PASSENGER_RECENCY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      const normalized = parsed.map((item) => cleanGuid(item).toLowerCase()).filter(Boolean);
      return Array.from(new Set(normalized)).slice(0, 20);
    } catch (_) {
      return [];
    }
  }

  function persistPassengerSelectionRecency() {
    try {
      window.localStorage.setItem(PASSENGER_RECENCY_KEY, JSON.stringify(state.passengerSelectionRecency));
    } catch (_) {
      // noop
    }
  }

  function touchPassengerSelectionRecency(passengerId) {
    const id = cleanGuid(passengerId).toLowerCase();
    if (!id) return;
    const recents = state.passengerSelectionRecency.filter((item) => item !== id);
    recents.unshift(id);
    state.passengerSelectionRecency = recents.slice(0, 20);
    persistPassengerSelectionRecency();
  }

  function getPassengerSelectionRecencyIndex(passengerId) {
    const id = cleanGuid(passengerId).toLowerCase();
    if (!id) return Number.MAX_SAFE_INTEGER;
    const index = state.passengerSelectionRecency.indexOf(id);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  function hydratePassengerSelectionRecencyFromRows(rows) {
    if (!Array.isArray(rows)) return;
    rows.forEach((row) => {
      touchPassengerSelectionRecency(row?.guid);
    });
  }

  function bindStaticEvents() {
    el.tabs.forEach((button) => {
      button?.addEventListener("click", () => setTab(button.dataset.tab));
    });
    el.closeSuccess?.addEventListener("click", closeWebResourceToGeral);
    el.closeRwButton?.addEventListener("click", closeWebResourceToGeral);
    el.saveButton?.addEventListener("click", saveForm);
    el.globalImportHistoryActions?.addEventListener("click", handleGlobalImportHistoryAction);
    el.importXlsxButton?.addEventListener("click", openXlsxImportPicker);
    el.xlsxImportInput?.addEventListener("change", handleXlsxImportFile);
    el.importReviewStats?.addEventListener("click", handleImportReviewFilterAction);
    el.importReviewPrograms?.addEventListener("click", handleImportFieldCopy);
    el.importReviewPrograms?.addEventListener("click", handleImportReviewAction);
    el.importReviewPrograms?.addEventListener("keydown", handleImportReviewKeyboardNavigation);
    el.importReviewPrograms?.addEventListener("input", handleImportReviewInput);
    el.importReviewPrograms?.addEventListener("change", handleImportReviewInput);
    el.importReviewPrograms?.addEventListener("pointerover", handlePassengerPreviewEnter);
    el.importReviewPrograms?.addEventListener("pointerout", handlePassengerPreviewLeave);
    el.importReviewPrograms?.addEventListener("focusin", handlePassengerPreviewFocusIn);
    el.importReviewPrograms?.addEventListener("focusout", handlePassengerPreviewFocusOut);
    document.addEventListener("keydown", handleImportHistoryShortcut);
    el.createPassenger?.addEventListener("click", createPassenger);
    el.passengerEditToggle?.addEventListener("click", togglePassengerEditMode);
    el.passengerEditClose?.addEventListener("click", closePassengerEditPopup);
    el.passengerEditOverlay?.addEventListener("click", (event) => {
      if (event.target === el.passengerEditOverlay) {
        closePassengerEditPopup();
      }
    });
    el.passengerMatchCancel?.addEventListener("click", () => resolvePassengerMatchReview({ action: "cancel" }));
    el.passengerMatchContinue?.addEventListener("click", () => resolvePassengerMatchReview({ action: "continue" }));
    el.passengerMatchOverlay?.addEventListener("click", (event) => {
      if (event.target === el.passengerMatchOverlay) {
        resolvePassengerMatchReview({ action: "cancel" });
      }
    });
    el.passengerMatchOverlay?.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || el.passengerMatchOverlay.hidden) return;
      resolvePassengerMatchReview({ action: "cancel" });
    });
    el.activationGuardReview?.addEventListener("click", () => resolveActivationGuard("review"));
    el.activationGuardSkip?.addEventListener("click", () => resolveActivationGuard("skip"));
    el.activationGuardActivate?.addEventListener("click", () => resolveActivationGuard("activate"));
    el.returnReceiveScopeReview?.addEventListener("click", () => resolveReturnReceiveScope("review"));
    el.returnReceiveScopeLast?.addEventListener("click", () => resolveReturnReceiveScope("last"));
    el.returnReceiveScopeAll?.addEventListener("click", () => resolveReturnReceiveScope("all"));
    el.clearAllFormsCancel?.addEventListener("click", () => resolveClearAllFormsConfirmation(false));
    el.clearAllFormsConfirm?.addEventListener("click", () => resolveClearAllFormsConfirmation(true));
    el.activationGuardOverlay?.addEventListener("click", (event) => {
      if (event.target === el.activationGuardOverlay) {
        resolveActivationGuard("review");
      }
    });
    el.returnReceiveScopeOverlay?.addEventListener("click", (event) => {
      if (event.target === el.returnReceiveScopeOverlay) {
        resolveReturnReceiveScope("review");
      }
    });
    el.clearAllFormsOverlay?.addEventListener("click", (event) => {
      if (event.target === el.clearAllFormsOverlay) {
        resolveClearAllFormsConfirmation(false);
      }
    });
    el.activationGuardOverlay?.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || el.activationGuardOverlay.hidden) return;
      resolveActivationGuard("review");
    });
    el.returnReceiveScopeOverlay?.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || el.returnReceiveScopeOverlay.hidden) return;
      resolveReturnReceiveScope("review");
    });
    el.clearAllFormsOverlay?.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || el.clearAllFormsOverlay.hidden) return;
      resolveClearAllFormsConfirmation(false);
    });
    el.passengerEditFields?.addEventListener("input", handlePassengerEditInput);
    el.passengerEditFields?.addEventListener("change", handlePassengerEditInput);
    const markPassengerEditEmptySignals = () => requestAnimationFrame(applyPassengerEditEmptySignals);
    el.passengerEditFields?.addEventListener("input", markPassengerEditEmptySignals);
    el.passengerEditFields?.addEventListener("change", markPassengerEditEmptySignals);
    el.passengerEditFields?.addEventListener("click", (event) => {
      if (event.target.closest(".custom-select-option") || event.target.closest(".custom-select-search")) {
        setTimeout(markPassengerEditEmptySignals, 0);
      }
    });
    const passengerEditObserver = new MutationObserver(() => {
      if (!el.passengerEditOverlay.hidden) markPassengerEditEmptySignals();
    });
    const passengerEditFieldsObserver = new MutationObserver(() => {
      if (!el.passengerEditOverlay.hidden) markPassengerEditEmptySignals();
    });
    passengerEditObserver.observe(el.passengerEditOverlay, { attributes: true, attributeFilter: ["hidden"] });
    passengerEditFieldsObserver.observe(el.passengerEditFields, { childList: true, subtree: true });
    markPassengerEditEmptySignals();
    el.addPassenger?.addEventListener("click", addPassengerRow);
    el.passengerEmpty?.addEventListener("click", addPassengerRow);
    el.passengerRows?.addEventListener("pointerdown", handlePassengerRowPointerDown);
    el.passengerRows?.addEventListener("click", handlePassengerRowAction);
    el.passengerRows?.addEventListener("input", handlePassengerRowInput);
    el.passengerRows?.addEventListener("pointerover", handlePassengerPreviewEnter);
    el.passengerRows?.addEventListener("pointerout", handlePassengerPreviewLeave);
    el.passengerRows?.addEventListener("focusin", handlePassengerPreviewFocusIn);
    el.passengerRows?.addEventListener("focusout", handlePassengerPreviewFocusOut);
    el.passengerPickerClose?.addEventListener("click", closePassengerPicker);
    el.passengerPickerCancel?.addEventListener("click", closePassengerPicker);
    el.passengerPickerOverlay?.addEventListener("click", (event) => {
      if (event.target === el.passengerPickerOverlay) {
        closePassengerPicker();
      }
    });
    el.passengerPickerSearch?.addEventListener("input", schedulePassengerPickerSearch);
    el.passengerPickerSearch?.addEventListener("keydown", handlePassengerPickerKeydown);
    el.passengerPickerResults?.addEventListener("click", handlePassengerPickerAction);
    el.toggleEnderecoPersonalizado?.addEventListener("click", toggleEnderecoPersonalizado);
    el.cliente?.addEventListener("change", () => {
      applyStatusFaturamentoDefault();
      renderStatusFaturamento();
    });
    el.destino?.addEventListener("input", syncReturnDefaults);
    el.enderecoPersonalizado?.addEventListener("input", () => {
      state.customAddressText = el.enderecoPersonalizado.value;
    });
    el.agendarRetorno?.addEventListener("change", () => {
      syncReturnDefaults();
      renderTabBadges();
    });
    el.repetirServico?.addEventListener("change", renderTabBadges);
    el.saidaData?.addEventListener("change", () => {
      syncLegacyTimePartsFromDateTime(el.saidaData, el.saidaHora, el.saidaMinuto);
      syncRepeatDefaultDates();
      syncReturnDefaults();
    });
    el.retornoData?.addEventListener("change", () => {
      syncLegacyTimePartsFromDateTime(el.retornoData, el.retornoHora, el.retornoMinuto);
    });
    el.retPrevDateTime?.addEventListener("change", () => {
      syncLegacyTimePartsFromDateTime(el.retPrevDateTime, el.retPrevHora, el.retPrevMinuto);
    });
    document.querySelectorAll("[data-obs]").forEach((button) => {
      button?.addEventListener("click", () => switchObs(button.dataset.obs, false));
    });
    document.querySelectorAll("[data-ret-obs]").forEach((button) => {
      button?.addEventListener("click", () => switchObs(button.dataset.retObs, true));
    });
    document?.addEventListener("click", handleGlobalCustomSelectClick);
    document?.addEventListener("keydown", handleGlobalCustomSelectKeydown);
    document?.addEventListener("scroll", handleGlobalCustomSelectScroll, { capture: true });
    document?.addEventListener("scroll", repositionPassengerPreview, { capture: true });
    window?.addEventListener("resize", repositionOpenCustomSelectPanels);
    window?.addEventListener("resize", repositionPassengerPreview);
    window?.addEventListener("resize", syncPassengerNameColumnWidth);
    window?.addEventListener("resize", syncDateTimeFieldRowWidths);
    window?.addEventListener("resize", syncViewportMetrics);
    window.visualViewport?.addEventListener("resize", syncViewportMetrics);
    window.visualViewport?.addEventListener("scroll", syncViewportMetrics);
    bindContentScrollBoundaryFeedback();
    bindInputFormatters();
    const appRoot = $("app");
    appRoot?.addEventListener("focusin", handleGlobalHistoryBeforeChange, true);
    appRoot?.addEventListener("pointerdown", handleGlobalHistoryBeforeChange, true);
    appRoot?.addEventListener("keydown", handleGlobalHistoryBeforeChange, true);
    appRoot?.addEventListener("input", handleOperationalInput);
    appRoot?.addEventListener("change", handleOperationalInput);
  }

  function bindContentScrollBoundaryFeedback() {
    const scroller = el.content;
    if (!scroller || scroller.dataset.scrollBoundaryFeedback === "1") return;
    scroller.dataset.scrollBoundaryFeedback = "1";

    scroller.addEventListener("touchstart", (event) => {
      contentTouchStartY = event.touches?.[0]?.clientY || 0;
      contentTouchPull = 0;
    }, { passive: true });

    scroller.addEventListener("touchmove", (event) => {
      const currentY = event.touches?.[0]?.clientY || contentTouchStartY;
      const deltaY = currentY - contentTouchStartY;
      if (deltaY < -8 && isScrollAtEnd(scroller)) {
        contentTouchPull = Math.max(contentTouchPull, Math.abs(deltaY));
        triggerContentScrollStretch("end", contentTouchPull);
      } else if (deltaY > 8 && isScrollAtStart(scroller)) {
        contentTouchPull = Math.max(contentTouchPull, deltaY);
        triggerContentScrollStretch("start", contentTouchPull);
      }
    }, { passive: true });

    scroller.addEventListener("touchend", resetContentScrollStretch, { passive: true });
    scroller.addEventListener("touchcancel", resetContentScrollStretch, { passive: true });
  }

  function isScrollAtStart(scroller) {
    return scroller.scrollTop <= 1;
  }

  function isScrollAtEnd(scroller) {
    return scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
  }

  function triggerContentScrollStretch(position, force = 24) {
    const scroller = el.content;
    if (!scroller) return;
    const pull = Math.min(1, Math.max(0.18, Math.abs(force) / 180));
    const distance = Math.round(4 + pull * 13);
    const scale = (1 + pull * 0.026).toFixed(3);
    scroller.classList.add("is-scroll-stretching");
    scroller.style.setProperty("--scroll-stretch-y", `${position === "start" ? distance : -distance}px`);
    scroller.style.setProperty("--scroll-stretch-scale", scale);
    scroller.style.setProperty("--scroll-stretch-origin", position === "start" ? "top" : "bottom");
  }

  function resetContentScrollStretch() {
    const scroller = el.content;
    if (!scroller) return;
    contentTouchPull = 0;
    scroller.classList.remove("is-scroll-stretching");
    scroller.style.setProperty("--scroll-stretch-y", "0px");
    scroller.style.setProperty("--scroll-stretch-scale", "1");
  }

  function bindInputFormatters() {
    initializePhoneCountrySelect();
    bindPhoneInput(el.bdTelefone);
    bindFormattedInput(el.bdEmail, normalizeEmail);
    bindFormattedInput(el.bdCr, normalizeCodeValue);
    bindFormattedInput(el.cr, normalizeCodeValue);
    bindCurrencyInput(el.cotacao);
    document.querySelectorAll("input[id*='cpf' i], input[name*='cpf' i]").forEach((input) => {
      bindFormattedInput(input, formatCpf);
      input.addEventListener("blur", () => {
        if (input.value.trim() && !isValidCpf(input.value)) {
          revealInvalidField(input, "CPF invalido.");
        } else {
          clearFieldValidation(input);
        }
      });
    });
    el.bdEmail?.addEventListener("blur", () => validateEmailControl(el.bdEmail, { tab: "bd" }));
  }

  function initializePhoneCountrySelect() {
    if (!el.bdTelefonePais || el.bdTelefonePais.dataset.phoneCountriesReady === "1") return;
    el.bdTelefonePais.dataset.phoneCountriesReady = "1";
    el.bdTelefonePais.innerHTML = "";
    PHONE_COUNTRY_OPTIONS.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.code;
      option.dataset.iso = country.iso;
      option.dataset.flag = country.flag || countryFlagFromIso(country.iso);
      option.dataset.flagImage = country.flagImage || "";
      option.dataset.name = country.name;
      option.dataset.search = `${country.name} ${country.iso} +${country.code}`;
      option.textContent = `${option.dataset.flag} ${country.name} +${country.code}`;
      option.title = country.name;
      el.bdTelefonePais.appendChild(option);
    });
    el.bdTelefonePais.value = "55";
    if (el.bdTelefone) el.bdTelefone.placeholder = "+55 11 99999-9999";
    el.bdTelefonePais.addEventListener("change", () => {
      applyPhoneCountrySelection(el.bdTelefone, selectedPhoneCountryCode());
      refreshCustomSelect(el.bdTelefonePais);
    });
  }

  function bindPhoneInput(input) {
    if (!input || input.dataset.phoneReady === "1") return;
    input.dataset.phoneReady = "1";
    input.addEventListener("input", () => {
      const previousCountryCode = selectedPhoneCountryCode();
      const parsed = parsePhoneNumberForInput(input.value, previousCountryCode, {
        manualCountry: input.dataset.phoneCountryManual === "1"
      });
      const next = parsed.formatted;
      if (input.value !== next) input.value = next;
      if (parsed.countryCode && parsed.countryCode !== previousCountryCode) {
        delete input.dataset.phoneCountryManual;
      }
      syncPhoneCountryFromParsed(parsed, { refreshDisplay: true });
      updatePhoneCountryHint(input, parsed);
    });
    input.addEventListener("blur", () => {
      const parsed = parsePhoneNumberForInput(input.value, selectedPhoneCountryCode(), {
        manualCountry: input.dataset.phoneCountryManual === "1"
      });
      input.value = parsed.formatted;
      validatePhoneControl(input);
    });
  }

  function bindFormattedInput(input, formatter) {
    if (!input || input.dataset.formatterReady === "1") return;
    input.dataset.formatterReady = "1";
    input.addEventListener("input", () => {
      const next = formatter(input.value);
      if (input.value !== next) input.value = next;
    });
    input.addEventListener("blur", () => {
      const next = formatter(input.value);
      if (input.value !== next) input.value = next;
    });
  }

  function bindCurrencyInput(input) {
    if (!input || input.dataset.currencyReady === "1") return;
    input.dataset.currencyReady = "1";
    input.addEventListener("input", () => {
      const next = sanitizeCurrencyInput(input.value);
      if (input.value !== next) input.value = next;
    });
    input.addEventListener("blur", () => {
      input.value = formatCurrencyDisplayValue(input.value);
    });
  }

  function addClassIfPresent(node, className) {
    const token = String(className || "").trim();
    if (node?.classList && token) node.classList.add(token);
  }

  function initializeCustomSelects() {
    document.querySelectorAll("select").forEach((select) => {
      if (select.hidden || select.dataset.nativeSelect === "true") return;
      ensureCustomSelect(select);
      refreshCustomSelect(select);
    });
  }

  function ensureCustomSelect(select) {
    if (!select || select.tagName !== "SELECT" || select.hidden || select.dataset.nativeSelect === "true" || select.dataset.customSelectReady === "1") return;
    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    addClassIfPresent(wrapper, `custom-select--${select.dataset.selectVariant || ""}`);

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "custom-select-trigger";
    trigger.setAttribute("aria-expanded", "false");

    const triggerText = document.createElement("span");
    triggerText.className = "custom-select-value";
    if (select.dataset.selectVariant === "phone-country") {
      triggerText.classList.add("custom-select-value--phone-country");
    }

    const clearButton = document.createElement("span");
    clearButton.role = "button";
    clearButton.tabIndex = 0;
    clearButton.className = "custom-select-clear";
    clearButton.setAttribute("aria-label", "Limpar seleção");
    clearButton.hidden = true;

    const triggerCaret = document.createElement("span");
    triggerCaret.className = "custom-select-caret";
    trigger.append(triggerText, clearButton, triggerCaret);

    const panel = document.createElement("div");
    panel.className = "custom-select-panel";
    addClassIfPresent(panel, `custom-select-panel--${select.dataset.selectVariant || ""}`);
    if (select.closest(".status-select")) {
      panel.classList.add("is-status");
    }
    panel.setAttribute("role", "listbox");
    panel.dataset.customSelectPanel = "";
    panel.tabIndex = -1;

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "custom-select-search";
    searchInput.placeholder = select.dataset.selectVariant === "phone-country" ? "Buscar país" : "Pesquisar";
    searchInput.autocomplete = "off";
    searchInput.spellcheck = false;
    searchInput.setAttribute("aria-label", "Pesquisar opção");

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "custom-select-options";

    const noResults = document.createElement("div");
    noResults.className = "custom-select-no-results";
    noResults.textContent = "Nenhuma opção encontrada";
    noResults.hidden = true;
    noResults.setAttribute("aria-live", "polite");

    const parent = select.parentNode;
    if (!parent) return;

    customSelectSeq += 1;
    panel.id = `custom-options-${customSelectSeq}`;
    trigger.setAttribute("aria-controls", panel.id);

    select.classList.add("custom-select-native");
    select.dataset.customSelectReady = "1";
    parent.insertBefore(wrapper, select);
    wrapper.append(select, trigger, panel);

    const state = {
      select,
      wrapper,
      trigger,
      triggerText,
      clearButton,
      panel,
      searchInput,
      optionsContainer,
      noResults
    };
    customSelectRoots.set(select, state);

    const onNativeChange = () => refreshCustomSelect(select);
    select?.addEventListener("change", onNativeChange);

    trigger?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (select.disabled) return;
      toggleCustomSelect(select);
    });

    trigger?.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        if (!select.disabled) {
          openCustomSelect(select);
        }
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeCustomSelect(select);
      }
    });

    clearButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearCustomSelectValue(select);
    });

    clearButton?.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        clearCustomSelectValue(select);
      }
    });

    searchInput?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    searchInput?.addEventListener("input", () => {
      renderCustomSelectOptions(select, state.searchInput.value);
    });

    searchInput?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCustomSelect(select);
      }
      if (event.key === "ArrowDown" && state.searchInput.value === "") {
        const first = state.optionsContainer.querySelector(".custom-select-option");
        if (first) first.focus();
      }
    });

    panel.append(searchInput, optionsContainer, noResults);

    refreshCustomSelect(select);
  }

  function refreshCustomSelect(select) {
    const state = customSelectRoots.get(select);
    if (!state) return;

    const { select: nativeSelect, triggerText, trigger, clearButton, panel } = state;
    const options = Array.from(nativeSelect.options || []);
    const selectedOption = options.find((option) => option.value === nativeSelect.value)
      || options.find((option) => option.selected)
      || options[0];

    setCustomSelectTriggerDisplay(triggerText, selectedOption, nativeSelect);
    if (nativeSelect.dataset.selectVariant === "phone-country" && selectedOption) {
      trigger.title = `${selectedOption.dataset.name || selectedOption.textContent} +${selectedOption.value}`;
    } else {
      trigger.removeAttribute("title");
    }
    triggerText.classList.toggle("is-placeholder", !selectedOption || selectedOption.value === "");
    if (clearButton) {
      clearButton.hidden = !isCustomSelectClearable(nativeSelect);
    }
    trigger.disabled = nativeSelect.disabled;
    if (state.wrapper.classList.contains("is-open")) {
      renderCustomSelectOptions(select, state.searchInput?.value || "");
    } else {
      state.optionsContainer.textContent = "";
      state.noResults.hidden = true;
      panel.classList.remove("is-empty");
    }
    panel.classList.toggle("is-disabled", nativeSelect.disabled);
    syncReturnPreviewTimeSelectWidths(nativeSelect);
  }

  function renderCustomSelectOptions(select, filterValue = "") {
    const state = customSelectRoots.get(select);
    if (!state) return;

    const {
      panel,
      optionsContainer,
      noResults,
      triggerText,
      select: nativeSelect
    } = state;

    const options = Array.from(nativeSelect.options || []).filter((option) => shouldRenderCustomSelectOption(option));
    const query = normalize(filterValue).trim();
    optionsContainer.innerHTML = "";
    noResults.hidden = true;

    const normalizedSelectedValue = String(nativeSelect.value || "");
    const hasMatches = options.some((option) => {
      const optionText = normalize(option.textContent);
      if (!query) return true;
      if (!optionText) return false;
      return optionText.includes(query);
    });

    if (!hasMatches) {
      panel.classList.add("is-empty");
      noResults.hidden = false;
      return;
    }

    panel.classList.remove("is-empty");
    options.forEach((option) => {
      const optionText = option.textContent;
      const normalizedOptionText = normalize(`${optionText} ${option.dataset.search || ""}`);
      if (query && !normalizedOptionText.includes(query)) return;

      const button = document.createElement("button");
      button.type = "button";
      button.role = "option";
      button.className = "custom-select-option";
      addClassIfPresent(button, `custom-select-option--${nativeSelect.dataset.selectVariant || ""}`);
      button.dataset.value = option.value || "";
      renderCustomSelectOptionContent(button, option);
      if (String(option.value) === normalizedSelectedValue) {
        button.classList.add("is-active");
        button.setAttribute("aria-selected", "true");
      } else {
        button.setAttribute("aria-selected", "false");
      }

      button?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (nativeSelect.disabled || option.disabled) return;
        nativeSelect.value = button.dataset.value;
        const eventChange = new Event("change", { bubbles: true });
        nativeSelect.dispatchEvent(eventChange);
        const eventInput = new Event("input", { bubbles: true });
        nativeSelect.dispatchEvent(eventInput);
        closeCustomSelect(nativeSelect);
        setCustomSelectTriggerDisplay(triggerText, option, nativeSelect);
      });

      optionsContainer.appendChild(button);
    });
  }

  function shouldRenderCustomSelectOption(option) {
    if (!option) return false;
    return option.value !== "";
  }

  function isCustomSelectClearable(select) {
    if (!select || select.disabled || select.required || select.getAttribute("aria-required") === "true") return false;
    if (select.dataset.selectVariant === "phone-country") return false;
    if (select.closest(".status-select")) return false;
    if (!select.value) return false;
    return Array.from(select.options || []).some((option) => option.value === "");
  }

  function clearCustomSelectValue(select) {
    if (!isCustomSelectClearable(select)) return;
    select.value = "";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    select.dispatchEvent(new Event("input", { bubbles: true }));
    refreshCustomSelect(select);
    closeCustomSelect(select);
  }

  function syncReturnPreviewTimeSelectWidths(select) {
    const group = select?.closest?.(".time-group--return-preview");
    if (!group) return;

    window.requestAnimationFrame(() => {
      const states = Array.from(group.querySelectorAll("select"))
        .map((item) => customSelectRoots.get(item))
        .filter(Boolean);
      if (!states.length) return;

      const maxWidth = states.reduce((largest, state) => {
        const trigger = state.trigger;
        const triggerText = state.triggerText;
        const clearButton = state.clearButton;
        if (!trigger || !triggerText) return largest;

        const style = window.getComputedStyle(trigger);
        const textStyle = window.getComputedStyle(triggerText);
        const paddingX = parseFloat(style.paddingLeft || "0") + parseFloat(style.paddingRight || "0");
        const borderX = parseFloat(style.borderLeftWidth || "0") + parseFloat(style.borderRightWidth || "0");
        const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
        const visibleClearWidth = clearButton && !clearButton.hidden ? clearButton.offsetWidth : 0;
        const visibleClearGap = visibleClearWidth ? gap : 0;
        const caretWidth = state.trigger.querySelector(".custom-select-caret")?.offsetWidth || 0;
        const textWidth = measureTextWidth(triggerText.textContent || "", textStyle.font);
        const needed = textWidth + paddingX + borderX + caretWidth + visibleClearWidth + gap + visibleClearGap + 6;
        return Math.max(largest, Math.ceil(needed));
      }, 0);

      if (maxWidth > 0) {
        group.style.setProperty("--return-preview-select-width", `${maxWidth}px`);
        states.forEach((state) => {
          [state.wrapper, state.trigger].forEach((element) => {
            if (!element) return;
            element.style.width = `${maxWidth}px`;
            element.style.minWidth = `${maxWidth}px`;
            element.style.maxWidth = `${maxWidth}px`;
          });
        });
      }
    });
  }

  function measureTextWidth(text, font) {
    if (!measureTextWidth.canvas) {
      measureTextWidth.canvas = document.createElement("canvas");
    }
    const context = measureTextWidth.canvas.getContext("2d");
    if (!context) return Math.ceil(String(text || "").length * 8);
    context.font = font || "14px sans-serif";
    return Math.ceil(context.measureText(String(text || "")).width);
  }

  function toggleCustomSelect(select) {
    const state = customSelectRoots.get(select);
    if (!state) return;
    const isOpen = state.wrapper.classList.contains("is-open");
    if (isOpen) {
      closeCustomSelect(select);
    } else {
      openCustomSelect(select);
    }
  }

  function openCustomSelect(select) {
    const state = customSelectRoots.get(select);
    if (!state || select.disabled) return;

    if (activeCustomSelect && activeCustomSelect !== state.wrapper) {
      closeCustomSelect(activeCustomSelect);
    }
    if (state.panel.parentElement !== document.body) {
      document.body.appendChild(state.panel);
    }
    state.wrapper.classList.add("is-open");
    state.panel.classList.add("is-open");
    if (state.searchInput) {
      state.searchInput.value = "";
      renderCustomSelectOptions(select, "");
      if (shouldAutofocusSearchInputs()) {
        window.setTimeout(() => state.searchInput.focus(), 10);
      }
    }
    updateCustomSelectPanelPosition(state);
    activeCustomSelect = state.wrapper;
    state.trigger.setAttribute("aria-expanded", "true");
    state.trigger.focus();
  }

  function updateCustomSelectPanelPosition(state) {
    if (!state || !state.wrapper.classList.contains("is-open")) return;
    const rect = state.trigger.getBoundingClientRect();
    const viewport = currentViewportMetrics();
    const viewportHeight = viewport.height;
    const viewportWidth = viewport.width;
    const viewportTop = viewport.offsetTop;
    const viewportLeft = viewport.offsetLeft;
    const viewportBottom = viewportTop + viewportHeight;
    const viewportRight = viewportLeft + viewportWidth;
    const safeInset = 8;
    const availableWidth = Math.max(120, viewportWidth - safeInset * 2);
    const minWidth = state.select?.dataset?.selectVariant === "phone-country" ? 280 : 140;
    const desiredWidth = Math.max(minWidth, Math.ceil(rect.width || state.trigger.offsetWidth || 120));
    const width = Math.max(120, Math.min(availableWidth, desiredWidth));
    const maxHeight = Math.min(260, Math.max(120, Math.floor(viewportHeight * 0.42)));
    const spaceBelow = viewportBottom - rect.bottom - safeInset;
    const spaceAbove = rect.top - viewportTop - safeInset;
    const menuHeight = Math.min(maxHeight, Math.max(80, state.panel.scrollHeight || 0));
    const showAbove = spaceBelow < Math.min(maxHeight, 180) && spaceAbove > spaceBelow;
    const top = showAbove
      ? Math.max(viewportTop + safeInset, rect.top - menuHeight - safeInset)
      : Math.min(viewportBottom - menuHeight - safeInset, rect.bottom + safeInset);

    const safeLeft = Math.max(viewportLeft + safeInset, Math.min(rect.left, viewportRight - width - safeInset));

    state.panel.style.left = `${safeLeft}px`;
    state.panel.style.top = `${Math.max(viewportTop + safeInset, top)}px`;
    state.panel.style.width = `${width}px`;
    state.panel.style.maxHeight = `${maxHeight}px`;
  }

  function closeCustomSelect(selectOrWrapper) {
    const state = getCustomSelectState(selectOrWrapper);
    const wrapper = state?.wrapper;
    if (!state || !wrapper) return;
    const trigger = wrapper.querySelector(".custom-select-trigger");
    wrapper.classList.remove("is-open");
    state.panel.classList.remove("is-open");
    state.optionsContainer.textContent = "";
    state.noResults.hidden = true;
    state.panel.classList.remove("is-empty");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (activeCustomSelect === wrapper) activeCustomSelect = null;
  }

  function getCustomSelectState(target) {
    if (!target) return null;
    if (target.tagName === "SELECT") return customSelectRoots.get(target);
    if (target.nodeType === 1 && target.classList?.contains("custom-select")) return customSelectRoots.get(target.querySelector(".custom-select-native"));
    return null;
  }

  function closeAllCustomSelects() {
    document.querySelectorAll(".custom-select.is-open").forEach((wrapper) => {
      closeCustomSelect(wrapper);
    });
  }

  function handleGlobalCustomSelectClick(event) {
    if (event.target.closest(".custom-select")) return;
    if (event.target.closest(".custom-select-panel")) return;
    closeAllCustomSelects();
  }

  function handleGlobalCustomSelectScroll() {
    if (!document.querySelector(".custom-select.is-open")) return;
    repositionOpenCustomSelectPanels();
  }

  function handleGlobalCustomSelectKeydown(event) {
    if (event.key !== "Escape") return;
    closeAllCustomSelects();
  }

  let customSelectPositionRaf = null;
  function repositionOpenCustomSelectPanels() {
    if (customSelectPositionRaf) return;
    customSelectPositionRaf = requestAnimationFrame(() => {
      customSelectPositionRaf = null;
      document.querySelectorAll(".custom-select.is-open").forEach((wrapper) => {
        const native = wrapper.querySelector("select.custom-select-native");
        if (!native) return;
        const state = customSelectRoots.get(native);
        updateCustomSelectPanelPosition(state);
      });
    });
  }

  async function loadReferenceData() {
    await Promise.all([
      loadChoices(CONFIG.entities.reserva, CONFIG.fields.reserva.status, "statusOperacao", FALLBACK.statusOperacao),
      loadChoices(CONFIG.entities.reserva, CONFIG.fields.reserva.statusFaturamento, "statusFaturamento", FALLBACK.statusFaturamento),
      loadChoices(CONFIG.entities.reserva, CONFIG.fields.reserva.tipoServico, "tipoServico", FALLBACK.tipoServico),
      loadChoices(CONFIG.entities.reserva, CONFIG.fields.reserva.tipoVeiculo, "tipoVeiculo", FALLBACK.tipoVeiculo),
      loadChoices(CONFIG.entities.reserva, CONFIG.fields.reserva.formaPagamento, "formaPagamento", FALLBACK.formaPagamento),
      loadChoices(CONFIG.entities.passageiro, CONFIG.fields.passageiro.status, "bdStatus", FALLBACK.bdStatus),
      loadChoices(CONFIG.entities.passageiro, CONFIG.fields.passageiro.classificacao, "bdClassificacao", FALLBACK.bdClassificacao),
      loadChoices(CONFIG.entities.passageiro, CONFIG.fields.passageiro.sexo, "bdSexo", FALLBACK.bdSexo),
      loadChoices(CONFIG.entities.passageiro, CONFIG.fields.passageiro.idioma, "bdIdioma", FALLBACK.bdIdioma),
      loadChoices(CONFIG.entities.passageiro, CONFIG.fields.passageiro.cargo, "bdCargo", FALLBACK.bdCargo),
      loadChoices(CONFIG.entities.passageiro, CONFIG.fields.passageiro.tipoVeiculo, "bdTipoVeiculo", FALLBACK.bdTipoVeiculo),
      loadLookups()
    ]);
  }

  async function loadChoices(entity, attribute, targetKey, fallback) {
    if (!state.xrm || state.mockMode) {
      state.options[targetKey] = fallback;
      return;
    }
    try {
      const clientUrl = state.xrm.Utility.getGlobalContext().getClientUrl();
      const url = [
        clientUrl,
        "/api/data/v9.2/EntityDefinitions(LogicalName='",
        entity,
        "')/Attributes(LogicalName='",
        attribute,
        "')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)"
      ].join("");
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0"
        }
      });
      if (!response.ok) throw new Error(`Metadata ${entity}.${attribute}: ${response.status}`);
      const data = await response.json();
      const options = (data.OptionSet?.Options || [])
        .map((item) => ({
          value: item.Value,
          label: item.Label?.UserLocalizedLabel?.Label || String(item.Value)
        }))
        .filter((item) => item.value !== null && item.value !== undefined);
      state.options[targetKey] = options.length ? options : fallback;
    } catch (error) {
      console.warn(error);
      state.options[targetKey] = fallback;
    }
  }

  async function loadLookups() {
    if (!state.xrm || state.mockMode) {
      loadMockLookups();
      return;
    }

    const f = CONFIG.fields;
    const [clientes, passageiros, motoristas, ops] = await Promise.all([
      retrieveAll(CONFIG.entities.cliente, `?$select=${f.cliente.id},${f.cliente.nome}&$orderby=${f.cliente.nome} asc&$top=5000`),
      retrieveAll(CONFIG.entities.passageiro, `?$select=${passengerSelectFields()}&$orderby=${f.passageiro.nome} asc&$top=${INITIAL_PASSENGER_LOOKUP_LIMIT}`),
      retrieveAll(CONFIG.entities.funcionario, `?$select=${f.funcionario.id},${f.funcionario.nome},${f.funcionario.apelido}&$orderby=${f.funcionario.apelido} asc,${f.funcionario.nome} asc&$top=5000`),
      retrieveAll(CONFIG.entities.financeiro, `?$select=${f.financeiro.id},${f.financeiro.label},createdon&$orderby=createdon desc&$top=500`)
    ]);

    state.passageiros = uniquePassengersById(passageiros.map(mapPassageiro))
      .sort((a, b) => (a.label || "").localeCompare(b.label || "", "pt-BR"));
    state.clientes = sortByLabel(clientes.map((r) => ({
      id: r[f.cliente.id],
      label: r[f.cliente.nome] || "(cliente)"
    })));
    state.motoristas = sortByLabel(motoristas.map((r) => ({
      id: r[f.funcionario.id],
      label: r[f.funcionario.apelido] || r[f.funcionario.nome] || "(motorista)",
      nomeCompleto: r[f.funcionario.nome] || "",
      search: [r[f.funcionario.apelido], r[f.funcionario.nome]].filter(Boolean).join(" ")
    })));
    state.ordensPagamento = ops.map((r) => ({
      id: r[f.financeiro.id],
      label: r[f.financeiro.label] || r[f.financeiro.id]
    }));
  }

  function passengerSelectFields() {
    const f = CONFIG.fields.passageiro;
    return [
      f.id,
      f.nome,
      f.telefone,
      f.email,
      f.enderecoSaida,
      f.preferencias,
      f.cr,
      f.status,
      f.classificacao,
      f.sexo,
      f.idioma,
      f.cargo,
      f.nascimento,
      f.departamento,
      f.tipoVeiculo,
      "_cr40f_cliente_value"
    ].join(",");
  }

  async function searchPassengersServer(term, limit = 25) {
    const search = String(term || "").trim();
    if (!state.xrm || state.mockMode) {
      return searchPassengersLocal(search, limit);
    }

    const f = CONFIG.fields.passageiro;
    if (!normalize(search)) {
      const rows = await retrieveAll(
        CONFIG.entities.passageiro,
        `?$select=${passengerSelectFields()}&$orderby=${f.nome} asc&$top=${limit}`
      );
      return mergePassengerRecords(rows.map(mapPassageiro));
    }

    const escaped = escapeODataString(search);
    const digits = onlyDigits(search);
    const filters = [
      `contains(${f.nome},'${escaped}')`,
      `contains(${f.email},'${escaped}')`,
      `contains(${f.telefone},'${escaped}')`,
      `contains(${f.cr},'${escaped}')`
    ];
    if (digits.length >= 4) {
      filters.push(`contains(${f.telefone},'${escapeODataString(digits.slice(-4))}')`);
    }
    if (digits.length >= 8) {
      filters.push(`contains(${f.telefone},'${escapeODataString(digits.slice(-8))}')`);
    }
    if (digits.length >= 4 && digits !== search) {
      filters.push(`contains(${f.telefone},'${escapeODataString(digits)}')`);
    }

    const rows = await retrieveAll(
      CONFIG.entities.passageiro,
      `?$select=${passengerSelectFields()}&$filter=${filters.join(" or ")}&$orderby=${f.nome} asc&$top=${limit}`
    );
    return mergePassengerRecords(rows.map(mapPassageiro));
  }

  function searchPassengersLocal(term, limit = 25) {
    const query = normalize(term);
    const digits = onlyDigits(term);
    const rows = state.passageiros.filter((passenger) => {
      if (!query && !digits) return true;
      const haystack = normalize([
        passenger.label,
        passenger.telefone,
        passenger.email,
        passenger.clienteLabel,
        passenger.cr,
        passenger.departamento
      ].filter(Boolean).join(" "));
      return haystack.includes(query) || (digits && onlyDigits(passenger.telefone).includes(digits));
    });
    return rows.slice(0, limit);
  }

  async function ensurePassengersByIds(ids) {
    const requested = Array.from(new Set((ids || []).map(cleanGuid).filter(Boolean)));
    const missing = requested.filter((id) => !state.passageiros.some((passenger) => sameId(passenger.id, id)));
    if (!missing.length) return [];
    if (!state.xrm || state.mockMode) {
      return state.passageiros.filter((passenger) => requested.some((id) => sameId(id, passenger.id)));
    }

    const f = CONFIG.fields.passageiro;
    const batches = [];
    for (let index = 0; index < missing.length; index += 20) {
      batches.push(missing.slice(index, index + 20));
    }
    const rows = [];
    for (const batch of batches) {
      const filter = batch.map((id) => `${f.id} eq ${id}`).join(" or ");
      rows.push(...await retrieveAll(CONFIG.entities.passageiro, `?$select=${passengerSelectFields()}&$filter=${filter}`));
    }
    return mergePassengerRecords(rows.map(mapPassageiro));
  }

  function mergePassengerRecords(records) {
    const merged = [];
    records.forEach((passenger) => {
      if (!passenger?.id) return;
      const index = state.passageiros.findIndex((item) => sameId(item.id, passenger.id));
      if (index >= 0) {
        state.passageiros[index] = { ...state.passageiros[index], ...passenger };
        merged.push(state.passageiros[index]);
        return;
      }
      state.passageiros.push(passenger);
      merged.push(passenger);
    });
    state.passageiros.sort((a, b) => (a.label || "").localeCompare(b.label || "", "pt-BR"));
    return merged;
  }

  function escapeODataString(value) {
    return String(value || "").replace(/'/g, "''");
  }

  function onlyDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function sortByLabel(rows) {
    return [...(rows || [])].sort((a, b) => (a.label || "").localeCompare(b.label || "", "pt-BR", { sensitivity: "base" }));
  }

  function getCustomSelectDisplayText(option, select = null) {
    if (!option) return "";
    if (option.value === "" && select?.dataset?.placeholderLabel) {
      return select.dataset.placeholderLabel;
    }
    if (option.dataset?.flag && option.dataset?.name) {
      if (select?.dataset?.selectVariant === "phone-country") {
        return `${option.dataset.flag} +${option.value}`;
      }
      return `${option.dataset.flag} ${option.dataset.name} +${option.value}`;
    }
    return option.textContent.trim();
  }

  function renderCustomSelectOptionContent(button, option) {
    if (option.dataset?.subtitle) {
      const name = document.createElement("span");
      name.className = "custom-select-option-name";
      name.textContent = option.textContent.trim();
      const subtitle = document.createElement("span");
      subtitle.className = "custom-select-option-subtitle";
      subtitle.textContent = option.dataset.subtitle;
      button.append(name, subtitle);
      return;
    }
    if (option.dataset?.flag && option.dataset?.name) {
      const main = document.createElement("span");
      main.className = "custom-select-option-main";
      const flag = createCountryFlagNode(option);
      const name = document.createElement("span");
      name.className = "custom-select-option-name";
      name.textContent = option.dataset.name;
      const code = document.createElement("span");
      code.className = "custom-select-option-code";
      code.textContent = `+${option.value}`;
      main.append(flag, name);
      button.append(main, code);
      const check = document.createElement("span");
      check.className = "custom-select-option-check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";
      button.append(check);
      return;
    }
    button.textContent = option.textContent;
  }

  function setCustomSelectTriggerDisplay(triggerText, option, select) {
    triggerText.innerHTML = "";
    if (!option) {
      triggerText.textContent = "Selecione";
      return;
    }
    if (select?.dataset?.selectVariant === "phone-country") {
      const flagNode = createCountryFlagNode(option);
      triggerText.append(flagNode);
      return;
    }
    triggerText.textContent = getCustomSelectDisplayText(option, select) || "Selecione";
  }

  function createCountryFlagNode(option = null) {
    const flag = option?.dataset?.flag || "";
    if (!option?.dataset?.flagImage) {
      const fallback = document.createElement("span");
      fallback.className = "custom-select-option-flag custom-select-option-flag--emoji";
      fallback.textContent = flag || "";
      return fallback;
    }

    const wrapper = document.createElement("span");
    wrapper.className = "custom-select-option-flag";
    const img = document.createElement("img");
    img.className = "country-flag-image";
    img.src = option.dataset.flagImage;
    img.loading = "lazy";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.alt = "";
    img.onerror = () => {
      wrapper.className = "custom-select-option-flag custom-select-option-flag--emoji";
      wrapper.textContent = flag || "";
      wrapper.querySelector("img")?.remove();
    };
    wrapper.appendChild(img);
    return wrapper;
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeCodeValue(value) {
    return String(value || "").trimStart().replace(/\s+/g, " ").toUpperCase();
  }

  function normalizePassengerDisplayName(value) {
    const text = String(value || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return "";
    const smallWords = new Set(["da", "de", "do", "das", "dos", "e"]);
    const romanNumerals = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i;

    return text
      .split(" ")
      .filter(Boolean)
      .map((part, index) => {
        const lowerPart = part.toLowerCase();
        if (index > 0 && smallWords.has(lowerPart)) return lowerPart;
        if (romanNumerals.test(lowerPart)) return lowerPart.toUpperCase();
        return lowerPart.replace(/(^|[-'])\p{L}/gu, (chunk) => chunk.toUpperCase());
      })
      .join(" ");
  }

  function countryFlagFromIso(isoValue) {
    return String(isoValue || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((iso) => iso
        .trim()
        .toUpperCase()
        .slice(0, 2)
        .replace(/[A-Z]/g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0))))
      .join(" ");
  }

  function countryFlagImageFromIso(isoValue) {
    const iso = String(isoValue || "").trim().split(/\s+/)[0] || "";
    if (!iso) return "";
    return `https://flagcdn.com/24x18/${iso.toLowerCase()}.png`;
  }

  const PHONE_COUNTRY_OPTIONS = [
    { iso: "BR", code: "55", name: "Brasil" },
    { iso: "US CA", code: "1", name: "EUA / Canadá" },
    { iso: "PT", code: "351", name: "Portugal" },
    { iso: "AR", code: "54", name: "Argentina" },
    { iso: "CL", code: "56", name: "Chile" },
    { iso: "CO", code: "57", name: "Colômbia" },
    { iso: "MX", code: "52", name: "México" },
    { iso: "GB", code: "44", name: "Reino Unido" },
    { iso: "ES", code: "34", name: "Espanha" },
    { iso: "FR", code: "33", name: "França" },
    { iso: "IT", code: "39", name: "Itália" },
    { iso: "DE", code: "49", name: "Alemanha" },
    { iso: "JP", code: "81", name: "Japão" },
    { iso: "CN", code: "86", name: "China" },
    { iso: "IN", code: "91", name: "Índia" },
    { iso: "AE", code: "971", name: "Emirados Árabes" },
    { iso: "ZA", code: "27", name: "África do Sul" },
    { iso: "AL", code: "355", name: "Albânia" },
    { iso: "SA", code: "966", name: "Arábia Saudita" },
    { iso: "DZ", code: "213", name: "Argélia" },
    { iso: "AU", code: "61", name: "Austrália" },
    { iso: "AT", code: "43", name: "Áustria" },
    { iso: "BH", code: "973", name: "Bahrein" },
    { iso: "BE", code: "32", name: "Bélgica" },
    { iso: "BO", code: "591", name: "Bolívia" },
    { iso: "BG", code: "359", name: "Bulgária" },
    { iso: "QA", code: "974", name: "Catar" },
    { iso: "SG", code: "65", name: "Singapura" },
    { iso: "KR", code: "82", name: "Coreia do Sul" },
    { iso: "CR", code: "506", name: "Costa Rica" },
    { iso: "CU", code: "53", name: "Cuba" },
    { iso: "DK", code: "45", name: "Dinamarca" },
    { iso: "EC", code: "593", name: "Equador" },
    { iso: "EG", code: "20", name: "Egito" },
    { iso: "SV", code: "503", name: "El Salvador" },
    { iso: "SK", code: "421", name: "Eslováquia" },
    { iso: "SI", code: "386", name: "Eslovênia" },
    { iso: "FI", code: "358", name: "Finlândia" },
    { iso: "GR", code: "30", name: "Grécia" },
    { iso: "GT", code: "502", name: "Guatemala" },
    { iso: "NL", code: "31", name: "Países Baixos" },
    { iso: "HN", code: "504", name: "Honduras" },
    { iso: "HK", code: "852", name: "Hong Kong" },
    { iso: "HU", code: "36", name: "Hungria" },
    { iso: "ID", code: "62", name: "Indonésia" },
    { iso: "IE", code: "353", name: "Irlanda" },
    { iso: "IL", code: "972", name: "Israel" },
    { iso: "LU", code: "352", name: "Luxemburgo" },
    { iso: "MA", code: "212", name: "Marrocos" },
    { iso: "NO", code: "47", name: "Noruega" },
    { iso: "NZ", code: "64", name: "Nova Zelândia" },
    { iso: "PA", code: "507", name: "Panamá" },
    { iso: "PY", code: "595", name: "Paraguai" },
    { iso: "PE", code: "51", name: "Peru" },
    { iso: "PL", code: "48", name: "Polônia" },
    { iso: "CZ", code: "420", name: "República Tcheca" },
    { iso: "RO", code: "40", name: "Romênia" },
    { iso: "RU KZ", code: "7", name: "Rússia / Cazaquistão" },
    { iso: "SE", code: "46", name: "Suécia" },
    { iso: "CH", code: "41", name: "Suíça" },
    { iso: "TH", code: "66", name: "Tailândia" },
    { iso: "TW", code: "886", name: "Taiwan" },
    { iso: "TR", code: "90", name: "Turquia" },
    { iso: "UA", code: "380", name: "Ucrânia" },
    { iso: "UY", code: "598", name: "Uruguai" },
    { iso: "VE", code: "58", name: "Venezuela" },
    { iso: "VN", code: "84", name: "Vietnã" }
  ].map((country) => ({
    ...country,
    flag: countryFlagFromIso(country.iso),
    flagImage: countryFlagImageFromIso(country.iso)
  }));

  const PHONE_COUNTRY_CODES = Array.from(
    new Map(PHONE_COUNTRY_OPTIONS.map((country) => [country.code, country.name])).entries()
  ).sort((a, b) => b[0].length - a[0].length);
  const PHONE_COUNTRY_FORMATS = {
    1: { max: 10, min: 10, groups: [3, 3, 4], template: "us" },
    33: { max: 9, min: 9, groups: [1, 2, 2, 2, 2] },
    34: { max: 9, min: 9, groups: [3, 3, 3] },
    39: { max: 10, min: 6, groups: [3, 3, 4] },
    44: { max: 10, min: 10, groups: [4, 3, 3] },
    49: { max: 11, min: 7, groups: [3, 4, 4] },
    52: { max: 10, min: 10, groups: [2, 4, 4] },
    54: { max: 10, min: 10, groups: [2, 4, 4] },
    55: { max: 11, min: 10, template: "br" },
    56: { max: 9, min: 9, groups: [1, 4, 4] },
    57: { max: 10, min: 10, groups: [3, 3, 4] },
    81: { max: 10, min: 10, groups: [2, 4, 4] },
    86: { max: 11, min: 11, groups: [3, 4, 4] },
    91: { max: 10, min: 10, groups: [5, 5] },
    351: { max: 9, min: 9, groups: [3, 3, 3] },
    971: { max: 9, min: 8, groups: [2, 3, 4] }
  };

  function formatPhoneNumber(value) {
    const parsed = parsePhoneNumber(value);
    return parsed.formatted;
  }

  function formatPhoneNumberForCountry(value, countryCode) {
    const parsed = parsePhoneNumberForSelectedCountry(value, countryCode);
    return parsed.formatted;
  }

  function parsePhoneNumber(value, preferredCountryCode = "") {
    const original = String(value || "").trim();
    if (!original) return emptyPhoneResult();

    const normalized = original
      .replace(/[^\d+]/g, "")
      .replace(/(?!^)\+/g, "");
    const hasExplicitPlus = normalized.startsWith("+");
    let digits = onlyDigits(normalized);
    if (!digits) return emptyPhoneResult();
    if (!hasExplicitPlus && digits.startsWith("00") && digits.length > 4) {
      digits = digits.slice(2);
    }
    digits = digits.slice(0, 15);

    const selectedCountryCode = String(preferredCountryCode || "").trim();
    const explicitInternational = hasExplicitPlus || original.startsWith("00") || (!selectedCountryCode && digits.length > 11 && !digits.startsWith("0"));
    if (!explicitInternational && selectedCountryCode && selectedCountryCode !== "55") {
      const selectedFormat = PHONE_COUNTRY_FORMATS[selectedCountryCode];
      let nationalDigits = digits;
      if (nationalDigits.startsWith(selectedCountryCode)) {
        const withoutDuplicatedDdi = normalizeNationalForCountry(selectedCountryCode, nationalDigits.slice(selectedCountryCode.length));
        if (isValidInternationalPhone(selectedCountryCode, withoutDuplicatedDdi) || nationalDigits.length > (selectedFormat?.max || phoneNationalMaxLength(selectedCountryCode))) {
          nationalDigits = withoutDuplicatedDdi;
        }
      }
      nationalDigits = normalizeNationalForCountry(selectedCountryCode, nationalDigits);
      const country = getPhoneCountryByCode(selectedCountryCode);
      const formatted = `+${selectedCountryCode}${nationalDigits ? ` ${formatInternationalNationalNumber(selectedCountryCode, nationalDigits)}` : ""}`;
      const isValid = isValidInternationalPhone(selectedCountryCode, nationalDigits);
      return {
        formatted,
        e164: isValid ? `+${selectedCountryCode}${nationalDigits}` : "",
        digits: `${selectedCountryCode}${nationalDigits}`.slice(0, 15),
        countryCode: selectedCountryCode,
        countryName: country?.name || country?.[1] || "DDI selecionado",
        national: nationalDigits,
        isInternational: true,
        isValid,
        message: isValid ? "" : "Telefone deve ter entre 4 e 14 digitos depois do DDI."
      };
    }

    if (!explicitInternational) {
      const nationalDigits = normalizeNationalForCountry("55", digits);
      const formatted = formatBrazilianPhone(nationalDigits);
      const isValid = isValidBrazilianPhone(nationalDigits);
      return {
        formatted,
        e164: isValid ? `+55${nationalDigits}` : "",
        digits: nationalDigits,
        countryCode: "55",
        countryName: "Brasil",
        national: nationalDigits,
        isInternational: false,
        isValid,
        message: isValid ? "" : "Telefone brasileiro deve ter DDD e 10 ou 11 digitos."
      };
    }

    const country = detectPhoneCountry(digits);
    const countryCode = country?.code || country?.[0] || "";
    const countryName = country?.name || country?.[1] || "DDI nao identificado";
    const national = countryCode ? normalizeNationalForCountry(countryCode, digits.slice(countryCode.length)) : digits;
    const fullDigits = countryCode ? `${countryCode}${national}`.slice(0, 15) : digits;
    const formatted = countryCode
      ? `+${countryCode}${national ? ` ${formatInternationalNationalNumber(countryCode, national)}` : ""}`
      : `+${groupDigits(digits)}`;
    const isValid = !!countryCode && isValidInternationalPhone(countryCode, national);
    return {
      formatted,
      e164: isValid ? `+${fullDigits}` : "",
      digits: fullDigits,
      countryCode,
      countryName,
      national,
      isInternational: true,
      isValid,
      message: !countryCode
        ? "DDI nao identificado. Use formato internacional com codigo do pais."
        : countryCode === "55" && !isValidBrazilianPhone(national)
          ? "Telefone brasileiro deve ter DDD e 10 ou 11 digitos."
          : "Telefone deve ter entre 8 e 15 digitos no formato internacional."
      };
  }

  function parsePhoneNumberForInput(value, preferredCountryCode = "", options = {}) {
    const preferred = parsePhoneNumber(value, preferredCountryCode);
    const normalized = String(value || "").trim();
    const digits = onlyDigits(normalized);
    const explicitInternational = normalized.startsWith("+") || normalized.startsWith("00");
    const plainInternational = digits.length > 11 && !digits.startsWith("0");
    const detected = parsePhoneNumber(value, "");
    const preferredCode = String(preferredCountryCode || "55");

    if (!detected?.countryCode) return preferred;
    if (detected.countryCode === preferredCode) return detected;
    if (explicitInternational) return detected;
    if (!options.manualCountry && plainInternational && detected.isValid) return detected;
    return preferred;
  }

  function parsePhoneNumberForSelectedCountry(value, countryCode) {
    const selectedCountryCode = String(countryCode || "55");
    const nationalDigits = normalizeNationalForCountry(
      selectedCountryCode,
      phoneNationalDigitsForCountrySelection(value, selectedCountryCode)
    );
    return parsePhoneNumber(nationalDigits, selectedCountryCode);
  }

  function phoneStorageValue(value, preferredCountryCode = undefined) {
    const countryCode = preferredCountryCode === undefined ? selectedPhoneCountryCode() : preferredCountryCode;
    const parsed = parsePhoneNumberForInput(value, countryCode);
    return parsed.isValid && parsed.e164 ? parsed.e164 : String(value || "").trim();
  }

  function phonePlaceholderForCountry(countryCode) {
    const code = String(countryCode || "55");
    if (code === "55") return "+55 11 99999-9999";
    return `+${code}`;
  }

  function applyPhoneCountrySelection(input, countryCode) {
    if (!input) return;
    input.dataset.phoneCountryManual = "1";
    input.placeholder = phonePlaceholderForCountry(countryCode);
    const parsed = parsePhoneNumberForSelectedCountry(input.value, countryCode);
    input.value = parsed.formatted;
    updatePhoneCountryHint(input, parsed);
    if (!parsed.digits) {
      clearFieldValidation(input);
      return;
    }
    if (parsed.isValid) {
      clearFieldValidation(input);
      return;
    }
    markFieldInvalid(input, parsed.message || "Telefone invalido.");
  }

  function resetPhoneControl() {
    if (el.bdTelefonePais) {
      el.bdTelefonePais.value = "55";
      refreshCustomSelect(el.bdTelefonePais);
    }
    if (el.bdTelefone) {
      el.bdTelefone.value = "";
      el.bdTelefone.placeholder = phonePlaceholderForCountry("55");
      delete el.bdTelefone.dataset.phoneCountry;
      delete el.bdTelefone.dataset.phoneCountryManual;
    }
  }

  function phoneNationalDigitsForCountrySelection(value, selectedCountryCode = "") {
    const original = String(value || "").trim();
    let digits = onlyDigits(original);
    if (!digits) return "";
    if (!original.startsWith("+") && digits.startsWith("00") && digits.length > 4) {
      digits = digits.slice(2);
    }

    const detected = detectPhoneCountry(digits);
    if ((original.startsWith("+") || original.startsWith("00")) && detected?.code) {
      return digits.slice(detected.code.length);
    }

    const selectedCode = String(selectedCountryCode || "");
    if (selectedCode && digits.startsWith(selectedCode)) {
      const withoutSelectedCode = digits.slice(selectedCode.length);
      if (isValidInternationalPhone(selectedCode, normalizeNationalForCountry(selectedCode, withoutSelectedCode))) {
        return withoutSelectedCode;
      }
    }

    if (detected?.code && detected.code !== selectedCode && digits.length > 11) {
      return digits.slice(detected.code.length);
    }

    return digits;
  }

  function normalizeNationalForCountry(countryCode, nationalValue) {
    const code = String(countryCode || "");
    let national = onlyDigits(nationalValue).slice(0, phoneNationalMaxLength(code));
    if (code === "55") {
      if (national.length === 12 && national.startsWith("0")) return national.slice(1);
      if ([13, 14].includes(national.length) && national.startsWith("0")) return national.slice(3);
      return national;
    }
    if (code && code !== "39" && national.startsWith("0")) {
      const withoutTrunk = national.slice(1);
      if (isValidInternationalPhone(code, withoutTrunk)) return withoutTrunk;
    }
    return national;
  }

  function phoneNationalMaxLength(countryCode) {
    return Math.max(4, 15 - String(countryCode || "").length);
  }

  function formatBrazilianPhone(digitsValue) {
    const digits = onlyDigits(digitsValue).slice(0, phoneNationalMaxLength("55"));
    if (digits.length <= 2) return digits;
    const ddd = digits.slice(0, 2);
    const number = digits.slice(2);
    if (number.length <= 4) return `(${ddd}) ${number}`;
    if (number.length <= 8) return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
    const formatted = `(${ddd}) ${number.slice(0, 5)}-${number.slice(5, 9)}`;
    const extra = number.slice(9);
    return extra ? `${formatted} ${extra}` : formatted;
  }

  function formatInternationalNationalNumber(countryCode, nationalValue) {
    const format = PHONE_COUNTRY_FORMATS[String(countryCode)];
    const national = onlyDigits(nationalValue).slice(0, phoneNationalMaxLength(countryCode));
    if (!national) return "";
    if (format?.template === "br") return formatBrazilianPhone(national);
    if (format?.template === "us") return formatGroupedPhone(national, format.groups, { parenthesizeFirst: national.length > 3 });
    if (format?.groups) return formatGroupedPhone(national, format.groups);
    return groupDigits(national);
  }

  function formatGroupedPhone(digitsValue, groups, options = {}) {
    const digits = onlyDigits(digitsValue);
    const parts = [];
    let cursor = 0;
    groups.forEach((size) => {
      if (cursor >= digits.length) return;
      parts.push(digits.slice(cursor, cursor + size));
      cursor += size;
    });
    if (cursor < digits.length) parts.push(digits.slice(cursor));
    if (options.parenthesizeFirst && parts[0]) {
      if (parts.length === 1) return `(${parts[0]}`;
      const rest = parts.slice(1).join("-");
      return `(${parts[0]}) ${rest}`;
    }
    return parts.join(" ");
  }

  function groupDigits(value) {
    const digits = onlyDigits(value);
    if (digits.length <= 4) return digits;
    const groups = [];
    let remaining = digits;
    while (remaining.length > 4) {
      const size = remaining.length > 10 ? 3 : remaining.length > 7 ? 3 : remaining.length > 4 ? 4 : remaining.length;
      groups.push(remaining.slice(0, size));
      remaining = remaining.slice(size);
    }
    if (remaining) groups.push(remaining);
    return groups.join(" ");
  }

  function detectPhoneCountry(digitsValue) {
    const digits = onlyDigits(digitsValue);
    const option = PHONE_COUNTRY_OPTIONS.find((country) => digits.startsWith(country.code));
    if (option) return option;
    const fallback = PHONE_COUNTRY_CODES.find(([code]) => digits.startsWith(code));
    return fallback ? { code: fallback[0], name: fallback[1] } : null;
  }

  function getPhoneCountryByCode(code) {
    const normalized = String(code || "");
    const option = PHONE_COUNTRY_OPTIONS.find((country) => country.code === normalized);
    if (option) return option;
    const fallback = PHONE_COUNTRY_CODES.find(([countryCode]) => countryCode === normalized);
    return fallback ? { code: fallback[0], name: fallback[1] } : null;
  }

  function selectedPhoneCountryCode() {
    return el.bdTelefonePais?.value || "55";
  }

  function syncPhoneCountryFromParsed(parsed, { refreshDisplay = false } = {}) {
    if (!el.bdTelefonePais || !parsed?.countryCode) return;
    if ([...el.bdTelefonePais.options].some((option) => option.value === parsed.countryCode)) {
      const previousCode = el.bdTelefonePais.value;
      el.bdTelefonePais.value = parsed.countryCode;
      if (el.bdTelefone) el.bdTelefone.placeholder = phonePlaceholderForCountry(parsed.countryCode);
      if (refreshDisplay && previousCode !== el.bdTelefonePais.value && el.bdTelefonePais.dataset.customSelectReady === "1") {
        refreshCustomSelect(el.bdTelefonePais);
      }
    }
  }

  function isValidInternationalPhone(countryCode, nationalValue) {
    const national = onlyDigits(nationalValue);
    if (countryCode === "55") return isValidBrazilianPhone(national);
    const format = PHONE_COUNTRY_FORMATS[String(countryCode)];
    if (format) {
      return national.length >= format.min && national.length <= format.max && !/^(\d)\1+$/.test(national);
    }
    return national.length >= 4 && national.length <= Math.max(4, 15 - String(countryCode).length) && !/^(\d)\1+$/.test(national);
  }

  function isValidBrazilianPhone(value) {
    const digits = onlyDigits(value);
    if (![10, 11].includes(digits.length)) return false;
    const ddd = Number(digits.slice(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    const local = digits.slice(2);
    if (/^(\d)\1+$/.test(local)) return false;
    return true;
  }

  function emptyPhoneResult() {
    return {
      formatted: "",
      e164: "",
      digits: "",
      countryCode: "",
      countryName: "",
      national: "",
      isInternational: false,
      isValid: true,
      message: ""
    };
  }

  function formatCpf(value) {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  function isValidCpf(value) {
    const digits = onlyDigits(value);
    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
    const calculateDigit = (length) => {
      const sum = digits
        .slice(0, length)
        .split("")
        .reduce((total, digit, index) => total + Number(digit) * (length + 1 - index), 0);
      const rest = (sum * 10) % 11;
      return rest === 10 ? 0 : rest;
    };
    return calculateDigit(9) === Number(digits[9]) && calculateDigit(10) === Number(digits[10]);
  }

  function loadMockLookups() {
    state.clientes = [
      { id: "cliente-embraer", label: "Embraer" },
      { id: "cliente-tenaris", label: "Tenaris" },
      { id: "cliente-demo", label: "Cliente Demo" },
      { id: "cliente-betalabs", label: "Beta Labs" },
      { id: "cliente-holding", label: "Holding Sul" }
    ];
    state.passageiros = [
      {
        id: "pax-1",
        label: "Maria Souza",
        telefone: "(11) 99999-0000",
        email: "maria@example.com",
        endereco: "Av. Paulista, 1000 - São Paulo/SP",
        preferencias: "Sem janela na volta",
        cr: "CR001",
        clienteId: "cliente-demo",
        tipoVeiculo: "Sedan",
        status: 30,
        classificacao: 40,
        sexo: 51,
        idioma: 60,
        cargo: 70,
        nascimento: "",
        departamento: "Diretoria"
      },
      {
        id: "pax-2",
        label: "Carlos Mendes",
        telefone: "(11) 98888-2222",
        email: "carlos.mendes@example.com",
        endereco: "Rua Oscar Freire, 250 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        cr: "CR002",
        clienteId: "cliente-betalabs",
        tipoVeiculo: "SUV",
        status: 30,
        classificacao: 42,
        sexo: 50,
        idioma: 60,
        cargo: 72,
        nascimento: "",
        departamento: "Compras"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      },
      {
        id: "pax-3",
        label: "Juliana Lima",
        telefone: "(11) 97777-3333",
        email: "juliana.lima@example.com",
        endereco: "Alameda Santos, 700 - São Paulo/SP",
        preferencias: "Silêncio no trajeto",
        preferencias: "Ar ligado leve",
        cr: "CR003",
        clienteId: "cliente-holding",
        tipoVeiculo: "VAN",
        status: 30,
        classificacao: 41,
        sexo: 51,
        idioma: 61,
        cargo: 73,
        nascimento: "",
        departamento: "Operacoes"
      }
    ];
    const storedPassengers = getMockDb().passageiros;
    state.passageiros = uniquePassengersById([...state.passageiros, ...storedPassengers].map(normalizeMockPassengerChoices));
    state.motoristas = [
      { id: "mot-1", label: "Carlos Motorista" },
      { id: "mot-2", label: "Rafael Costa" },
      { id: "mot-3", label: "Patricia Lima" }
    ];
    state.ordensPagamento = [
      { id: "op-1", label: "OP-1012" },
      { id: "op-2", label: "OP-1099" },
      { id: "op-3", label: "OP-1134" }
    ];
  }

  function normalizeMockPassengerChoices(passenger) {
    const classificacaoMap = {
      40: 202410000,
      41: 202410001,
      42: 202410002,
      43: 202410003
    };
    const sexoMap = {
      50: 202410000,
      51: 202410001
    };
    const idiomaMap = {
      60: 202410000,
      61: 202410001,
      62: 202410002
    };
    const cargoMap = {
      70: 202410000,
      71: 202410003,
      72: 202410005,
      73: 202410006,
      74: 202410004
    };
    const tipoVeiculoMap = {
      SEDAN: 202410000,
      SUV: 202410001,
      VAN: 202410003
    };
    return {
      ...passenger,
      status: 202410001,
      classificacao: classificacaoMap[passenger.classificacao] ?? passenger.classificacao,
      sexo: sexoMap[passenger.sexo] ?? passenger.sexo,
      idioma: idiomaMap[passenger.idioma] ?? passenger.idioma,
      cargo: cargoMap[passenger.cargo] ?? passenger.cargo,
      tipoVeiculo: tipoVeiculoMap[String(passenger.tipoVeiculo || "").toUpperCase()] ?? passenger.tipoVeiculo
    };
  }

  function uniquePassengersById(rows) {
    const seen = new Set();
    return rows.filter((passenger) => {
      const id = cleanGuid(passenger?.id).toLowerCase();
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function getMockDb() {
    try {
      const raw = localStorage.getItem(MOCK_STORE_KEY);
      if (!raw) {
        return { reservas: [], relacoes: [], passageiros: [] };
      }
      const parsed = JSON.parse(raw);
      return {
        reservas: Array.isArray(parsed?.reservas) ? parsed.reservas : [],
        relacoes: Array.isArray(parsed?.relacoes) ? parsed.relacoes : [],
        passageiros: Array.isArray(parsed?.passageiros) ? parsed.passageiros : []
      };
    } catch (error) {
      console.warn("Falha ao ler mock db", error);
      return { reservas: [], relacoes: [], passageiros: [] };
    }
  }

  function setMockDb(next) {
    localStorage.setItem(MOCK_STORE_KEY, JSON.stringify({
      reservas: Array.isArray(next?.reservas) ? next.reservas : [],
      relacoes: Array.isArray(next?.relacoes) ? next.relacoes : [],
      passageiros: Array.isArray(next?.passageiros) ? next.passageiros : []
    }));
  }

  function persistMockPassengerRecord(passenger) {
    if (state.xrm && !state.mockMode) return passenger;
    const cleanPassengerId = cleanGuid(passenger?.id || "");
    if (!cleanPassengerId) return passenger;
    const db = getMockDb();
    const now = new Date().toISOString();
    const record = {
      ...passenger,
      id: cleanPassengerId,
      updatedOn: now
    };
    const index = db.passageiros.findIndex((item) => sameId(item.id, cleanPassengerId));
    if (index >= 0) {
      db.passageiros[index] = {
        ...db.passageiros[index],
        ...record
      };
    } else {
      db.passageiros.push({
        ...record,
        createdOn: now
      });
    }
    db.passageiros = uniquePassengersById(db.passageiros);
    setMockDb(db);
    return record;
  }

  function getMockRecordById(recordId) {
    return getMockDb().reservas.find((item) => sameId(item[CONFIG.fields.reserva.id], recordId));
  }

  function getMockRelations(recordId) {
    return getMockDb().relacoes.filter((item) => sameId(item.reservaId, recordId));
  }

  function upsertMockRecord(payload, id) {
    const db = getMockDb();
    const recordId = cleanGuid(id || `mock-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`);
    const readable = payload[CONFIG.fields.reserva.readableId] || `R-${recordId.slice(-6).toUpperCase()}`;
    const saved = {
      ...state.record,
      ...payload,
      [CONFIG.fields.reserva.id]: recordId,
      [CONFIG.fields.reserva.readableId]: readable,
      updatedOn: new Date().toISOString()
    };
    const idx = db.reservas.findIndex((item) => sameId(item[CONFIG.fields.reserva.id], recordId));
    if (idx >= 0) {
      db.reservas[idx] = saved;
    } else {
      db.reservas.push({ ...saved, createdOn: new Date().toISOString() });
    }
    setMockDb(db);
    state.record = db.reservas[idx >= 0 ? idx : db.reservas.length - 1];
    return { id: recordId };
  }

  function replaceMockRelations(reservaId, passengers, includeAddress) {
    const db = getMockDb();
    const relationPassengers = uniquePassengerRelationItems(passengers);
    db.relacoes = db.relacoes.filter((item) => !sameId(item.reservaId, reservaId));
    for (const item of relationPassengers) {
      db.relacoes.push({
        reservaId,
        ordem: Number(item.ordem),
        passageiroId: cleanGuid(item.guid || ""),
        passageiroLabel: item.passageiro?.label || "(passageiro)",
        passageiroTelefone: item.telefone || "",
        endereco: includeAddress ? item.enderecoSaidaBD || "" : ""
      });
    }
    setMockDb(db);
  }

  function hydrateMockCurrentRecord(recordId) {
    const record = getMockRecordById(recordId);
    if (!record) {
      toast(`Registro ${recordId} não encontrado no mock db. Abrindo como novo`, "warning", 5000);
      state.isNew = true;
      state.recordId = "";
      state.selectedPassengers = [];
      state.enderecoRascunho = [];
      return;
    }

    const f = CONFIG.fields.reserva;
    const relations = getMockRelations(recordId);
    state.record = record;
    state.relacoes = relations;
    state.enderecoPersonalizadoAtivo = !!record[f.enderecoPersonalizado] || relations.every((item) => !item.endereco);
    state.selectedPassengers = relations.length
      ? relations.map((rel, index) => {
        const pax = state.passageiros.find((item) => sameId(item.id, rel.passageiroId)) || {
            id: rel.passageiroId,
            label: rel.passageiroLabel || "(passageiro)",
            telefone: rel.passageiroTelefone || "",
            endereco: "",
            preferencias: "",
            email: "",
            cr: "",
            tipoVeiculo: ""
          };
          return {
            rowKey: nextPassengerRowKey(),
            ordem: Number(rel.ordem || index + 1),
            passageiro: pax,
            guid: pax.id,
            telefone: pax.telefone || "",
            enderecoEditado: state.enderecoPersonalizadoAtivo ? "" : (rel.endereco || pax.endereco || "")
          };
        })
      : [];
    hydratePassengerSelectionRecencyFromRows(state.selectedPassengers);
    state.enderecoRascunho = state.selectedPassengers.map((item) => ({
      ordem: item.ordem,
      endereco: item.enderecoEditado || ""
    }));
  }

  function mapPassageiro(record) {
    const f = CONFIG.fields.passageiro;
    const clienteLookup = "_cr40f_cliente_value";
    return {
      id: record[f.id],
      label: record[f.nome] || record[`${clienteLookup}@OData.Community.Display.V1.FormattedValue`] || "(passageiro)",
      telefone: formatPhoneNumber(record[f.telefone] || ""),
      email: record[f.email] || "",
      endereco: record[f.enderecoSaida] || "",
      preferencias: record[f.preferencias] || "",
      cr: record[f.cr] || "",
      status: record[f.status] || "",
      classificacao: record[f.classificacao] || "",
      sexo: record[f.sexo] || "",
      idioma: record[f.idioma] || "",
      cargo: record[f.cargo] || "",
      nascimento: record[f.nascimento] || "",
      departamento: record[f.departamento] || "",
      tipoVeiculo: record[f.tipoVeiculo] || "",
      tipoVeiculoLabel: record[`${f.tipoVeiculo}@OData.Community.Display.V1.FormattedValue`] || "",
      clienteId: record[clienteLookup] || "",
      clienteLabel: record[`${clienteLookup}@OData.Community.Display.V1.FormattedValue`] || ""
    };
  }

  async function retrieveAll(entity, options) {
    if (!state.xrm) return [];
    const rows = [];
    let query = options.startsWith("?") ? options : `?${options}`;
    while (query) {
      const result = await state.xrm.WebApi.retrieveMultipleRecords(entity, query);
      rows.push(...(result.entities || []));
      query = result.nextLink ? `?${result.nextLink.split("?")[1]}` : "";
    }
    return rows;
  }

  async function loadCurrentRecord() {
    if (!state.recordId) {
      state.selectedPassengers = [emptyPassenger(1)];
      state.enderecoRascunho = [{ ordem: 1, endereco: "" }];
      return;
    }
    state.isNew = false;
    if (!state.xrm || state.mockMode) {
      hydrateMockCurrentRecord(state.recordId);
      return;
    }

    const f = CONFIG.fields.reserva;
    const select = [
      f.id,
      f.readableId,
      f.enderecoView,
      f.enderecoPersonalizado,
      f.destino,
      f.status,
      f.statusFaturamento,
      f.dataSaida,
      f.previsaoRetorno,
      f.tipoServico,
      f.tipoVeiculo,
      f.obsOperacao,
      f.obsInterna,
      f.obsFinal,
      f.perfilPassageiro,
      f.email,
      f.paxView,
      f.trajeto,
      f.cotacao,
      f.receber,
      f.cr,
      f.formaPagamento,
      "_cr40f_cliente_value",
      "_cr40f_solicitante_value",
      "_cr40f_motorista_value",
      "_cr40f_financeiro_value"
    ].join(",");

    const [record, relacoes] = await Promise.all([
      state.xrm.WebApi.retrieveRecord(CONFIG.entities.reserva, state.recordId, `?$select=${select}`),
      retrieveAll(
        CONFIG.entities.servicoPassageiro,
        `?$select=${CONFIG.fields.servicoPassageiro.id},${CONFIG.fields.servicoPassageiro.ordem},${CONFIG.fields.servicoPassageiro.endereco},_cr40f_bancodedados_value&$filter=_cr40f_geral_value eq ${state.recordId}&$orderby=${CONFIG.fields.servicoPassageiro.ordem} asc`
      )
    ]);
    state.record = record;
    state.relacoes = relacoes;
    await ensurePassengersByIds([
      state.record._cr40f_solicitante_value,
      ...state.relacoes.map((rel) => rel._cr40f_bancodedados_value)
    ]);

    const hasCustom = !!state.record[f.enderecoPersonalizado];
    const hasRelations = state.relacoes.length > 0;
    const anyRelationAddress = state.relacoes.some((r) => !!r[CONFIG.fields.servicoPassageiro.endereco]);
    state.enderecoPersonalizadoAtivo = hasCustom || (hasRelations && !anyRelationAddress);

    state.selectedPassengers = state.relacoes.length
      ? state.relacoes.map((rel, index) => {
          const paxId = rel._cr40f_bancodedados_value;
          const pax = state.passageiros.find((item) => sameId(item.id, paxId)) || {
            id: paxId,
            label: rel["_cr40f_bancodedados_value@OData.Community.Display.V1.FormattedValue"] || "(passageiro)",
            telefone: "",
            endereco: "",
            preferencias: "",
            email: "",
            cr: "",
            tipoVeiculo: ""
          };
          return {
            rowKey: nextPassengerRowKey(),
            ordem: Number(rel[CONFIG.fields.servicoPassageiro.ordem] || index + 1),
            passageiro: pax,
            guid: pax.id,
            telefone: pax.telefone || "",
            enderecoEditado: state.enderecoPersonalizadoAtivo ? "" : (rel[CONFIG.fields.servicoPassageiro.endereco] || pax.endereco || "")
          };
        })
      : [emptyPassenger(1)];
    hydratePassengerSelectionRecencyFromRows(state.selectedPassengers);

    state.enderecoRascunho = state.selectedPassengers.map((item) => ({
      ordem: item.ordem,
      endereco: item.enderecoEditado || ""
    }));
    return;
  }

  function hydrateForm() {
    const r = state.record || {};
    const f = CONFIG.fields.reserva;
    updateSaveButtonText();
    document.documentElement.classList.toggle("is-editing-service", !state.isNew);
    el.tabImport.hidden = !state.isNew;
    el.tabBd.hidden = !state.isNew;
    el.tabReturn.hidden = !state.isNew;
    el.tabRepeat.hidden = !state.isNew;
    if (el.importXlsxButton) el.importXlsxButton.hidden = !state.isNew;
    if (el.xlsxImportInput) el.xlsxImportInput.disabled = !state.isNew;
    el.opWrap.hidden = state.isNew;
    el.recordIdBox.hidden = state.isNew;
    el.recordIdText.textContent = r[f.readableId] || "";

    const saida = r[f.dataSaida] ? new Date(r[f.dataSaida]) : null;
    const prevRet = r[f.previsaoRetorno] ? new Date(r[f.previsaoRetorno]) : null;
    setDateTimeFields(saida || new Date(), el.saidaData, el.saidaHora, el.saidaMinuto);
    setDateTimeFields(prevRet, el.retPrevDateTime, el.retPrevHora, el.retPrevMinuto, true);

    setSelectValue(el.statusOperacao, r[f.status], findOptionValue("statusOperacao", "Confirmado"));
    setSelectValue(el.statusFaturamento, r[f.statusFaturamento], findOptionValue("statusFaturamento", "Pendente"));
    setSelectValue(el.tipoServico, r[f.tipoServico]);
    setSelectValue(el.tipoVeiculo, r[f.tipoVeiculo]);
    setSelectValue(el.formaPagamento, r[f.formaPagamento]);
    setSelectValue(el.cliente, r._cr40f_cliente_value);
    setSelectValue(el.solicitante, r._cr40f_solicitante_value);
    setSelectValue(el.motorista, r._cr40f_motorista_value);
    setSelectValue(el.op, r._cr40f_financeiro_value);

    el.trajeto.value = r[f.trajeto] || "";
    el.destino.value = r[f.destino] || "";
    el.cotacao.value = formatCurrencyDisplayValue(r[f.cotacao] ?? "");
    el.cr.value = normalizeCodeValue(r[f.cr] || "");
    el.receber.checked = !!r[f.receber];
    setFieldValue(el.receberRetorno, false);
    state.obs.motorista = r[f.obsOperacao] || "";
    state.obs.interna = r[f.obsInterna] || "";
    state.obs.final = r[f.obsFinal] || "";
    state.obs.passageiro = r[f.perfilPassageiro] || "";
    el.observacao.value = state.obs.motorista;

    if (state.enderecoPersonalizadoAtivo) {
      el.enderecoPersonalizado.value = r[f.enderecoPersonalizado] || r[f.enderecoView] || composeEnderecoCompleto();
    }

    syncRepeatDefaultDates();
    syncReturnDefaults();
    applyPassengerDefaults(false);
    applyStatusFaturamentoDefault();
  }

  function renderAll() {
    renderChoiceSelect(el.statusOperacao, state.options.statusOperacao);
    renderStatusFaturamento();
    renderChoiceSelect(el.tipoServico, sortByLabel(state.options.tipoServico));
    renderChoiceSelect(el.tipoVeiculo, state.options.tipoVeiculo);
    renderChoiceSelect(el.formaPagamento, state.options.formaPagamento);
    renderLookupSelect(el.cliente, sortByLabel(state.clientes));
    renderLookupSelect(el.bdCliente, sortByLabel(state.clientes));
    renderLookupSelect(el.solicitante, state.passageiros);
    renderLookupSelect(el.motorista, sortByLabel(state.motoristas));
    renderLookupSelect(el.op, state.ordensPagamento);
    renderChoiceSelect(el.bdClassificacao, state.options.bdClassificacao);
    renderChoiceSelect(el.bdSexo, state.options.bdSexo);
    renderChoiceSelect(el.bdIdioma, state.options.bdIdioma);
    renderChoiceSelect(el.bdCargo, state.options.bdCargo);
    renderChoiceSelect(el.bdTipoVeiculo, state.options.bdTipoVeiculo);
    hydrateForm();
    renderScheduleDrafts();
    renderPassengers();
    renderTabBadges();
    renderImportReview();
    renderGlobalImportHistoryControls();
  }

  function renderStatusFaturamento() {
    const current = el.statusFaturamento.value;
    renderChoiceSelect(el.statusFaturamento, state.options.statusFaturamento);
    setSelectValue(el.statusFaturamento, current || el.statusFaturamento.dataset.defaultValue || findOptionValue("statusFaturamento", "Pendente"));
  }

  function renderChoiceSelect(select, options) {
    if (!select) return;
    const previous = select.value;
    select.innerHTML = '<option value=""></option>';
    options.forEach((item) => {
      const option = document.createElement("option");
      option.value = String(item.value);
      option.textContent = item.label;
      select.appendChild(option);
    });
    if (previous) select.value = previous;
    if (!select.hidden) {
      ensureCustomSelect(select);
      refreshCustomSelect(select);
    }
  }

  function renderLookupSelect(select, rows) {
    if (!select) return;
    const isSolicitante = select === el.solicitante;
    const isPersonClient = isSolicitante || select.dataset.selectVariant === "person-client";
    if (isPersonClient) {
      select.dataset.selectVariant = "person-client";
    }
    const previous = select.value;
    select.innerHTML = '<option value=""></option>';
    rows.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      if (isPersonClient && item.clienteLabel) option.dataset.subtitle = item.clienteLabel;
      if (item.disabled) option.disabled = true;
      option.dataset.search = [item.search, item.clienteLabel].filter(Boolean).join(" ");
      select.appendChild(option);
    });
    if (previous) select.value = previous;
    if (!select.hidden) {
      ensureCustomSelect(select);
      if (isPersonClient) {
        const custom = customSelectRoots.get(select);
        custom?.wrapper?.classList.add("custom-select--person-client");
        custom?.panel?.classList.add("custom-select-panel--person-client");
      }
      refreshCustomSelect(select);
    }
  }

  function getPassengerById(passengerId) {
    return state.passageiros.find((item) => sameId(item.id, passengerId)) || null;
  }

  function getPassengerEditFields() {
    const f = CONFIG.fields.passageiro;
    return [
      { key: "label", label: "Nome do passageiro", kind: "text", required: true, span: "wide", stateKey: "label", payloadField: f.nome, inputType: "text" },
      { key: "telefone", label: "Telefone", kind: "text", stateKey: "telefone", payloadField: f.telefone, inputType: "tel" },
      { key: "email", label: "Email", kind: "text", span: "wide", stateKey: "email", payloadField: f.email, inputType: "email" },
      { key: "endereco", label: "Endereço de saída", kind: "textarea", span: "wide", stateKey: "endereco", payloadField: f.enderecoSaida },
      { key: "clienteId", label: "Cliente", kind: "lookup", required: true, stateKey: "clienteId", navName: CONFIG.nav.cliente, entitySet: CONFIG.entitySets.cliente, rowsKey: "clientes" },
      { key: "classificacao", label: "Classificação", kind: "choice", required: true, stateKey: "classificacao", payloadField: f.classificacao, optionsKey: "bdClassificacao" },
      { key: "idioma", label: "Idioma", kind: "choice", required: true, stateKey: "idioma", payloadField: f.idioma, optionsKey: "bdIdioma" },
      { key: "sexo", label: "Sexo", kind: "choice", stateKey: "sexo", payloadField: f.sexo, optionsKey: "bdSexo" },
      { key: "cargo", label: "Cargo", kind: "choice", stateKey: "cargo", payloadField: f.cargo, optionsKey: "bdCargo" },
      { key: "departamento", label: "Departamento", kind: "text", stateKey: "departamento", payloadField: f.departamento, inputType: "text" },
      { key: "cr", label: "CR", kind: "text", stateKey: "cr", payloadField: f.cr, inputType: "text" },
      { key: "nascimento", label: "Data de nascimento", kind: "date", stateKey: "nascimento", payloadField: f.nascimento },
      { key: "preferencias", label: "Perfil do passageiro", kind: "textarea", span: "wide", stateKey: "preferencias", payloadField: f.preferencias },
      { key: "tipoVeiculo", label: "Tipo de veículo", kind: "choice", stateKey: "tipoVeiculo", payloadField: f.tipoVeiculo, optionsKey: "bdTipoVeiculo" }
    ];
  }

  function getPassengerEditField(fieldKey) {
    return getPassengerEditFields().find((field) => field.key === fieldKey) || null;
  }

  function getImportedPassengerEditFields() {
    return [
      { key: "nome", label: "Nome do passageiro", kind: "text", required: true, span: "wide", stateKey: "nome", inputType: "text" },
      { key: "telefone", label: "Telefone", kind: "text", stateKey: "telefone", inputType: "tel" },
      { key: "email", label: "Email", kind: "text", span: "wide", stateKey: "email", inputType: "email" },
      { key: "centroCusto", label: "CR", kind: "text", stateKey: "centroCusto", inputType: "text" }
    ];
  }

  function getImportedPassengerEditField(fieldKey) {
    return getImportedPassengerEditFields().find((field) => field.key === fieldKey) || null;
  }

  function getImportedSolicitanteEditFields() {
    return getImportedPassengerEditFields().map((field) => (
      field.key === "nome" ? { ...field, label: "Nome do solicitante" } : field
    ));
  }

  function getImportedSolicitanteEditField(fieldKey) {
    return getImportedSolicitanteEditFields().find((field) => field.key === fieldKey) || null;
  }

  function openPassengerEdit(passengerOrId) {
    const passenger = typeof passengerOrId === "object"
      ? passengerOrId
      : getPassengerById(passengerOrId);
    const passengerId = cleanGuid(passenger?.id || passengerOrId);
    if (!passenger || !passengerId) {
      toast("Passageiro não encontrado para edição.", "error");
      return;
    }
    if (!getPassengerById(passengerId)) {
      toast("Passageiro fora da lista local. Recarregue a tela antes de editar.", "error", 6000);
      return;
    }

    if (activeImportedPassengerEditRef) {
      flushPassengerEditSaves();
      activeImportedPassengerEditRef = null;
    }
    if (activePassengerEditId && !sameId(activePassengerEditId, passengerId)) {
      flushPassengerEditSaves(activePassengerEditId);
    }
    activePassengerEditId = passengerId;
    passengerEditEnabled = false;
    renderPassengerEditHeader(passenger);
    renderPassengerEditFields(passenger);
    setPassengerEditMode(false);
    el.passengerEditOverlay.hidden = false;
  }

  function openImportedPassengerEdit(programacao, trechoKey, passengerIndex) {
    const cleanIndex = Number(passengerIndex);
    const trecho = findImportedTrecho(programacao, trechoKey);
    const passenger = trecho?.passageiros?.[cleanIndex] || null;
    if (!passenger) {
      toast("Passageiro importado não encontrado.", "error", 5000);
      return;
    }
    if (trecho.duplicatedRecordIds?.length) {
      toast("Serviço repetido não permite editar passageiro nesta tela.", "warning", 6000);
      return;
    }

    const passengerId = cleanGuid(passenger.passageiroId || "");
    if (passengerId) {
      const existing = importedResolvedPassenger(passenger);
      if (existing && !getPassengerById(passengerId)) mergePassengerRecords([existing]);
      openPassengerEdit(passengerId);
      return;
    }

    if (activePassengerEditId || activeImportedPassengerEditRef) {
      flushPassengerEditSaves(activePassengerEditId);
    }
    activePassengerEditId = "";
    activeImportedPassengerEditRef = {
      programacao,
      trechoKey,
      passengerIndex: cleanIndex
    };
    passengerEditEnabled = false;
    renderPassengerEditHeader(importedPassengerPreviewRecord(passenger));
    renderImportedPassengerEditFields(passenger);
    setPassengerEditMode(false);
    if (el.passengerEditOverlay) el.passengerEditOverlay.hidden = false;
  }

  function openImportedSolicitanteEdit(programacao, trechoKey) {
    const trecho = findImportedTrecho(programacao, trechoKey);
    if (!trecho) {
      toast("Solicitante importado não encontrado.", "error", 5000);
      return;
    }
    if (trecho.duplicatedRecordIds?.length) {
      toast("Serviço repetido não permite editar solicitante nesta tela.", "warning", 6000);
      return;
    }

    const rows = importedSolicitanteLookupRows(trecho);
    const selectedValue = resolveImportedSolicitanteSelectValue(trecho, rows);
    if (!selectedValue) {
      toast("Adicione um solicitante antes de editar.", "warning", 5000);
      return;
    }

    if (!isImportedSolicitanteTempId(selectedValue)) {
      openPassengerEdit(selectedValue);
      return;
    }

    const draft = importedSolicitanteEditableRecord(trecho, selectedValue, rows);
    if (!draft.nome) {
      toast("Solicitante importado sem nome.", "error", 5000);
      return;
    }

    syncImportedSolicitanteDraft(trecho, draft);
    if (activePassengerEditId || activeImportedPassengerEditRef) {
      flushPassengerEditSaves(activePassengerEditId);
    }
    activePassengerEditId = "";
    activeImportedPassengerEditRef = {
      programacao,
      trechoKey,
      target: "solicitante"
    };
    passengerEditEnabled = false;
    renderPassengerEditHeader(importedSolicitantePreviewRecord(trecho, trecho.solicitanteRecordId, rows));
    renderImportedSolicitanteEditFields(trecho);
    setPassengerEditMode(false);
    if (el.passengerEditOverlay) el.passengerEditOverlay.hidden = false;
  }

  function renderPassengerEditHeader(passenger, preserveStatus = false) {
    if (el.passengerEditTitle) {
      el.passengerEditTitle.textContent = passenger.label || "Passageiro sem nome";
    }
    if (!preserveStatus) {
      setPassengerEditStatus("", "");
    }
  }

  function renderPassengerEditFields(passenger) {
    renderPassengerEditFieldsWithSchema(getPassengerEditFields(), passenger);
  }

  function renderImportedPassengerEditFields(passenger) {
    renderPassengerEditFieldsWithSchema(getImportedPassengerEditFields(), passenger);
  }

  function renderImportedSolicitanteEditFields(trecho) {
    renderPassengerEditFieldsWithSchema(getImportedSolicitanteEditFields(), importedSolicitanteEditableRecord(trecho));
  }

  function renderPassengerEditFieldsWithSchema(fields, passenger) {
    if (!el.passengerEditFields) return;
    el.passengerEditFields.innerHTML = "";
    const layout = resolvePassengerEditLayout(fields);
    fields.forEach((field, index) => {
      const row = document.createElement("div");
      row.className = "passenger-edit-field";
      row.classList.toggle("is-wide", layout[index] === "wide");
      row.classList.toggle("is-multiline", field.kind === "textarea");
      row.dataset.fieldKey = field.key;

      const head = document.createElement("div");
      head.className = "passenger-edit-field-head";

      const label = document.createElement("span");
      label.textContent = field.required ? `${field.label} *` : field.label;

      head.append(label);

      const control = buildPassengerEditControl(field, passenger);

      row.append(head, control);
      el.passengerEditFields.appendChild(row);

      if (control.tagName === "SELECT") {
        ensureCustomSelect(control);
        refreshCustomSelect(control);
      }
    });
  }

  function resolvePassengerEditLayout(fields) {
    const layout = Array(fields.length).fill("single");
    let pendingSingleIndex = null;

    fields.forEach((field, index) => {
      if (field.span === "wide") {
        if (pendingSingleIndex !== null) {
          layout[pendingSingleIndex] = "wide";
          pendingSingleIndex = null;
        }
        layout[index] = "wide";
        return;
      }

      if (pendingSingleIndex === null) {
        pendingSingleIndex = index;
        return;
      }

      layout[pendingSingleIndex] = "single";
      layout[index] = "single";
      pendingSingleIndex = null;
    });

    if (pendingSingleIndex !== null) {
      layout[pendingSingleIndex] = "wide";
    }

    return layout;
  }

  function buildPassengerEditControl(field, passenger) {
    let control;
    if (field.kind === "textarea") {
      control = document.createElement("textarea");
      control.rows = 3;
      control.readOnly = true;
    } else if (field.kind === "choice" || field.kind === "lookup") {
      control = document.createElement("select");
      control.disabled = true;
      fillPassengerEditSelect(control, field);
    } else {
      control = document.createElement("input");
      control.type = field.kind === "date" ? "date" : (field.inputType || "text");
      if (field.inputType === "tel") control.inputMode = "tel";
      if (field.inputType === "email") control.autocomplete = "email";
      control.readOnly = true;
    }

    const rawValue = getPassengerEditValue(passenger, field);
    const value = field.key === "telefone" ? formatPhoneNumber(rawValue) : rawValue;
    control.className = "passenger-edit-control";
    control.dataset.passengerEditControl = field.key;
    control.dataset.savedValue = field.key === "telefone" ? phoneStorageValue(rawValue, "") : value;
    control.value = value;
    return control;
  }

  function fillPassengerEditSelect(select, field) {
    select.innerHTML = '<option value=""></option>';
    const rows = field.kind === "lookup"
      ? state[field.rowsKey] || []
      : state.options[field.optionsKey] || [];
    rows.forEach((item) => {
      const option = document.createElement("option");
      option.value = String(item.value ?? item.id ?? "");
      option.textContent = item.label || "";
      select.appendChild(option);
    });
  }

  function getPassengerEditValue(passenger, field) {
    const raw = passenger?.[field.stateKey] ?? "";
    if (field.kind === "date" && raw) return String(raw).slice(0, 10);
    return raw === null || raw === undefined ? "" : String(raw);
  }

  function togglePassengerEditMode() {
    setPassengerEditMode(!passengerEditEnabled);
  }

  function setPassengerEditMode(enabled) {
    passengerEditEnabled = !!enabled;
    if (el.passengerEditOverlay) {
      el.passengerEditOverlay.dataset.editing = passengerEditEnabled ? "true" : "false";
    }
    if (el.passengerEditToggle) {
      el.passengerEditToggle.classList.toggle("is-active", passengerEditEnabled);
      el.passengerEditToggle.setAttribute("aria-pressed", String(passengerEditEnabled));
      el.passengerEditToggle.setAttribute("aria-label", passengerEditEnabled ? "Bloquear edição" : "Habilitar edição");
    }
    el.passengerEditFields?.querySelectorAll("[data-passenger-edit-control]").forEach((control) => {
      if (control.tagName === "SELECT") {
        control.disabled = !passengerEditEnabled;
        refreshCustomSelect(control);
      } else {
        control.readOnly = !passengerEditEnabled;
      }
    });
  }

  function handlePassengerEditInput(event) {
    const control = event.target.closest("[data-passenger-edit-control]");
    if (!control || !el.passengerEditFields.contains(control)) return;
    if (control.disabled || control.readOnly) return;
    formatPassengerEditControl(control.dataset.passengerEditControl, control);
    const delay = event.type === "input" && control.tagName !== "SELECT" ? 550 : 0;
    schedulePassengerEditSave(control.dataset.passengerEditControl, control, delay);
  }

  function formatPassengerEditControl(fieldKey, control) {
    if (!control) return;
    if (fieldKey === "telefone") control.value = formatPhoneNumber(control.value);
    if (fieldKey === "email") control.value = normalizeEmail(control.value);
    if (fieldKey === "cr" || fieldKey === "centroCusto") control.value = normalizeCodeValue(control.value);
  }

  function schedulePassengerEditSave(fieldKey, control, delay) {
    const existing = passengerEditSaveTimers.get(fieldKey);
    if (existing) window.clearTimeout(existing.timer);
    const importedRef = activeImportedPassengerEditRef ? { ...activeImportedPassengerEditRef } : null;
    const passengerId = activePassengerEditId;
    setPassengerFieldStatus(control, "saving");
    setPassengerEditStatus("Salvando...", "saving");
    const timer = window.setTimeout(() => {
      passengerEditSaveTimers.delete(fieldKey);
      if (importedRef) {
        saveImportedPassengerEditField(fieldKey, control, importedRef);
      } else {
        savePassengerEditField(fieldKey, control, passengerId);
      }
    }, delay);
    passengerEditSaveTimers.set(fieldKey, { timer, fieldKey, control, importedRef, passengerId });
  }

  function flushPassengerEditSaves(passengerId) {
    const entries = [...passengerEditSaveTimers.values()];
    passengerEditSaveTimers.clear();
    entries.forEach((entry) => window.clearTimeout(entry.timer));
    entries.forEach((entry) => {
      if (entry.importedRef) {
        saveImportedPassengerEditField(entry.fieldKey, entry.control, entry.importedRef);
      } else {
        savePassengerEditField(entry.fieldKey, entry.control, passengerId || entry.passengerId);
      }
    });
  }

  async function savePassengerEditField(fieldKey, control, passengerId) {
    const field = getPassengerEditField(fieldKey);
    const cleanPassengerId = cleanGuid(passengerId || activePassengerEditId);
    const index = state.passageiros.findIndex((item) => sameId(item.id, cleanPassengerId));
    if (!field || index < 0) return;

    const value = readPassengerEditControlValue(control, field);
    if (field.required && !value) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus("Campo obrigatorio.", "error");
      return;
    }
    if (field.key === "telefone" && value && !parsePhoneNumber(value).isValid) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus(parsePhoneNumber(value).message || "Telefone invalido.", "error");
      return;
    }
    if (field.key === "email" && value && !control.checkValidity()) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus("Email invalido.", "error");
      return;
    }
    if (value === (control.dataset.savedValue || "")) {
      setPassengerFieldStatus(control, "");
      setPassengerEditStatus("", "");
      return;
    }

    try {
      const payload = buildPassengerEditPayload(field, value);
      if (state.xrm && !state.mockMode) {
        await state.xrm.WebApi.updateRecord(CONFIG.entities.passageiro, cleanPassengerId, payload);
      }

      const updatedPassenger = applyPassengerFieldToState(cleanPassengerId, field, value);
      if (updatedPassenger) persistMockPassengerRecord(updatedPassenger);
      control.dataset.savedValue = value;
      if (field.key === "telefone") control.value = formatPhoneNumber(value);
      setPassengerFieldStatus(control, "saved");
      setPassengerEditStatus("Atualizado.", "saved");
      if (updatedPassenger) renderPassengerEditHeader(updatedPassenger, true);
      refreshPassengerDependentViews(cleanPassengerId);
    } catch (error) {
      console.error(error);
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus(`Falha ao atualizar ${field.label}.`, "error");
      toast(`Falha ao salvar ${field.label}. ${error.message || ""}`, "error", 8000);
    }
  }

  function saveImportedPassengerEditField(fieldKey, control, ref) {
    if (ref?.target === "solicitante") {
      saveImportedSolicitanteEditField(fieldKey, control, ref);
      return;
    }
    const field = getImportedPassengerEditField(fieldKey);
    const trecho = findImportedTrecho(ref?.programacao, ref?.trechoKey);
    const passenger = trecho?.passageiros?.[Number(ref?.passengerIndex)] || null;
    if (!field || !trecho || !passenger) return;

    const value = readPassengerEditControlValue(control, field);
    if (field.required && !value) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus("Campo obrigatorio.", "error");
      return;
    }
    if (field.key === "telefone" && value && !parsePhoneNumber(value).isValid) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus(parsePhoneNumber(value).message || "Telefone invalido.", "error");
      return;
    }
    if (field.key === "email" && value && !control.checkValidity()) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus("Email invalido.", "error");
      return;
    }
    if (value === (control.dataset.savedValue || "")) {
      setPassengerFieldStatus(control, "");
      setPassengerEditStatus("", "");
      return;
    }

    const previousIdentity = importedPassengerIdentityKey(passenger);
    captureImportReviewHistory(`Editar passageiro importado: ${field.label}`);
    markImportedReviewPending(trecho);
    passenger[field.stateKey] = value;
    if (["nome", "telefone", "email", "centroCusto"].includes(field.key)) {
      passenger.passageiroId = "";
      passenger.passageiroLabel = "";
      passenger.matchCandidates = [];
      passenger.matchStatus = "create-new";
      passenger.matchMessage = "Dados revisados. Ao salvar, o sistema revalida duplicidade antes de criar.";
    }
    syncImportedSolicitanteFromPassenger(trecho, passenger, previousIdentity);
    control.dataset.savedValue = value;
    if (field.key === "telefone") control.value = formatPhoneNumber(value);
    setPassengerFieldStatus(control, "saved");
    setPassengerEditStatus("Atualizado.", "saved");
    renderPassengerEditHeader(importedPassengerPreviewRecord(passenger), true);
  }

  function saveImportedSolicitanteEditField(fieldKey, control, ref) {
    const field = getImportedSolicitanteEditField(fieldKey);
    const trecho = findImportedTrecho(ref?.programacao, ref?.trechoKey);
    if (!field || !trecho) return;

    const value = readPassengerEditControlValue(control, field);
    if (field.required && !value) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus("Campo obrigatorio.", "error");
      return;
    }
    if (field.key === "telefone" && value && !parsePhoneNumber(value).isValid) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus(parsePhoneNumber(value).message || "Telefone invalido.", "error");
      return;
    }
    if (field.key === "email" && value && !control.checkValidity()) {
      setPassengerFieldStatus(control, "error");
      setPassengerEditStatus("Email invalido.", "error");
      return;
    }
    if (value === (control.dataset.savedValue || "")) {
      setPassengerFieldStatus(control, "");
      setPassengerEditStatus("", "");
      return;
    }

    const previousIdentity = importedSolicitanteIdentityKey(trecho);
    captureImportReviewHistory(`Editar solicitante importado: ${field.label}`);
    markImportedReviewPending(trecho);
    const next = {
      ...importedSolicitanteEditableRecord(trecho),
      [field.stateKey]: value
    };
    syncImportedSolicitanteDraft(trecho, next);
    syncImportedPassengerFromSolicitante(trecho, next, previousIdentity);
    control.dataset.savedValue = value;
    if (field.key === "telefone") control.value = formatPhoneNumber(value);
    setPassengerFieldStatus(control, "saved");
    setPassengerEditStatus("Atualizado.", "saved");
    renderPassengerEditHeader(importedSolicitantePreviewRecord(trecho), true);
  }

  function readPassengerEditControlValue(control, field) {
    if (!control) return "";
    if (field.kind === "text" || field.kind === "textarea") {
      if (field.key === "telefone") return phoneStorageValue(control.value, "");
      if (field.key === "email") return normalizeEmail(control.value);
      if (field.key === "cr" || field.key === "centroCusto") return normalizeCodeValue(control.value);
      if (field.key === "label" || field.key === "nome") return normalizePassengerDisplayName(control.value);
      return control.value.trim();
    }
    return control.value || "";
  }

  function buildPassengerEditPayload(field, value) {
    const payload = {};
    if (field.kind === "lookup") {
      payload[`${field.navName}@odata.bind`] = value
        ? `/${field.entitySet}(${cleanGuid(value)})`
        : null;
      return payload;
    }
    if (field.kind === "choice") {
      payload[field.payloadField] = value === "" ? null : (Number.isFinite(Number(value)) ? Number(value) : value);
      return payload;
    }
    if (field.kind === "date") {
      payload[field.payloadField] = value || null;
      return payload;
    }
    payload[field.payloadField] = value;
    return payload;
  }

  function applyPassengerFieldToState(passengerId, field, value) {
    const index = state.passageiros.findIndex((item) => sameId(item.id, passengerId));
    if (index < 0) return null;

    const stateValue = field.key === "telefone" ? formatPhoneNumber(value) : value;
    const updatedPassenger = {
      ...state.passageiros[index],
      [field.stateKey]: stateValue
    };
    if (field.key === "clienteId") {
      updatedPassenger.clienteLabel = state.clientes.find((item) => sameId(item.id, value))?.label || "";
    }
    if (field.key === "tipoVeiculo") {
      updatedPassenger.tipoVeiculoLabel = optionLabel("bdTipoVeiculo", value);
    }

    state.passageiros[index] = updatedPassenger;
    state.passageiros.sort((a, b) => (a.label || "").localeCompare(b.label || "", "pt-BR"));
    state.selectedPassengers = state.selectedPassengers.map((item) => (
      sameId(item.guid, passengerId)
        ? {
            ...item,
            passageiro: updatedPassenger,
            telefone: updatedPassenger.telefone,
            enderecoEditado: getDraftAddress(item.ordem) || updatedPassenger.endereco || ""
          }
        : item
    ));
    return updatedPassenger;
  }

  function refreshPassengerDependentViews(passengerId) {
    const currentSolicitante = el.solicitante.value;
    renderLookupSelect(el.solicitante, state.passageiros);
    setSelectValue(el.solicitante, currentSolicitante);
    renderPassengers();
    renderRiskPanel();
    markDraftDirty();
  }

  function setPassengerEditStatus(text, status) {
    if (!el.passengerEditStatus) return;
    if (passengerEditStatusTimer) {
      window.clearTimeout(passengerEditStatusTimer);
      passengerEditStatusTimer = null;
    }
    el.passengerEditStatus.textContent = text || "";
    el.passengerEditStatus.dataset.status = status || "";
    if (status === "saved") {
      passengerEditStatusTimer = window.setTimeout(() => {
        passengerEditStatusTimer = null;
        if (el.passengerEditStatus?.dataset.status === "saved") {
          setPassengerEditStatus("", "");
        }
      }, 1400);
    }
  }

  function setPassengerFieldStatus(control, status) {
    const row = control?.closest?.(".passenger-edit-field");
    if (!row) return;
    row.classList.remove("is-saving", "is-saved", "is-error");
    addClassIfPresent(row, `is-${status || ""}`);
    if (status === "saved") {
      window.setTimeout(() => {
        if (row.isConnected) row.classList.remove("is-saved");
      }, 1200);
    }
  }

  function closePassengerEditPopup() {
    const shouldRefreshImportReview = !!activeImportedPassengerEditRef;
    if (activePassengerEditId || activeImportedPassengerEditRef) {
      flushPassengerEditSaves(activePassengerEditId);
    }
    closeAllCustomSelects();
    if (el.passengerEditOverlay) el.passengerEditOverlay.hidden = true;
    if (el.passengerEditFields) el.passengerEditFields.replaceChildren();
    activePassengerEditId = "";
    activeImportedPassengerEditRef = null;
    passengerEditEnabled = false;
    setPassengerEditStatus("", "");
    if (shouldRefreshImportReview) renderImportReviewPreservingGallery();
  }

  function renderScheduleDrafts() {
    if (!el.scheduleDraftRows) return;
    if (!state.isNew) {
      el.scheduleDraftRows.innerHTML = "";
      return;
    }

    const existingRows = new Map(
      [...el.scheduleDraftRows.children].map((row) => [row.dataset.scheduleKey, row])
    );
    const keepRows = [];
    const activeKeys = new Set();

    state.scheduleDrafts.forEach((item, index) => {
      if (!item.key) item.key = nextScheduleDraftKey();
      const row = existingRows.get(item.key) || buildScheduleDraftRow(item);
      hydrateScheduleDraftRow(row, item, index);
      keepRows.push(row);
      activeKeys.add(item.key);
    });

    [...el.scheduleDraftRows.children].forEach((row) => {
      if (!activeKeys.has(row.dataset.scheduleKey)) row.remove();
    });

    keepRows.forEach((row) => el.scheduleDraftRows.appendChild(row));
    el.scheduleDraftRows.classList.toggle("is-empty", state.scheduleDrafts.length === 0);
    syncDateTimeFieldRowWidths();
  }

  function buildScheduleDraftRow(item) {
    const row = document.createElement("div");
    row.className = "schedule-draft";
    row.dataset.scheduleKey = item.key;
    row.innerHTML = `
      <div class="schedule-draft-head">
        <strong data-schedule-title></strong>
        <div class="schedule-actions">
          <button type="button" class="text-action" data-schedule-action="copy">Copiar principal</button>
          <button type="button" class="remove-row" data-schedule-action="remove" title="Remover agendamento">X</button>
        </div>
      </div>
      <div class="schedule-draft-grid">
        <label class="field span-2 required datetime-field">
          <span>Data e horário</span>
          <div class="inline-time">
            <input type="datetime-local" data-schedule-field="dataHora" step="300">
            <input type="hidden" data-schedule-field="data">
            <input type="hidden" data-schedule-field="hora">
            <input type="hidden" data-schedule-field="minuto">
          </div>
        </label>
        <label class="field datetime-field">
          <span>Hr prev retorno</span>
          <div class="inline-time">
            <input type="datetime-local" data-schedule-field="retPrevDateTime" step="300">
            <input type="hidden" data-schedule-field="retPrevHora">
            <input type="hidden" data-schedule-field="retPrevMinuto">
          </div>
        </label>
        <label class="field required">
          <span>Tipo serviço</span>
          <select data-schedule-field="tipoServico"></select>
        </label>
        <label class="field required">
          <span>Tipo veículo</span>
          <select data-schedule-field="tipoVeiculo"></select>
        </label>
        <label class="field">
          <span>Motorista</span>
          <select data-schedule-field="motorista"></select>
        </label>
        <label class="field span-2 required">
          <span>Trajeto</span>
          <input type="text" data-schedule-field="trajeto" autocomplete="off">
        </label>
        <label class="field span-2 required">
          <span>Destino</span>
          <textarea rows="3" data-schedule-field="destino"></textarea>
        </label>
        <label class="field span-2">
          <span>Observação motorista</span>
          <textarea rows="3" data-schedule-field="obsMotorista"></textarea>
        </label>
      </div>
    `;
    return row;
  }

  function hydrateScheduleDraftRow(row, item, index) {
    row.dataset.scheduleKey = item.key;
    syncScheduleDateTimeFields(item);
    row.querySelector("[data-schedule-title]").textContent = `Agendamento ${index + 2}`;
    setScheduleInput(row, "dataHora", item.dataHora);
    setScheduleInput(row, "data", item.data);
    setScheduleInput(row, "hora", item.hora);
    setScheduleInput(row, "minuto", item.minuto);
    setScheduleInput(row, "retPrevDateTime", item.retPrevDateTime);
    setScheduleInput(row, "retPrevHora", item.retPrevHora);
    setScheduleInput(row, "retPrevMinuto", item.retPrevMinuto);
    fillScheduleOptions(row, "tipoServico", state.options.tipoServico, item.tipoServico);
    fillScheduleOptions(row, "tipoVeiculo", state.options.tipoVeiculo, item.tipoVeiculo);
    fillScheduleLookup(row, "motorista", state.motoristas, item.motorista);
    setScheduleInput(row, "trajeto", item.trajeto);
    setScheduleInput(row, "destino", item.destino);
    setScheduleInput(row, "obsMotorista", item.obsMotorista);
  }

  function fillScheduleOptions(row, field, options, value) {
    const select = row.querySelector(`[data-schedule-field="${field}"]`);
    if (!select) return;
    select.innerHTML = '<option value=""></option>';
    options.forEach((item) => {
      const option = document.createElement("option");
      option.value = String(item.value);
      option.textContent = item.label;
      select.appendChild(option);
    });
    select.value = value ? String(value) : "";
    ensureCustomSelect(select);
    refreshCustomSelect(select);
  }

  function fillScheduleLookup(row, field, rows, value) {
    const select = row.querySelector(`[data-schedule-field="${field}"]`);
    if (!select) return;
    select.innerHTML = '<option value=""></option>';
    rows.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      select.appendChild(option);
    });
    select.value = value || "";
    ensureCustomSelect(select);
    refreshCustomSelect(select);
  }

  function setScheduleInput(row, field, value) {
    const input = row.querySelector(`[data-schedule-field="${field}"]`);
    if (input) input.value = value || "";
  }

  function renderPassengers() {
    const passengerTotal = state.selectedPassengers.length;
    const hasUnfilledPassenger = state.selectedPassengers.some((item) => !item.passageiro || !item.guid);
    const hasCandidates = getAvailablePassengers().length > 0;
    const previousRects = new Map(
      [...el.passengerRows.children]
        .filter((row) => row.dataset.rowKey)
        .map((row) => [row.dataset.rowKey, row.getBoundingClientRect()])
    );
    if (el.passengerEmpty) {
      el.passengerEmpty.hidden = passengerTotal > 0;
    }
    if (el.passengerBlock) {
      el.passengerBlock.classList.toggle("is-shared-address", state.enderecoPersonalizadoAtivo);
    }
    el.customAddressWrap.hidden = !state.enderecoPersonalizadoAtivo;
    if (el.toggleEnderecoPersonalizado) {
      el.toggleEnderecoPersonalizado.textContent = state.enderecoPersonalizadoAtivo ? "Endereço por passageiro" : "Endereço único";
      el.toggleEnderecoPersonalizado.title = state.enderecoPersonalizadoAtivo ? "Usar endereço por passageiro" : "Usar endereço único para todos";
      el.toggleEnderecoPersonalizado.setAttribute(
        "aria-label",
        state.enderecoPersonalizadoAtivo ? "Usar endereço por passageiro" : "Usar endereço único para todos"
      );
      el.toggleEnderecoPersonalizado.setAttribute("aria-pressed", String(state.enderecoPersonalizadoAtivo));
    }
    if (el.addPassenger) {
      el.addPassenger.textContent = "+";
      el.addPassenger.setAttribute("aria-label", "Adicionar passageiro");
      el.addPassenger.disabled = !hasCandidates;
      el.addPassenger.title = hasUnfilledPassenger
        ? "Selecionar passageiro pendente."
        : (hasCandidates
          ? "Adicionar novo passageiro"
          : "Sem passageiros disponíveis para adicionar.");
    }
    sortPassengers();

    const existingRows = new Map(
      [...el.passengerRows.children].map((row) => [row.dataset.rowKey, row])
    );
    const keepRows = [];
    const activeKeys = new Set();

    state.selectedPassengers.forEach((item, index) => {
      if (!item.rowKey) item.rowKey = nextPassengerRowKey();
      const row = existingRows.get(item.rowKey) || buildPassengerRow(item);
      hydratePassengerRow(row, item, index);
      keepRows.push(row);
      activeKeys.add(item.rowKey);

      if (!row.isConnected) {
        row.classList.add("is-enter");
      }
    });

    [...el.passengerRows.children].forEach((row) => {
      if (!activeKeys.has(row.dataset.rowKey)) {
        closePassengerPreview(row.querySelector(".row-title-wrap"));
        row.remove();
      }
    });

    keepRows.forEach((row, index) => {
      row.style.setProperty("--row-index", String(index));
      el.passengerRows.appendChild(row);
    });
    animatePassengerRowReflow(previousRects, keepRows);

    if (state.enderecoPersonalizadoAtivo && !el.enderecoPersonalizado.value) {
      el.enderecoPersonalizado.value = composeEnderecoCompleto();
    }
    syncPassengerNameColumnWidth();
    syncReturnDefaults();
  }

  function syncPassengerNameColumnWidth() {
    if (!el.passengerRows) return;
    const labels = [...el.passengerRows.querySelectorAll(".row-label")];
    const targets = [el.passengerRows].filter(Boolean);
    targets.forEach((target) => target.style.removeProperty("--passenger-name-width"));

    if (!labels.length) return;

    const maxWidth = Math.max(
      ...labels.map((label) => {
        const title = label.querySelector(".row-title");
        const styles = window.getComputedStyle(label);
        const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
        return Math.ceil((title?.scrollWidth || label.scrollWidth) + horizontalPadding);
      })
    );
    if (!Number.isFinite(maxWidth) || maxWidth <= 0) return;

    targets.forEach((target) => target.style.setProperty("--passenger-name-width", `${maxWidth}px`));
  }

  function syncImportedPassengerNameColumnWidths() {
    if (!el.importReviewPrograms) return;
    const IMPORT_PASSENGER_BLOCK_MAX_WIDTH = 340;
    const lists = [...el.importReviewPrograms.querySelectorAll(".import-passengers")];
    lists.forEach((list) => {
      list.style.removeProperty("--import-passenger-name-width");
      list.style.removeProperty("--import-passenger-block-width");
      const trechoCard = list.closest(".import-trecho");
      trechoCard?.style.removeProperty("--import-passenger-block-width");
      const labels = [...list.querySelectorAll(".import-passenger-row .row-label")];
      if (!labels.length) return;

      const measuredRows = labels
        .map((label) => {
          const title = label.querySelector(".row-title");
          if (!title) return null;
          const titleStyles = window.getComputedStyle(title);
          return {
            label,
            textWidth: measureImportedPassengerTextWidth(title.textContent || "", titleStyles),
            titleStyles
          };
        })
        .filter(Boolean);
      if (!measuredRows.length) return;

      const widestRow = measuredRows.reduce((widest, current) => (
        current.textWidth > widest.textWidth ? current : widest
      ), measuredRows[0]);
      const row = widestRow.label.closest(".import-passenger-row");
      const titleWrap = widestRow.label.querySelector(".row-title-wrap");
      const rowStyles = row ? window.getComputedStyle(row) : null;
      const labelStyles = window.getComputedStyle(widestRow.label);
      const titleWrapStyles = titleWrap ? window.getComputedStyle(titleWrap) : null;
      const listStyles = window.getComputedStyle(list);
      const measuredContentWidth = Math.ceil(
        widestRow.textWidth
        + horizontalBoxWidth(rowStyles)
        + horizontalBoxWidth(labelStyles)
        + horizontalBoxWidth(titleWrapStyles)
        + horizontalBoxWidth(widestRow.titleStyles)
        + horizontalBoxWidth(listStyles)
      );
      if (!Number.isFinite(measuredContentWidth) || measuredContentWidth <= 0) return;

      const blockWidth = Math.min(measuredContentWidth, IMPORT_PASSENGER_BLOCK_MAX_WIDTH);
      list.style.setProperty("--import-passenger-block-width", `${blockWidth}px`);
      list.style.setProperty("--import-passenger-name-width", `${Math.max(0, blockWidth)}px`);
      trechoCard?.style.setProperty("--import-passenger-block-width", `${blockWidth}px`);
    });
  }

  function horizontalBoxWidth(styles) {
    if (!styles) return 0;
    return cssPixelValue(styles.paddingLeft)
      + cssPixelValue(styles.paddingRight)
      + cssPixelValue(styles.borderLeftWidth)
      + cssPixelValue(styles.borderRightWidth);
  }

  function cssPixelValue(value) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function measureImportedPassengerTextWidth(text, styles) {
    const probe = document.createElement("span");
    probe.textContent = text || "";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.whiteSpace = "nowrap";
    probe.style.pointerEvents = "none";
    probe.style.fontFamily = styles?.fontFamily || "inherit";
    probe.style.fontSize = styles?.fontSize || "13px";
    probe.style.fontWeight = styles?.fontWeight || "670";
    probe.style.letterSpacing = styles?.letterSpacing || "normal";
    document.body.appendChild(probe);
    const width = Math.ceil(probe.getBoundingClientRect().width);
    probe.remove();
    return width;
  }

  function buildPassengerRow(item) {
    const row = document.createElement("div");
    row.className = "passenger-row";
    row.dataset.rowKey = item.rowKey;
    row.dataset.ordem = String(item.ordem);

    const label = document.createElement("div");
    label.className = "row-label";
    const rowIndex = document.createElement("span");
    rowIndex.className = "row-index";
    rowIndex.textContent = String(item.ordem).padStart(2, "0");
    rowIndex.setAttribute("aria-hidden", "true");

    const titleWrap = document.createElement("span");
    titleWrap.className = "row-title-wrap";
    const rowTitle = document.createElement("button");
    rowTitle.type = "button";
    rowTitle.className = "row-title passenger-name-button";
    rowTitle.dataset.passengerAction = "open-record";
    rowTitle.textContent = "Passageiro sem seleção";

    const rowPreview = document.createElement("div");
    rowPreview.className = "passenger-preview";
    rowPreview.setAttribute("role", "status");
    rowPreview.setAttribute("aria-live", "polite");
    rowPreview.setAttribute("aria-hidden", "true");

    titleWrap.append(rowTitle, rowPreview);
    label.append(rowIndex, titleWrap);

    const addressField = document.createElement("label");
    addressField.className = "field address-cell";
    addressField.innerHTML = "<span>Endereço de saída</span>";
    const addressInput = document.createElement("textarea");
    addressInput.placeholder = "Endereço de saída";
    addressInput.rows = 2;
    addressInput.wrap = "soft";
    addressInput.className = "passenger-address";
    addressInput.dataset.passengerField = "address";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-row";
    remove.textContent = "X";
    remove.title = "Remover passageiro";
    remove.setAttribute("aria-label", "Remover passageiro");

    addressField.appendChild(addressInput);
    row.append(label, addressField, remove);
    return row;
  }

  function hydratePassengerRow(row, item, index = 0) {
    const label = row.querySelector(".row-label");
    const addressInput = row.querySelector(".passenger-address");
    const addressLabel = addressInput.closest("label");
    const remove = row.querySelector(".remove-row");
    const rowIndex = label.querySelector(".row-index");
    const rowTitle = label.querySelector(".row-title");
    const rowPreview = row.querySelector(".passenger-preview");
    const addressField = addressInput.closest(".field");
    const hasPassenger = !!item.passageiro && !!item.guid;

    row.dataset.rowKey = item.rowKey;
    row.dataset.ordem = String(item.ordem);
    row.style.setProperty("--row-index", String(index));
    const selectedName = item.passageiro?.label || "";
    if (rowIndex) {
      rowIndex.textContent = String(item.ordem).padStart(2, "0");
    }
    if (rowTitle) {
      const visibleName = selectedName ? firstName(selectedName) : "";
      rowTitle.textContent = visibleName || selectedName || "Selecionar passageiro";
      rowTitle.title = selectedName || (hasPassenger ? "Registro do passageiro" : "Selecione o passageiro pelo botão Adicionar");
      rowTitle.setAttribute(
        "aria-label",
        selectedName
          ? `Abrir registro: ${selectedName}`
          : "Selecione o passageiro pelo botão Adicionar"
      );
      rowTitle.disabled = false;
      rowTitle.setAttribute("aria-disabled", String(!hasPassenger));
      rowTitle.dataset.passengerId = item.guid || "";
      rowTitle.title = hasPassenger
        ? "Abrir registro do passageiro"
        : "Selecione o passageiro pelo botão Adicionar";
    }
    renderPassengerPreview(rowPreview, item.passageiro || null);
    const addressLabelText = addressLabel.querySelector("span");
    if (addressLabelText) {
      addressLabelText.textContent = "Endereço de saída";
    }
    addressInput.value = getDraftAddress(item.ordem) || item.enderecoEditado || "";
    addressInput.disabled = state.enderecoPersonalizadoAtivo;
    if (addressField) {
      addressField.hidden = state.enderecoPersonalizadoAtivo;
    }
    remove.hidden = false;
    row.classList.remove("is-leave");
    row.classList.remove("is-enter");
    row.classList.toggle("is-shared-address", state.enderecoPersonalizadoAtivo);
    row.classList.toggle("is-incomplete", !item.passageiro);
  }

  function animatePassengerRowExit(row) {
    if (!row?.isConnected) return;
    const rect = row.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ghost = row.cloneNode(true);
    const sourceFields = row.querySelectorAll("input, textarea, select");
    const ghostFields = ghost.querySelectorAll("input, textarea, select");
    sourceFields.forEach((field, index) => {
      const ghostField = ghostFields[index];
      if (!ghostField) return;
      if ("value" in ghostField) ghostField.value = field.value;
      if ("checked" in ghostField) ghostField.checked = field.checked;
    });
    ghost.classList.remove("is-enter", "is-leave");
    ghost.style.position = "fixed";
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.margin = "0";
    ghost.style.boxSizing = "border-box";
    ghost.style.pointerEvents = "none";
    ghost.style.zIndex = "2147483646";
    document.body.appendChild(ghost);

    const animation = ghost.animate(
      [
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0)" },
        { opacity: 0, transform: "translate3d(18px, -4px, 0) scale(0.985)", filter: "blur(1px)" }
      ],
      { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    );
    animation.addEventListener("finish", () => ghost.remove(), { once: true });
    window.setTimeout(() => ghost.remove(), 320);
  }

  function animatePassengerRowReflow(previousRects, rows) {
    rows.forEach((row, index) => {
      if (!row?.isConnected || row.classList.contains("is-enter")) return;
      const previousRect = previousRects.get(row.dataset.rowKey);
      if (!previousRect) return;
      const nextRect = row.getBoundingClientRect();
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

      row.animate(
        [
          { transform: `translate3d(${deltaX}px, ${deltaY}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 260,
          delay: Math.min(index, 3) * 18,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)"
        }
      );
    });
  }

  function handlePassengerRowAction(event) {
    const openRecord = event.target.closest("[data-passenger-action='open-record']");
    if (openRecord) {
      const row = openRecord.closest(".passenger-row");
      if (!row) return;
      suppressPassengerRowHover(row);
      const ordem = Number(row.dataset.ordem);
      if (Number.isNaN(ordem)) return;
      const item = state.selectedPassengers.find((selected) => selected.ordem === ordem);
      if (!item || !item.passageiro) {
        openPassengerPicker(ordem);
        return;
      }
      openPassengerEdit(item.passageiro);
      return;
    }

    const remove = event.target.closest(".remove-row");
    if (!remove) return;
    const row = remove.closest(".passenger-row");
    if (!row) return;
    const ordem = Number(row.dataset.ordem);
    if (Number.isNaN(ordem)) return;
    removePassengerRow(ordem, row);
  }

  function handlePassengerRowPointerDown(event) {
    const openRecord = event.target.closest("[data-passenger-action='open-record']");
    if (!openRecord) return;
    const row = openRecord.closest(".passenger-row");
    if (!row) return;
    suppressPassengerRowHover(row);
  }

  function handlePassengerRowInput(event) {
    const input = event.target.closest("[data-passenger-field='address']");
    if (!input) return;
    const row = input.closest(".passenger-row");
    if (!row) return;
    const ordem = Number(row.dataset.ordem);
    if (Number.isNaN(ordem)) return;
    setDraftAddress(ordem, input.value);
  }

  function handlePassengerPreviewEnter(event) {
    if (isMobilePassengerPreviewDisabled()) return;
    const wrap = event.target.closest(".row-title-wrap");
    if (!isPassengerPreviewHost(wrap)) return;
    if (event.relatedTarget && wrap.contains(event.relatedTarget)) return;
    clearPassengerPreviewCloseTimer();
    openPassengerPreview(wrap);
  }

  function handlePassengerPreviewLeave(event) {
    const wrap = event.target.closest(".row-title-wrap");
    if (!isPassengerPreviewHost(wrap)) return;
    if (event.relatedTarget && wrap.contains(event.relatedTarget)) return;
    if (activePassengerPreview?.portal.contains(event.relatedTarget)) return;
    schedulePassengerPreviewClose(wrap);
  }

  function handlePassengerPreviewFocusIn(event) {
    if (isMobilePassengerPreviewDisabled()) return;
    const wrap = event.target.closest(".row-title-wrap");
    if (!isPassengerPreviewHost(wrap)) return;
    openPassengerPreview(wrap);
  }

  function handlePassengerPreviewFocusOut(event) {
    const wrap = event.target.closest(".row-title-wrap");
    if (!isPassengerPreviewHost(wrap)) return;
    window.setTimeout(() => {
      if (!wrap.contains(document.activeElement)) {
        closePassengerPreview(wrap);
      }
    }, 0);
  }

  function isPassengerPreviewHost(wrap) {
    if (!wrap) return false;
    const host = wrap.closest(".passenger-rows, .import-passengers");
    if (!host) return false;
    return host === el.passengerRows || !!el.importReviewPrograms?.contains(host);
  }

  function ensurePassengerPreviewPortal() {
    let portal = document.getElementById("passengerPreviewPortal");
    if (portal) return portal;
    portal = document.createElement("div");
    portal.id = "passengerPreviewPortal";
    portal.className = "passenger-preview passenger-preview-floating";
    portal.setAttribute("role", "status");
    portal.setAttribute("aria-live", "polite");
    portal.setAttribute("aria-hidden", "true");
    portal?.addEventListener("pointerenter", clearPassengerPreviewCloseTimer);
    portal?.addEventListener("pointerleave", () => schedulePassengerPreviewClose());
    portal?.addEventListener("click", async (event) => {
      const valueEl = event.target.closest(".passenger-preview-value");
      if (!valueEl) return;
      const value = valueEl.dataset.copyValue || valueEl.textContent || "";
      try {
        await copyTextToClipboard(value);
        showCopyNotice(valueEl, "Copiado!");
      } catch (error) {
        showCopyNotice(valueEl, "Falha ao copiar.", true);
      }
    });
    document.body.appendChild(portal);
    return portal;
  }

  function openPassengerPreview(wrap) {
    if (isMobilePassengerPreviewDisabled()) return;
    const source = wrap.querySelector(".passenger-preview");
    const anchor = wrap.querySelector(".row-title") || wrap;
    if (anchor.disabled) return;
    if (!source || !source.childNodes.length) return;
    const portal = ensurePassengerPreviewPortal();
    closeAllCustomSelects();
    document.body.appendChild(portal);
    portal.replaceChildren(...Array.from(source.childNodes).map((node) => node.cloneNode(true)));
    portal.classList.toggle("is-comparison", !!portal.querySelector(".passenger-compare-grid"));
    portal.classList.add("is-open");
    portal.setAttribute("aria-hidden", "false");
    activePassengerPreview = { wrap, anchor, portal };
    updatePassengerPreviewPosition();
  }

  function closePassengerPreview(wrap = null) {
    if (!activePassengerPreview) return;
    if (wrap && activePassengerPreview.wrap !== wrap) return;
    clearPassengerPreviewCloseTimer();
    clearCopyNotice();
    activePassengerPreview.portal.classList.remove("is-open");
    activePassengerPreview.portal.setAttribute("aria-hidden", "true");
    activePassengerPreview = null;
  }

  function schedulePassengerPreviewClose(wrap = null) {
    clearPassengerPreviewCloseTimer();
    passengerPreviewCloseTimer = window.setTimeout(() => {
      closePassengerPreview(wrap);
    }, 120);
  }

  function clearPassengerPreviewCloseTimer() {
    if (!passengerPreviewCloseTimer) return;
    window.clearTimeout(passengerPreviewCloseTimer);
    passengerPreviewCloseTimer = null;
  }

  function suppressPassengerRowHover(row) {
    if (!row) return;
    closePassengerPreview(row.querySelector(".row-title-wrap"));
    row.classList.add("is-opening-record");
    const currentTimer = passengerRowHoverSuppressTimers.get(row);
    if (currentTimer) {
      window.clearTimeout(currentTimer);
    }
    const release = () => {
      const activeTimer = passengerRowHoverSuppressTimers.get(row);
      if (activeTimer) {
        window.clearTimeout(activeTimer);
      }
      passengerRowHoverSuppressTimers.delete(row);
      row.classList.remove("is-opening-record");
      row.removeEventListener("pointerleave", release);
      row.removeEventListener("pointercancel", release);
    };
    row.addEventListener("pointerleave", release, { once: true });
    row.addEventListener("pointercancel", release, { once: true });
    const timer = window.setTimeout(release, 600);
    passengerRowHoverSuppressTimers.set(row, timer);
  }

  function repositionPassengerPreview() {
    if (isMobilePassengerPreviewDisabled()) {
      closePassengerPreview();
      return;
    }
    if (!activePassengerPreview || passengerPreviewPositionRaf) return;
    passengerPreviewPositionRaf = requestAnimationFrame(() => {
      passengerPreviewPositionRaf = null;
      updatePassengerPreviewPosition();
    });
  }

  function updatePassengerPreviewPosition() {
    if (!activePassengerPreview) return;
    const { anchor, portal } = activePassengerPreview;
    if (!anchor.isConnected) {
      closePassengerPreview();
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const viewport = currentViewportMetrics();
    const viewportWidth = viewport.width;
    const viewportHeight = viewport.height;
    const viewportTop = viewport.offsetTop;
    const viewportLeft = viewport.offsetLeft;
    const viewportBottom = viewportTop + viewportHeight;
    const viewportRight = viewportLeft + viewportWidth;
    const gap = 8;
    const safeGap = 10;
    const preferredWidth = portal.classList.contains("is-comparison") ? 560 : 360;
    const width = Math.min(preferredWidth, Math.max(280, viewportWidth - safeGap * 2));
    const height = Math.min(portal.scrollHeight || 120, viewportHeight - safeGap * 2);
    const spaceBelow = viewportBottom - rect.bottom;
    const spaceAbove = rect.top - viewportTop;
    const showAbove = spaceBelow < gap + height && spaceAbove > spaceBelow;
    const top = showAbove
      ? Math.max(viewportTop + safeGap, rect.top - height - gap)
      : Math.min(viewportBottom - height - safeGap, rect.bottom + gap);
    const left = Math.max(viewportLeft + safeGap, Math.min(rect.left, viewportRight - width - safeGap));

    portal.style.width = `${width}px`;
    portal.style.left = `${left}px`;
    portal.style.top = `${Math.max(viewportTop + safeGap, top)}px`;
  }

  function renderPassengerPreview(container, passenger) {
    if (!container) return;
    container.replaceChildren();
    if (!passenger) {
      const empty = document.createElement("p");
      empty.className = "passenger-preview-empty";
      empty.textContent = "Sem informações disponíveis.";
      container.appendChild(empty);
      return;
    }
    const previewValue = (value, optionsKey) => {
      const raw = (value || "").toString().trim();
      if (!raw) return "";
      return optionsKey ? optionLabel(optionsKey, raw) || raw : raw;
    };
    const rows = [
      ["Nome", passenger.label],
      ["Telefone", passenger.telefone],
      ["Email", passenger.email],
      ["Cliente", passenger.clienteLabel],
      ["Cargo", previewValue(passenger.cargo, "bdCargo")],
      ["Dpto", passenger.departamento],
      ["CR", passenger.cr],
      ["Origem", passenger.origem],
      ["Destino", passenger.destino],
      ["Status", passenger.importStatus],
      ["Preferências", passenger.preferencias],
      ["Tipo de veículo", passenger.tipoVeiculoLabel || previewValue(passenger.tipoVeiculo, "bdTipoVeiculo")],
      ["Endereço", passenger.endereco],
      ["Idioma", previewValue(passenger.idioma, "bdIdioma")],
      ["Sexo", previewValue(passenger.sexo, "bdSexo")],
      ["Classificação", previewValue(passenger.classificacao, "bdClassificacao")]
    ].filter((item) => (item[1] || "").toString().trim());
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "passenger-preview-empty";
      empty.textContent = "Sem informações adicionais.";
      container.appendChild(empty);
      return;
    }
    const list = document.createElement("div");
    list.className = "passenger-preview-list";
    rows.forEach(([label, value]) => {
      const line = document.createElement("div");
      line.className = "passenger-preview-line";
      const key = document.createElement("span");
      key.className = "passenger-preview-key";
      key.textContent = label;
      const valueEl = document.createElement("button");
      valueEl.type = "button";
      valueEl.className = "passenger-preview-value";
      valueEl.textContent = value;
      valueEl.dataset.copyValue = value;
      valueEl.title = `Copiar ${label}`;
      valueEl.setAttribute("aria-label", `Copiar ${label}`);
      valueEl.addEventListener("click", async (event) => {
        try {
          await copyTextToClipboard(value);
          showCopyNotice(event.currentTarget, "Copiado!");
        } catch (error) {
          showCopyNotice(event.currentTarget, "Falha ao copiar.", true);
        }
      });
      line.append(key, valueEl);
      list.appendChild(line);
    });
    container.appendChild(list);
  }

  function renderImportedPassengerComparisonPreview(container, passenger, existing) {
    if (!container) return;
    container.replaceChildren();
    const importClient = getImportClient();
    const imported = {
      label: normalizePassengerDisplayName(passenger.nome || passenger.passageiroLabel) || "",
      telefone: formatPhoneNumber(passenger.telefone || ""),
      email: passenger.email || "",
      clienteLabel: importClient?.label || CONFIG.importDefaults.clienteLabel || "",
      cr: passenger.centroCusto || "",
      status: importedPassengerStatusLabel(passenger)
    };
    const registered = {
      label: normalizePassengerDisplayName(existing?.label) || "",
      telefone: formatPhoneNumber(existing?.telefone || ""),
      email: existing?.email || "",
      clienteLabel: existing?.clienteLabel || "",
      cr: existing?.cr || "",
      status: "Registro do Banco de Dados"
    };
    const normalizeCompareValue = (value) => normalize((value || "").toString());
    const rows = [
      ["Nome", imported.label, registered.label],
      ["Telefone", imported.telefone, registered.telefone],
      ["Email", imported.email, registered.email],
      ["Cliente", imported.clienteLabel, registered.clienteLabel],
      ["CR", imported.cr, registered.cr],
      ["Decisão", imported.status, registered.status]
    ].filter((row) => row.slice(1).some((value) => (value || "").toString().trim()));

    const header = document.createElement("div");
    header.className = "passenger-compare-head";
    const title = document.createElement("strong");
    title.textContent = "Comparar passageiro";
    const hint = document.createElement("span");
    hint.textContent = passenger.matchStatus === "ambiguous" ? "Candidato mais próximo" : "Cadastro selecionado";
    header.append(title, hint);

    const grid = document.createElement("div");
    grid.className = "passenger-compare-grid";
    const headField = document.createElement("span");
    headField.className = "passenger-compare-column-head";
    headField.textContent = "Campo";
    const headImport = document.createElement("span");
    headImport.className = "passenger-compare-column-head";
    headImport.textContent = "XLSX";
    const headExisting = document.createElement("span");
    headExisting.className = "passenger-compare-column-head";
    headExisting.textContent = "Cadastro";
    grid.append(headField, headImport, headExisting);

    rows.forEach(([label, importedValue, registeredValue]) => {
      const sameValue = normalizeCompareValue(importedValue) === normalizeCompareValue(registeredValue);
      const field = document.createElement("span");
      field.className = "passenger-compare-field";
      field.textContent = label;
      const importedCell = buildPassengerCompareValue(importedValue || "Vazio", sameValue);
      const registeredCell = buildPassengerCompareValue(registeredValue || "Vazio", sameValue);
      grid.append(field, importedCell, registeredCell);
    });

    container.append(header, grid);
  }

  function buildPassengerCompareValue(value, sameValue) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `passenger-preview-value passenger-compare-value ${sameValue ? "is-same" : "is-different"}`;
    button.textContent = value;
    button.dataset.copyValue = value;
    button.title = "Copiar valor";
    button.setAttribute("aria-label", "Copiar valor");
    button.addEventListener("click", async (event) => {
      try {
        await copyTextToClipboard(value);
        showCopyNotice(event.currentTarget, "Copiado!");
      } catch (error) {
        showCopyNotice(event.currentTarget, "Falha ao copiar.", true);
      }
    });
    return button;
  }

  function renderTabBadges() {
    el.tabImport?.classList.toggle("is-marked", !!state.importReview);
    renderActivationTabBadge(el.tabReturn, {
      label: "Retorno",
      active: !!el.agendarRetorno.checked,
      pending: hasInactiveReturnDraft()
    });
    renderActivationTabBadge(el.tabRepeat, {
      label: "Repetir",
      active: !!el.repetirServico.checked,
      pending: hasInactiveRepeatDraft()
    });
  }

  function renderActivationTabBadge(tab, options) {
    if (!tab) return;
    const active = !!options.active;
    const pending = !active && !!options.pending;
    tab.classList.toggle("is-marked", active);
    tab.classList.toggle("is-pending", pending);
    const suffix = active ? " ativo" : (pending ? " com dados não ativados" : "");
    tab.setAttribute("aria-label", `${options.label}${suffix}`);
    tab.title = pending ? `${options.label}: dados preenchidos sem ativar` : options.label;
  }

  function handleOperationalInput(event) {
    if (state.draftRestoring) return;
    const target = event.target;
    if (isImportReviewInteractionTarget(target)) return;
    if (target?.classList?.contains("custom-select-search")) return;
    if (target === el.passengerPickerSearch) return;
    if (target?.closest?.("#passengerEditOverlay")) return;

    clearFieldValidation(target);
    captureObsState();
    markActivationDraftEdited(target);
    renderTabBadges();
    renderRiskPanel();
    markDraftDirty({ touchCommon: !isActivationGuardField(target) });
    if (event.type !== "input" || !isTextEditingTarget(target)) {
      commitGlobalHistoryChange(globalHistoryLabelFromTarget(target));
    }
  }

  function isImportReviewInteractionTarget(target) {
    if (!target?.closest) return false;
    return !!target.closest("#importReviewPrograms, #importReviewStats");
  }

  function markActivationDraftEdited(target) {
    if (!target || target === el.agendarRetorno || target === el.repetirServico) return;
    if (isReturnActivationField(target)) state.activationDraftEditState.return = true;
    if (isRepeatActivationField(target)) state.activationDraftEditState.repeat = true;
  }

  function isActivationGuardField(target) {
    return (
      target === el.agendarRetorno ||
      target === el.repetirServico ||
      isReturnActivationField(target) ||
      isRepeatActivationField(target)
    );
  }

  function isReturnActivationField(target) {
    return (
      target === el.retornoData ||
      target === el.retornoHora ||
      target === el.retornoMinuto ||
      target === el.retornoEndereco ||
      target === el.retornoDestino ||
      target === el.retornoObservacao ||
      target?.closest?.("#tab-panel-return")
    );
  }

  function isRepeatActivationField(target) {
    return (
      target === el.frequenteInicio ||
      target === el.frequenteFim ||
      target === el.frequenteTipo ||
      target === el.contabilizarFds ||
      target?.closest?.("#tab-panel-repeat")
    );
  }

  function hasInactiveReturnDraft() {
    return state.isNew && !el.agendarRetorno.checked && state.activationDraftEditState.return && hasReturnDraftContent();
  }

  function hasInactiveRepeatDraft() {
    return state.isNew && !el.repetirServico.checked && state.activationDraftEditState.repeat && hasRepeatDraftContent();
  }

  function hasReturnDraftContent() {
    return [
      el.retornoData?.value,
      el.retornoEndereco?.value,
      el.retornoDestino?.value,
      el.retornoObservacao?.value,
      ...Object.values(state.obsRet || {})
    ].some((value) => String(value || "").trim());
  }

  function hasRepeatDraftContent() {
    return [
      el.frequenteInicio?.value,
      el.frequenteFim?.value,
      el.frequenteTipo?.value
    ].some((value) => String(value || "").trim()) || el.contabilizarFds.checked === false;
  }

  function renderRiskPanel() {
  }

  function collectOperationalRisks(context = buildSaveContext()) {
    const risks = [];
    const statusLabel = optionLabel("statusOperacao", el.statusOperacao.value);
    const isTroca = statusLabel === "Troca de Veículos";

    if (!el.cliente.value) risks.push("Cliente vazio.");
    if (!el.solicitante.value) risks.push("Solicitante vazio.");
    if (!el.motorista.value) risks.push("Motorista vazio. A operação precisará programar manualmente.");
    if (!context.dataHoraPrincipal) risks.push("Data e horário de saída incompletos.");
    if (!context.trajeto && !isTroca) risks.push("Trajeto vazio.");
    if (!el.destino.value.trim() && !isTroca) risks.push("Destino vazio.");
    if (!context.colOrdemPassageiros.length && !isTroca) risks.push("Nenhum passageiro selecionado.");
    if (hasDuplicatePassengers()) risks.push("Passageiro duplicado na lista.");
    if (state.enderecoPersonalizadoAtivo && !el.enderecoPersonalizado.value.trim() && !isTroca) risks.push("Endereço único ativo, mas vazio.");
    if (!state.enderecoPersonalizadoAtivo && context.colOrdemPassageiros.some((item) => !item.enderecoSaidaBD) && !isTroca) risks.push("Há passageiro sem endereço de saída.");
    if (el.agendarRetorno.checked && !context.dataHoraRetorno) risks.push("Retorno ativo sem data/hora completa.");
    if (el.agendarRetorno.checked && context.dataHoraRetorno && context.dataHoraPrincipal && context.dataHoraRetorno < context.dataHoraPrincipal) risks.push("Data de retorno anterior à saída.");
    if (el.repetirServico.checked && (!el.frequenteInicio.value || !el.frequenteFim.value)) risks.push("Serviço frequente ativo sem período completo.");
    if (el.repetirServico.checked && el.frequenteInicio.value && el.frequenteFim.value && new Date(el.frequenteFim.value) < new Date(el.frequenteInicio.value)) risks.push("Período frequente com data final anterior à inicial.");
    if (el.repetirServico.checked) {
      const frequentPeriodError = validateFrequentServicePeriod();
      if (frequentPeriodError) risks.push(frequentPeriodError);
    }

    return risks;
  }

  function renderSaveLog() {
  }

  function clearSaveLog() {
    state.saveLog = [];
    renderSaveLog();
  }

  function addSaveLog(type, title, detail) {
    state.saveLog.push({
      type,
      title,
      detail,
      at: new Date().toISOString()
    });
    renderSaveLog();
  }

  function openReviewBeforeSave(context) {
    performSave();
  }

  function closeReviewOverlay(clearContext) {
    if (clearContext) state.pendingSaveContext = null;
  }

  function renderReviewSummary(context) {
    if (!el.reviewSummaryList) return;
    const rows = [
      ["Status", optionLabel("statusOperacao", el.statusOperacao.value) || "Não informado"],
      ["Saída", context.dataHoraPrincipal ? formatDateTime(context.dataHoraPrincipal) : "Não informado"],
      ["Cliente", selectedText(el.cliente) || "Não informado"],
      ["Solicitante", selectedText(el.solicitante) || "Não informado"],
      ["Motorista", selectedText(el.motorista) || "Não informado"],
      ["Trajeto", context.trajeto || "Não informado"],
      ["Destino", el.destino.value.trim() || "Não informado"],
      ["Passageiros", String(context.colOrdemPassageiros.length)],
      ["Retorno", el.agendarRetorno.checked ? "Sim" : "Não"],
      ["Frequente", el.repetirServico.checked ? "Sim" : "Não"]
    ];

    el.reviewSummaryList.innerHTML = "";
    rows.forEach(([label, value]) => {
      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = value;
      el.reviewSummaryList.append(term, description);
    });
  }

  function renderReviewRisks(context) {
    if (!el.reviewRiskList) return;
    const risks = collectOperationalRisks(context);
    el.reviewRiskList.innerHTML = "";

    if (!risks.length) {
      const item = document.createElement("li");
      item.textContent = "Sem risco operacional crítico detectado.";
      el.reviewRiskList.appendChild(item);
      return;
    }

    risks.forEach((risk) => {
      const item = document.createElement("li");
      item.textContent = risk;
      el.reviewRiskList.appendChild(item);
    });
  }

  function markDraftDirty(options = {}) {
    if (state.draftRestoring) return;
    const config = {
      touchCommon: true,
      ...options
    };
    if (config.touchCommon) state.draftCommonEdited = true;
    if (state.draftTimer) window.clearTimeout(state.draftTimer);
    renderDraftStatus("Salvando dados locais...");
    state.draftTimer = window.setTimeout(() => {
      state.draftTimer = null;
      saveDraftSnapshot();
    }, 400);
    if (state.currentTab === "import") renderImportReview();
  }

  function saveDraftSnapshot() {
    if (state.draftRestoring) return;
    try {
      captureObsState();
      const snapshot = createDraftSnapshot();
      window.localStorage.setItem(DRAFT_STORE_KEY, JSON.stringify(snapshot));
      state.lastDraftSavedAt = snapshot.updatedAt;
      renderDraftStatus();
    } catch (error) {
      console.warn("Falha ao salvar dados locais", error);
      renderDraftStatus("Dados locais não salvos.");
    }
  }

  function cloneGlobalHistoryValue(value) {
    return JSON.parse(JSON.stringify(value ?? null));
  }

  function createGlobalHistorySnapshot() {
    captureObsState();
    const draft = createDraftSnapshot();
    draft.updatedAt = "";
    const importReview = cloneGlobalHistoryValue(state.importReview);
    if (importReview?.history) importReview.history = { undo: [], redo: [] };
    return {
      draft,
      importReview,
      importReviewFilter: normalizeImportReviewFilter(state.importReviewFilter),
      currentTab: state.currentTab
    };
  }

  function areGlobalHistorySnapshotsEqual(a, b) {
    return JSON.stringify(a || null) === JSON.stringify(b || null);
  }

  function globalHistoryCanTrack() {
    return !state.draftRestoring && !isRestoringGlobalHistory && !state.loading;
  }

  function shouldTrackGlobalHistoryTarget(target) {
    if (!target) return false;
    if (target.closest?.("#loadingOverlay, #successOverlay, #passengerPickerOverlay, #activationGuardOverlay, #clearAllFormsOverlay")) return false;
    if (isImportReviewInteractionTarget(target)) return false;
    if (target.closest?.(".custom-select-search")) return false;
    if (target === el.passengerPickerSearch) return false;
    if (target.closest?.("#passengerEditOverlay") && !activeImportedPassengerEditRef) return false;
    return !!target.closest?.(
      "input, textarea, select, button, [data-passenger-action], [data-import-action], [data-import-filter], [data-schedule-action], [data-obs], [data-ret-obs], .custom-select-option"
    );
  }

  function captureGlobalHistoryBeforeMutation(label = "Alteração") {
    if (!globalHistoryCanTrack()) return;
    state.globalHistory.pending = {
      label,
      snapshot: createGlobalHistorySnapshot()
    };
  }

  function handleGlobalHistoryBeforeChange(event) {
    if (!globalHistoryCanTrack()) return;
    const target = event.target;
    if (!shouldTrackGlobalHistoryTarget(target)) return;
    if (event.type === "keydown") {
      if (!isGlobalHistoryMutationKey(event) || !isTextEditingTarget(target)) return;
      if (state.globalHistory.pending?.textTarget === target) return;
    }
    if (event.type === "focusin" && !isTextEditingTarget(target)) return;
    captureGlobalHistoryBeforeMutation(globalHistoryLabelFromTarget(target));
    if (isTextEditingTarget(target)) state.globalHistory.pending.textTarget = target;
  }

  function isGlobalHistoryMutationKey(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return false;
    const key = String(event.key || "");
    if (key.length === 1) return true;
    return ["Backspace", "Delete", "Enter", " ", "Spacebar"].includes(key);
  }

  function globalHistoryLabelFromTarget(target) {
    if (target?.closest?.("[data-import-action], [data-import-field], [data-import-passenger-field]")) return "Alterar importação";
    if (target?.closest?.("[data-passenger-action], [data-passenger-field]")) return "Alterar passageiro";
    if (target?.closest?.("[data-schedule-action], [data-schedule-field]")) return "Alterar agendamento";
    if (target?.closest?.("[data-obs]")) return "Trocar observação";
    if (target?.closest?.("[data-ret-obs]")) return "Trocar observação do retorno";
    if (target?.id === "globalImportHistoryActions" || target?.closest?.("#globalImportHistoryActions")) return "";
    const label = target?.closest?.("label")?.querySelector?.("span, legend")?.textContent?.trim();
    return label ? `Editar ${label}` : "Alteração";
  }

  function commitGlobalHistoryChange(label = "") {
    if (state.draftRestoring || isRestoringGlobalHistory) return;
    const pending = state.globalHistory.pending;
    if (!pending?.snapshot) return;
    const current = createGlobalHistorySnapshot();
    if (areGlobalHistorySnapshotsEqual(pending.snapshot, current)) {
      state.globalHistory.pending = null;
      return;
    }
    const undo = state.globalHistory.undo;
    const last = undo[undo.length - 1]?.snapshot;
    if (!areGlobalHistorySnapshotsEqual(last, pending.snapshot)) {
      undo.push({ label: label || pending.label || "Alteração", snapshot: pending.snapshot });
      if (undo.length > GLOBAL_HISTORY_LIMIT) undo.shift();
    }
    state.globalHistory.redo = [];
    state.globalHistory.pending = null;
    renderGlobalImportHistoryControls();
  }

  async function restoreGlobalHistorySnapshot(snapshot) {
    if (!snapshot?.draft) return;
    isRestoringGlobalHistory = true;
    state.draftRestoring = true;
    try {
      closePassengerPicker();
      closePassengerEditPopup();
      closeImportedPassengerPopupWithoutSave();
      closeAllCustomSelects();
      await applyDraftSnapshotToForm(snapshot.draft, { restoreTab: false });
      state.importReview = cloneGlobalHistoryValue(snapshot.importReview);
      state.importReviewFilter = normalizeImportReviewFilter(snapshot.importReviewFilter);
      renderScheduleDrafts();
      renderPassengers();
      renderTabBadges();
      renderRiskPanel();
      renderImportReview();
      setTab(state.isNew ? (snapshot.currentTab || snapshot.draft.currentTab || "details") : "details");
      renderGlobalImportHistoryControls();
    } finally {
      state.draftRestoring = false;
      isRestoringGlobalHistory = false;
      saveDraftSnapshot();
    }
  }

  async function undoGlobalHistoryChange() {
    const history = state.globalHistory;
    if (!history.undo.length) {
      toast("Nada para desfazer.", "warning", 2500);
      return false;
    }
    const current = createGlobalHistorySnapshot();
    const previous = history.undo.pop();
    history.redo.push({ label: previous.label, snapshot: current });
    await restoreGlobalHistorySnapshot(previous.snapshot);
    toast(`Desfeito: ${previous.label || "alteração"}.`, "success", 2600);
    return true;
  }

  async function redoGlobalHistoryChange() {
    const history = state.globalHistory;
    if (!history.redo.length) {
      toast("Nada para refazer.", "warning", 2500);
      return false;
    }
    const current = createGlobalHistorySnapshot();
    const next = history.redo.pop();
    history.undo.push({ label: next.label, snapshot: current });
    if (history.undo.length > GLOBAL_HISTORY_LIMIT) history.undo.shift();
    await restoreGlobalHistorySnapshot(next.snapshot);
    toast(`Refeito: ${next.label || "alteração"}.`, "success", 2600);
    return true;
  }

  function createDraftSnapshot() {
    syncAllDateTimeInputs();
    return {
      version: 1,
      recordId: state.recordId || "",
      updatedAt: new Date().toISOString(),
      currentTab: state.currentTab,
      obsAtual: state.obsAtual,
      retObsAtual: state.retObsAtual,
      enderecoPersonalizadoAtivo: state.enderecoPersonalizadoAtivo,
      activationDraftEditState: { ...state.activationDraftEditState },
      fields: {
        statusOperacao: el.statusOperacao.value,
        statusFaturamento: el.statusFaturamento.value,
        saidaData: el.saidaData.value,
        saidaHora: el.saidaHora.value,
        saidaMinuto: el.saidaMinuto.value,
        retPrevDateTime: el.retPrevDateTime?.value || "",
        retPrevHora: el.retPrevHora.value,
        retPrevMinuto: el.retPrevMinuto.value,
        cliente: el.cliente.value,
        solicitante: el.solicitante.value,
        tipoServico: el.tipoServico.value,
        tipoVeiculo: el.tipoVeiculo.value,
        motorista: el.motorista.value,
        trajeto: el.trajeto.value,
        observacao: el.observacao.value,
        receber: el.receber.checked,
        cotacao: el.cotacao.value,
        op: el.op.value,
        formaPagamento: el.formaPagamento.value,
        cr: el.cr.value,
        enderecoPersonalizado: el.enderecoPersonalizado.value,
        destino: el.destino.value,
        agendarRetorno: el.agendarRetorno.checked,
        receberRetorno: !!el.receberRetorno?.checked,
        retornoData: el.retornoData.value,
        retornoHora: el.retornoHora.value,
        retornoMinuto: el.retornoMinuto.value,
        retornoEndereco: el.retornoEndereco.value,
        retornoDestino: el.retornoDestino.value,
        retornoObservacao: el.retornoObservacao.value,
        repetirServico: el.repetirServico.checked,
        frequenteInicio: el.frequenteInicio.value,
        frequenteFim: el.frequenteFim.value,
        frequenteTipo: el.frequenteTipo.value,
        contabilizarFds: el.contabilizarFds.checked
      },
      obs: { ...state.obs },
      obsRet: { ...state.obsRet },
      selectedPassengers: state.selectedPassengers.map((item) => ({
        ordem: item.ordem,
        guid: item.guid,
        telefone: item.telefone,
        enderecoEditado: item.enderecoEditado
      })),
      enderecoRascunho: state.enderecoRascunho.map((item) => ({ ...item })),
      scheduleDrafts: []
    };
  }

  async function restoreDraftSnapshot() {
    const snapshot = readDraftSnapshot();
    if (!snapshot) {
      state.draftCommonEdited = false;
      state.activationDraftEditState = { return: false, repeat: false };
      state.importDraftEditState = { common: false, retorno: false };
      renderDraftStatus();
      return;
    }
    if ((snapshot.recordId || "") !== (state.recordId || "")) {
      state.draftCommonEdited = false;
      state.activationDraftEditState = { return: false, repeat: false };
      state.importDraftEditState = { common: false, retorno: false };
      renderDraftStatus();
      return;
    }

    state.draftRestoring = true;
    try {
      await ensurePassengersByIds((snapshot.selectedPassengers || []).map((item) => item.guid));
      const fields = snapshot.fields || {};
      setSelectValue(el.statusOperacao, fields.statusOperacao || "");
      setSelectValue(el.statusFaturamento, fields.statusFaturamento || "");
      setFieldValue(el.saidaData, dateTimeLocalFromParts(fields.saidaData, fields.saidaHora, fields.saidaMinuto) || fields.saidaData);
      setSelectValue(el.saidaHora, fields.saidaHora || "");
      setSelectValue(el.saidaMinuto, fields.saidaMinuto || "");
      setFieldValue(el.retPrevDateTime, fields.retPrevDateTime || dateTimeLocalFromParts(fields.saidaData, fields.retPrevHora, fields.retPrevMinuto));
      setSelectValue(el.retPrevHora, fields.retPrevHora || "");
      setSelectValue(el.retPrevMinuto, fields.retPrevMinuto || "");
      setSelectValue(el.cliente, fields.cliente || "");
      setSelectValue(el.solicitante, fields.solicitante || "");
      setSelectValue(el.tipoServico, fields.tipoServico || "");
      setSelectValue(el.tipoVeiculo, fields.tipoVeiculo || "");
      setSelectValue(el.motorista, fields.motorista || "");
      setFieldValue(el.trajeto, fields.trajeto);
      setFieldValue(el.receber, fields.receber);
      setFieldValue(el.cotacao, formatCurrencyDisplayValue(fields.cotacao));
      setSelectValue(el.op, fields.op || "");
      setSelectValue(el.formaPagamento, fields.formaPagamento || "");
      setFieldValue(el.cr, fields.cr);
      setFieldValue(el.enderecoPersonalizado, fields.enderecoPersonalizado);
      setFieldValue(el.destino, fields.destino);
      setFieldValue(el.agendarRetorno, fields.agendarRetorno);
      setFieldValue(el.receberRetorno, fields.receberRetorno);
      setFieldValue(el.retornoData, dateTimeLocalFromParts(fields.retornoData, fields.retornoHora, fields.retornoMinuto) || fields.retornoData);
      setSelectValue(el.retornoHora, fields.retornoHora || "");
      setSelectValue(el.retornoMinuto, fields.retornoMinuto || "");
      setFieldValue(el.retornoEndereco, fields.retornoEndereco);
      setFieldValue(el.retornoDestino, fields.retornoDestino);
      setFieldValue(el.repetirServico, fields.repetirServico);
      setFieldValue(el.frequenteInicio, fields.frequenteInicio);
      setFieldValue(el.frequenteFim, fields.frequenteFim);
      setSelectValue(el.frequenteTipo, fields.frequenteTipo || "");
      setFieldValue(el.contabilizarFds, fields.contabilizarFds);

      state.obs = { ...state.obs, ...(snapshot.obs || {}) };
      state.obsRet = { ...state.obsRet, ...(snapshot.obsRet || {}) };
      state.obsAtual = snapshot.obsAtual || "motorista";
      state.retObsAtual = snapshot.retObsAtual || "motorista";
      state.activationDraftEditState = {
        return: !fields.agendarRetorno && hasReturnDraftContent(),
        repeat: !fields.repetirServico && hasRepeatDraftContent()
      };
      state.enderecoPersonalizadoAtivo = !!snapshot.enderecoPersonalizadoAtivo;
      state.scheduleDrafts = [];
      state.enderecoRascunho = Array.isArray(snapshot.enderecoRascunho) ? snapshot.enderecoRascunho.map((item) => ({ ...item })) : [];
      state.selectedPassengers = restoreDraftPassengers(snapshot.selectedPassengers || []);
      state.draftCommonEdited = hasCommonDraftContent(snapshot);
      state.importDraftEditState = { common: false, retorno: false };
      hydratePassengerSelectionRecencyFromRows(state.selectedPassengers);

      el.observacao.value = state.obs[state.obsAtual] || fields.observacao || "";
      el.retornoObservacao.value = state.obsRet[state.retObsAtual] || fields.retornoObservacao || "";

      renderScheduleDrafts();
      renderPassengers();
      renderTabBadges();
      renderRiskPanel();
      renderDraftStatus();
      setTab(state.isNew ? (snapshot.currentTab || "details") : "details");
    } catch (error) {
      console.warn("Falha ao restaurar dados locais", error);
      state.draftCommonEdited = false;
      renderDraftStatus("Dados locais inválidos.");
    } finally {
      state.draftRestoring = false;
    }
  }

  async function applyDraftSnapshotToForm(snapshot, options = {}) {
    const config = { restoreTab: true, ...options };
    await ensurePassengersByIds((snapshot.selectedPassengers || []).map((item) => item.guid));
    const fields = snapshot.fields || {};
    setSelectValue(el.statusOperacao, fields.statusOperacao || "");
    setSelectValue(el.statusFaturamento, fields.statusFaturamento || "");
    setFieldValue(el.saidaData, dateTimeLocalFromParts(fields.saidaData, fields.saidaHora, fields.saidaMinuto) || fields.saidaData);
    setSelectValue(el.saidaHora, fields.saidaHora || "");
    setSelectValue(el.saidaMinuto, fields.saidaMinuto || "");
    setFieldValue(el.retPrevDateTime, fields.retPrevDateTime || dateTimeLocalFromParts(fields.saidaData, fields.retPrevHora, fields.retPrevMinuto));
    setSelectValue(el.retPrevHora, fields.retPrevHora || "");
    setSelectValue(el.retPrevMinuto, fields.retPrevMinuto || "");
    setSelectValue(el.cliente, fields.cliente || "");
    setSelectValue(el.solicitante, fields.solicitante || "");
    setSelectValue(el.tipoServico, fields.tipoServico || "");
    setSelectValue(el.tipoVeiculo, fields.tipoVeiculo || "");
    setSelectValue(el.motorista, fields.motorista || "");
    setFieldValue(el.trajeto, fields.trajeto);
    setFieldValue(el.receber, fields.receber);
    setFieldValue(el.cotacao, formatCurrencyDisplayValue(fields.cotacao));
    setSelectValue(el.op, fields.op || "");
    setSelectValue(el.formaPagamento, fields.formaPagamento || "");
    setFieldValue(el.cr, fields.cr);
    setFieldValue(el.enderecoPersonalizado, fields.enderecoPersonalizado);
    setFieldValue(el.destino, fields.destino);
    setFieldValue(el.agendarRetorno, fields.agendarRetorno);
    setFieldValue(el.receberRetorno, fields.receberRetorno);
    setFieldValue(el.retornoData, dateTimeLocalFromParts(fields.retornoData, fields.retornoHora, fields.retornoMinuto) || fields.retornoData);
    setSelectValue(el.retornoHora, fields.retornoHora || "");
    setSelectValue(el.retornoMinuto, fields.retornoMinuto || "");
    setFieldValue(el.retornoEndereco, fields.retornoEndereco);
    setFieldValue(el.retornoDestino, fields.retornoDestino);
    setFieldValue(el.retornoObservacao, fields.retornoObservacao);
    setFieldValue(el.repetirServico, fields.repetirServico);
    setFieldValue(el.frequenteInicio, fields.frequenteInicio);
    setFieldValue(el.frequenteFim, fields.frequenteFim);
    setSelectValue(el.frequenteTipo, fields.frequenteTipo || "");
    setFieldValue(el.contabilizarFds, fields.contabilizarFds);

    state.obs = { motorista: "", interna: "", final: "", passageiro: "", ...(snapshot.obs || {}) };
    state.obsRet = { motorista: "", interna: "", final: "", passageiro: "", ...(snapshot.obsRet || {}) };
    state.obsAtual = snapshot.obsAtual || "motorista";
    state.retObsAtual = snapshot.retObsAtual || "motorista";
    state.activationDraftEditState = snapshot.activationDraftEditState
      ? {
          return: !!snapshot.activationDraftEditState.return,
          repeat: !!snapshot.activationDraftEditState.repeat
        }
      : { return: false, repeat: false };
    state.enderecoPersonalizadoAtivo = !!snapshot.enderecoPersonalizadoAtivo;
    state.scheduleDrafts = Array.isArray(snapshot.scheduleDrafts) ? snapshot.scheduleDrafts.map((item) => ({ ...item })) : [];
    state.enderecoRascunho = Array.isArray(snapshot.enderecoRascunho) ? snapshot.enderecoRascunho.map((item) => ({ ...item })) : [];
    state.selectedPassengers = restoreDraftPassengers(snapshot.selectedPassengers || []);
    state.draftCommonEdited = hasCommonDraftContent(snapshot);
    state.importDraftEditState = { common: false, retorno: false };
    hydratePassengerSelectionRecencyFromRows(state.selectedPassengers);

    el.observacao.value = state.obs[state.obsAtual] || fields.observacao || "";
    el.retornoObservacao.value = state.obsRet[state.retObsAtual] || fields.retornoObservacao || "";

    renderScheduleDrafts();
    renderPassengers();
    renderTabBadges();
    renderRiskPanel();
    renderDraftStatus();
    if (config.restoreTab) setTab(state.isNew ? (snapshot.currentTab || "details") : "details");
  }

  function restoreDraftPassengers(rows) {
    return rows
      .map((item, index) => {
        const passenger = state.passageiros.find((pax) => sameId(pax.id, item.guid));
        if (!passenger) return null;
        return {
          rowKey: nextPassengerRowKey(),
          ordem: Number(item.ordem) || index + 1,
          passageiro: passenger,
          guid: passenger.id,
          telefone: item.telefone || passenger.telefone || "",
          enderecoEditado: item.enderecoEditado || passenger.endereco || ""
        };
      })
      .filter(Boolean);
  }

  function clearDraftSnapshot(showToast) {
    if (state.draftTimer) {
      window.clearTimeout(state.draftTimer);
      state.draftTimer = null;
    }
    try {
      window.localStorage.removeItem(DRAFT_STORE_KEY);
    } catch (error) {
      console.warn("Falha ao remover dados locais", error);
    }
    state.draftCommonEdited = false;
    state.importDraftEditState = { common: false, retorno: false };
    state.lastDraftSavedAt = null;
    renderDraftStatus();
    if (showToast) toast("Dados locais removidos.", "success", 2500);
  }

  function renderDraftStatus(forcedText = "") {
  }

  function readDraftSnapshot() {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function setFieldValue(element, value) {
    if (!element) return;
    if (element.type === "checkbox") {
      element.checked = !!value;
      return;
    }
    element.value = value ?? "";
  }

  function selectedText(select) {
    return select?.selectedOptions?.[0]?.textContent?.trim() || "";
  }

  function formatTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function populateTimeSelects() {
    const hours = ["", ...Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))];
    const hoursRequired = hours.slice(1);
    const minutes = ["", "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
    const minutesRequired = minutes.slice(1);
    fillOptions(el.saidaHora, hoursRequired);
    fillOptions(el.saidaMinuto, minutesRequired);
    el.retPrevHora.dataset.placeholderLabel = "00";
    el.retPrevMinuto.dataset.placeholderLabel = "00";
    fillOptions(el.retPrevHora, hours);
    fillOptions(el.retPrevMinuto, minutes);
    fillOptions(el.retornoHora, hoursRequired);
    fillOptions(el.retornoMinuto, minutesRequired);
  }

  function fillOptions(select, values) {
    if (!select || !select.options) return;
    select.innerHTML = "";
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function setTab(tab) {
    if ((tab === "import" || tab === "bd" || tab === "return" || tab === "repeat") && !state.isNew) {
      toast("Agendamento de retorno e serviços frequentes só na criação.", "error");
      return;
    }
    state.currentTab = tab;
    el.tabs.forEach((button) => {
      const isActive = button.dataset.tab === tab;
      button.classList.toggle("is-active", isActive);
      button.toggleAttribute("aria-current", isActive);
    });
    el.panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === tab));
    if (tab === "return") syncReturnDefaults();
    updateSaveButtonText();
  }

  function updateSaveButtonText() {
    if (!el.saveButtonText) return;
    const text = state.isNew
      ? isImportSaveMode()
        ? "Agendar serviços importados"
        : "Agendar serviços"
      : "Salvar edições";
    el.saveButtonText.textContent = text;
  }

  function switchObs(next, isReturn) {
    captureGlobalHistoryBeforeMutation(isReturn ? "Trocar observação do retorno" : "Trocar observação");
    if (isReturn) {
      state.obsRet[state.retObsAtual] = el.retornoObservacao.value;
      state.retObsAtual = next;
      el.retornoObservacao.value = state.obsRet[next] || "";
      document.querySelectorAll("[data-ret-obs]").forEach((button) => {
        const isActive = button.dataset.retObs === next;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      });
      return;
    }
    state.obs[state.obsAtual] = el.observacao.value;
    state.obsAtual = next;
    el.observacao.value = next === "passageiro" ? composePreferencias() : state.obs[next] || "";
    document.querySelectorAll("[data-obs]").forEach((button) => {
      const isActive = button.dataset.obs === next;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    requestAnimationFrame(() => {
      el.observacao?.focus();
      el.observacao?.setSelectionRange?.(el.observacao.value.length, el.observacao.value.length);
    });
    commitGlobalHistoryChange("Trocar observação");
  }

  function emptyPassenger(ordem) {
    return {
      rowKey: nextPassengerRowKey(),
      ordem,
      passageiro: null,
      guid: "",
      telefone: "",
      enderecoEditado: ""
    };
  }

  function nextPassengerRowKey() {
    state.passengerRowSeq += 1;
    return `px-${state.passengerRowSeq}-${Date.now().toString(36)}`;
  }

  function nextScheduleDraftKey() {
    state.scheduleDraftSeq += 1;
    return `svc-${state.scheduleDraftSeq}-${Date.now().toString(36)}`;
  }

  function mainScheduleSnapshot() {
    return {
      key: nextScheduleDraftKey(),
      dataHora: el.saidaData.value,
      data: datePartFromInputValue(el.saidaData.value),
      hora: el.saidaHora.value,
      minuto: el.saidaMinuto.value,
      retPrevDateTime: el.retPrevDateTime?.value || "",
      retPrevHora: el.retPrevHora.value,
      retPrevMinuto: el.retPrevMinuto.value,
      tipoServico: el.tipoServico.value,
      tipoVeiculo: el.tipoVeiculo.value,
      motorista: el.motorista.value,
      trajeto: el.trajeto.value.trim(),
      destino: el.destino.value.trim(),
      obsMotorista: state.obsAtual === "motorista" ? el.observacao.value : state.obs.motorista
    };
  }

  function addScheduleDraft() {
    state.scheduleDrafts = [];
  }

  function handleScheduleDraftAction(event) {
    const button = event.target.closest("[data-schedule-action]");
    if (!button) return;
    const row = button.closest(".schedule-draft");
    if (!row) return;
    const key = row.dataset.scheduleKey;
    const action = button.dataset.scheduleAction;

    if (action === "remove") {
      captureGlobalHistoryBeforeMutation("Remover agendamento");
      state.scheduleDrafts = state.scheduleDrafts.filter((item) => item.key !== key);
      renderScheduleDrafts();
      renderRiskPanel();
      markDraftDirty();
      commitGlobalHistoryChange("Remover agendamento");
      return;
    }

    if (action === "copy") {
      const current = state.scheduleDrafts.find((item) => item.key === key);
      if (!current) return;
      captureGlobalHistoryBeforeMutation("Copiar agendamento principal");
      Object.assign(current, mainScheduleSnapshot(), { key });
      renderScheduleDrafts();
      renderRiskPanel();
      markDraftDirty();
      toast("Dados do principal copiados", "success", 2500);
      commitGlobalHistoryChange("Copiar agendamento principal");
    }
  }

  function handleScheduleDraftChange(event) {
    const field = event.target.closest("[data-schedule-field]");
    if (!field) return;
    const row = field.closest(".schedule-draft");
    if (!row) return;
    const item = state.scheduleDrafts.find((draft) => draft.key === row.dataset.scheduleKey);
    if (!item) return;
    const fieldName = field.dataset.scheduleField;
    item[fieldName] = field.value;
    if (fieldName === "dataHora") {
      item.data = datePartFromInputValue(field.value);
      item.hora = timePartFromInputValue(field.value).split(":")[0] || "";
      item.minuto = timePartFromInputValue(field.value).split(":")[1] || "";
    }
    if (fieldName === "retPrevDateTime") {
      item.retPrevHora = timePartFromInputValue(field.value).split(":")[0] || "";
      item.retPrevMinuto = timePartFromInputValue(field.value).split(":")[1] || "";
    }
  }

  function sortPassengers() {
    state.selectedPassengers.sort((a, b) => a.ordem - b.ordem);
  }

  function getAvailablePassengers() {
    return getAvailablePassengersFrom(state.passageiros);
  }

  function getAvailablePassengersFrom(rows) {
    const usedIds = new Set(
      state.selectedPassengers
        .map((item) => cleanGuid(item.guid || ""))
        .filter(Boolean)
        .map((id) => id.toLowerCase())
    );
    return (rows || [])
      .filter((pax) => !usedIds.has(cleanGuid(pax.id).toLowerCase()))
      .slice()
      .sort((a, b) => {
        const aIndex = getPassengerSelectionRecencyIndex(a.id);
        const bIndex = getPassengerSelectionRecencyIndex(b.id);
        if (aIndex !== bIndex) return aIndex - bIndex;
        return (a.label || "").localeCompare(b.label || "", "pt-BR");
      });
  }

  async function openPassengerPicker(targetOrder = null) {
    const normalizedOrder = Number(targetOrder);
    passengerPickerTargetOrder = Number.isFinite(normalizedOrder) && normalizedOrder > 0 ? normalizedOrder : null;
    if (!el.passengerPickerOverlay || !el.passengerPickerSearch || !el.passengerPickerResults) return;
    el.passengerPickerSearch.value = "";
    renderPassengerPickerResults();
    el.passengerPickerOverlay.hidden = false;
    if (shouldAutofocusSearchInputs()) {
      requestAnimationFrame(() => {
        if (el.passengerPickerSearch) el.passengerPickerSearch.focus();
      });
    }
  }

  function closePassengerPicker() {
    passengerPickerTargetOrder = null;
    if (!el.passengerPickerOverlay) return;
    el.passengerPickerOverlay.hidden = true;
    if (el.passengerPickerSearch) el.passengerPickerSearch.value = "";
    if (el.passengerPickerResults) {
      el.passengerPickerResults.textContent = "";
      el.passengerPickerResults.scrollTop = 0;
    }
  }

  function schedulePassengerPickerSearch() {
    if (passengerPickerSearchTimer) window.clearTimeout(passengerPickerSearchTimer);
    passengerPickerSearchTimer = window.setTimeout(() => {
      passengerPickerSearchTimer = null;
      renderPassengerPickerResults();
    }, 250);
  }

  async function renderPassengerPickerResults() {
    if (!el.passengerPickerSearch || !el.passengerPickerResults) return;
    const query = el.passengerPickerSearch.value.trim();
    const searchSeq = ++passengerPickerSearchSeq;
    renderPassengerPickerHint(query ? "Pesquisando passageiros..." : "Carregando Banco de Dados...");
    let list = [];
    try {
      list = getAvailablePassengersFrom(await searchPassengersServer(query, 30));
    } catch (error) {
      console.error(error);
      renderPassengerPickerHint("Falha ao pesquisar passageiros. Tente novamente.");
      return;
    }
    if (searchSeq !== passengerPickerSearchSeq) return;
    el.passengerPickerResults.innerHTML = "";
    if (!list.length) {
      renderPassengerPickerHint("Nenhum passageiro encontrado.");
      return;
    }
    list.forEach((pax) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "passenger-picker-item";
      item.dataset.passengerAction = "add-passenger";
      item.dataset.passengerId = pax.id;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
      item.setAttribute("tabindex", "0");

      const head = document.createElement("strong");
      head.className = "passenger-picker-name";
      head.textContent = pax.label || "Passageiro sem nome";

      const meta = document.createElement("span");
      meta.className = "passenger-picker-meta";
      meta.textContent = [pax.telefone, pax.email].filter(Boolean).join(" • ");
      if (!meta.textContent) {
        meta.textContent = "Sem contatos";
      }
      const subtitle = document.createElement("small");
      subtitle.className = "passenger-picker-id";
      subtitle.textContent = pax.clienteLabel || "-";
      item.append(head);
      item.appendChild(subtitle);
      el.passengerPickerResults.appendChild(item);
    });
    const first = el.passengerPickerResults.querySelector(".passenger-picker-item");
    if (first) {
      first.classList.add("is-active");
      first.setAttribute("aria-selected", "true");
    }
  }

  function renderPassengerPickerHint(message) {
    if (!el.passengerPickerResults) return;
    el.passengerPickerResults.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "passenger-picker-empty";
    empty.textContent = message;
    el.passengerPickerResults.appendChild(empty);
  }

  function handlePassengerPickerAction(event) {
    const action = event.target.closest("[data-passenger-action='add-passenger']");
    if (!action) return;
    const passengerId = action.dataset.passengerId;
    if (!passengerId) return;
    addPassengerFromId(passengerId);
  }

  function handlePassengerPickerKeydown(event) {
    if (!el.passengerPickerOverlay || el.passengerPickerOverlay.hidden) return;
    if (event.key === "Escape") {
      closePassengerPicker();
      event.preventDefault();
      return;
    }
    if (event.key === "Enter") {
      const first = el.passengerPickerResults.querySelector(".passenger-picker-item.is-active") || el.passengerPickerResults.querySelector("[data-passenger-action='add-passenger']");
      if (first) {
        event.preventDefault();
        addPassengerFromId(first.dataset.passengerId);
      }
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = [...el.passengerPickerResults.querySelectorAll("[data-passenger-action='add-passenger']")];
    if (!items.length) return;
    event.preventDefault();
    let current = items.findIndex((item) => item.classList.contains("is-active"));
    if (current < 0) {
      current = items.indexOf(document.activeElement);
    }
    let next = 0;
    if (event.key === "ArrowDown") {
      next = current >= items.length - 1 ? 0 : current + 1;
    } else {
      next = current <= 0 ? items.length - 1 : current - 1;
    }
    items.forEach((item, index) => {
      item.classList.toggle("is-active", index === next);
      item.setAttribute("aria-selected", String(index === next));
    });
    items[next].focus();
    items[next].scrollIntoView({ block: "nearest" });
  }

  function addPassengerFromId(passengerId) {
    const selected = state.passageiros.find((item) => sameId(item.id, passengerId)) || null;
    if (!selected) {
      toast("Passageiro não encontrado para seleção.", "error");
      closePassengerPicker();
      return;
    }
    const alreadyAdded = state.selectedPassengers.some((item) => sameId(item.guid, selected.id));
    if (alreadyAdded) {
      toast("Esse passageiro já está na lista.", "warning", 2500);
      closePassengerPicker();
      renderPassengers();
      return;
    }
    captureGlobalHistoryBeforeMutation("Adicionar passageiro");
    const targetOrder = Number(passengerPickerTargetOrder);
    const targetIndex = Number.isFinite(targetOrder)
      ? state.selectedPassengers.findIndex((item) => item.ordem === targetOrder && (!item.passageiro || !item.guid))
      : -1;
    passengerPickerTargetOrder = null;
    if (targetIndex >= 0) {
      const current = state.selectedPassengers[targetIndex];
      state.selectedPassengers[targetIndex] = {
        ...current,
        passageiro: selected,
        guid: selected.id,
        telefone: selected.telefone || "",
        enderecoEditado: state.enderecoPersonalizadoAtivo ? "" : selected.endereco || ""
      };
      if (!state.enderecoPersonalizadoAtivo) {
        setDraftAddress(current.ordem, selected.endereco || "");
      }
    } else {
      const nextOrder = Math.max(0, ...state.selectedPassengers.map((item) => item.ordem)) + 1;
      state.selectedPassengers.push({
        rowKey: nextPassengerRowKey(),
        ordem: nextOrder,
        passageiro: selected,
        guid: selected.id,
        telefone: selected.telefone || "",
        enderecoEditado: state.enderecoPersonalizadoAtivo ? "" : selected.endereco || ""
      });
      if (!state.enderecoPersonalizadoAtivo) {
        setDraftAddress(nextOrder, selected.endereco || "");
        state.enderecoRascunho.push({ ordem: nextOrder, endereco: selected.endereco || "" });
      }
    }
    touchPassengerSelectionRecency(selected.id);
    applyPassengerDefaults(true);
    const currentSolicitante = el.solicitante.value;
    renderLookupSelect(el.solicitante, state.passageiros);
    setSelectValue(el.solicitante, currentSolicitante || selected.id);
    closePassengerPicker();
    renderPassengers();
    renderRiskPanel();
    markDraftDirty();
    commitGlobalHistoryChange("Adicionar passageiro");
    toast(`${selected.label || "Passageiro"} adicionado.`, "success", 2200);
  }

  function addPassengerRow() {
    const pendingPassenger = state.selectedPassengers.find((item) => !item.passageiro || !item.guid);
    if (pendingPassenger) {
      openPassengerPicker(pendingPassenger.ordem);
      return;
    }
    openPassengerPicker();
  }

  function removePassengerRow(ordem, row = null) {
    captureGlobalHistoryBeforeMutation("Remover passageiro");
    if (row) {
      closePassengerPreview(row.querySelector(".row-title-wrap"));
      animatePassengerRowExit(row);
    }
    state.selectedPassengers = state.selectedPassengers.filter((item) => item.ordem !== ordem);
    state.enderecoRascunho = state.enderecoRascunho.filter((item) => item.ordem !== ordem);
    reindexPassengers();
    renderPassengers();
    applyPassengerDefaults(false);
    renderRiskPanel();
    markDraftDirty();
    commitGlobalHistoryChange("Remover passageiro");
    toast(`Passageiro ${ordem} removido`, "success", 3000);
  }

  function reindexPassengers() {
    sortPassengers();
    state.selectedPassengers = state.selectedPassengers.map((item, index) => ({ ...item, ordem: index + 1 }));
    state.enderecoRascunho = state.selectedPassengers.map((item) => ({
      ordem: item.ordem,
      endereco: getDraftAddress(item.ordem) || item.enderecoEditado || ""
    }));
  }

  function toggleEnderecoPersonalizado() {
    captureGlobalHistoryBeforeMutation("Alternar endereço dos passageiros");
    if (state.enderecoPersonalizadoAtivo) {
      state.selectedPassengers = state.selectedPassengers.map((item) => ({
        ...item,
        enderecoEditado: getDraftAddress(item.ordem) || item.passageiro?.endereco || ""
      }));
      state.enderecoRascunho = state.selectedPassengers.map((item) => ({
        ordem: item.ordem,
        endereco: item.enderecoEditado || ""
      }));
      state.enderecoPersonalizadoAtivo = false;
    } else {
      el.enderecoPersonalizado.value = composeEnderecoCompleto();
      state.enderecoPersonalizadoAtivo = true;
    }
    renderPassengers();
    renderRiskPanel();
    markDraftDirty();
    commitGlobalHistoryChange("Alternar endereço dos passageiros");
  }

  function setDraftAddress(ordem, endereco) {
    const item = state.enderecoRascunho.find((row) => row.ordem === ordem);
    if (item) item.endereco = endereco;
    else state.enderecoRascunho.push({ ordem, endereco });
  }

  function getDraftAddress(ordem) {
    return state.enderecoRascunho.find((row) => row.ordem === ordem)?.endereco || "";
  }

  function applyPassengerDefaults(force) {
    const selected = state.selectedPassengers.map((item) => item.passageiro).filter(Boolean);
    const firstVehicle = selected.find((p) => p.tipoVeiculo || p.tipoVeiculoLabel);
    const vehicleValue = firstVehicle
      ? firstVehicle.tipoVeiculo || findOptionValue("tipoVeiculo", firstVehicle.tipoVeiculoLabel)
      : "";
    const firstCr = selected.find((p) => p.cr)?.cr || "";
    if ((force || !el.tipoVeiculo.value) && vehicleValue) {
      setSelectValue(el.tipoVeiculo, vehicleValue);
      if (!el.tipoVeiculo.value && firstVehicle?.tipoVeiculoLabel) {
        setSelectValue(el.tipoVeiculo, findOptionValue("tipoVeiculo", firstVehicle.tipoVeiculoLabel));
      }
    }
    if ((force || !el.cr.value) && firstCr) el.cr.value = firstCr;
  }

  function applyStatusFaturamentoDefault() {
    if (!state.isNew && state.record) return;
    const cliente = state.clientes.find((item) => sameId(item.id, el.cliente.value));
    const name = (cliente?.label || "").toLowerCase();
    const mensal = ["tenaris", "embraer", "eldorado", "latazza"].some((term) => name.includes(term));
    const label = mensal ? "Faturamento Mensal" : "Pendente";
    el.statusFaturamento.dataset.defaultValue = findOptionValue("statusFaturamento", label) || "";
    if (!el.statusFaturamento.value) el.statusFaturamento.value = el.statusFaturamento.dataset.defaultValue;
  }

  function syncRepeatDefaultDates() {
    const saidaDate = datePartFromInputValue(el.saidaData.value);
    if (saidaDate) {
      if (!el.frequenteInicio.value) el.frequenteInicio.value = saidaDate;
      if (!el.frequenteFim.value) el.frequenteFim.value = saidaDate;
      if (!el.retornoData.value) {
        el.retornoData.value = el.saidaData.value;
        syncLegacyTimePartsFromDateTime(el.retornoData, el.retornoHora, el.retornoMinuto);
      }
    }
  }

  function syncReturnDefaults() {
    if (!el.retornoEndereco.value) el.retornoEndereco.value = el.destino.value || "";
    const inverted = composeEnderecoCompletoInvertido();
    if (!el.retornoDestino.value || el.retornoDestino.dataset.auto === "1") {
      el.retornoDestino.value = inverted;
      el.retornoDestino.dataset.auto = "1";
    }
  }

  async function createPassenger() {
    clearValidationStates();
    el.bdNome.value = normalizePassengerDisplayName(el.bdNome.value);
    const parsedPhone = parsePhoneNumberForInput(el.bdTelefone.value, selectedPhoneCountryCode(), {
      manualCountry: el.bdTelefone?.dataset.phoneCountryManual === "1"
    });
    el.bdTelefone.value = parsedPhone.formatted;
    syncPhoneCountryFromParsed(parsedPhone, { refreshDisplay: true });
    updatePhoneCountryHint(el.bdTelefone, parsedPhone);
    el.bdEmail.value = normalizeEmail(el.bdEmail.value);
    el.bdCr.value = normalizeCodeValue(el.bdCr.value);
    const required = [
      [el.bdNome.value.trim(), "'Nome do Passageiro' é obrigatório."],
      [el.bdCliente.value, "'Cliente' é obrigatório."],
      [el.bdIdioma.value, "'Idioma' é obrigatório."],
      [el.bdClassificacao.value, "'Classificação' é obrigatório."]
    ];
    const requiredControls = [el.bdNome, el.bdCliente, el.bdIdioma, el.bdClassificacao];
    const missingIndex = required.findIndex(([value]) => !value);
    const missing = missingIndex >= 0 ? required[missingIndex] : null;
    if (missing) {
      toast(missing[1], "error");
      revealInvalidField(requiredControls[missingIndex], missing[1], { tab: "bd" });
      return;
    }

    if (!validatePhoneControl(el.bdTelefone, { tab: "bd" })) {
      toast("'Telefone' inválido.", "error");
      return;
    }

    if (!validateEmailControl(el.bdEmail, { tab: "bd" })) {
      toast("'Email' inválido.", "error");
      return;
    }

    const duplicateCandidates = await findPassengerDuplicateCandidates(readPassengerCreateCandidate());
    if (duplicateCandidates.length) {
      const decision = await openPassengerMatchReview(duplicateCandidates);
      if (decision.action === "cancel") return;
    }

    setLoading(true);
    try {
      const payload = {
        [CONFIG.fields.passageiro.nome]: el.bdNome.value.trim(),
        [CONFIG.fields.passageiro.telefone]: phoneStorageValue(el.bdTelefone.value, selectedPhoneCountryCode()),
        [CONFIG.fields.passageiro.enderecoSaida]: el.bdEndereco.value.trim(),
        [CONFIG.fields.passageiro.preferencias]: el.bdPreferencias.value.trim(),
        [CONFIG.fields.passageiro.email]: el.bdEmail.value.trim(),
        [CONFIG.fields.passageiro.cr]: el.bdCr.value.trim(),
        [CONFIG.fields.passageiro.departamento]: el.bdDepartamento.value.trim(),
        [CONFIG.fields.passageiro.cadastro]: new Date().toISOString().slice(0, 10)
      };
      setChoice(payload, CONFIG.fields.passageiro.status, getActivePassengerStatusValue());
      setChoice(payload, CONFIG.fields.passageiro.cargo, el.bdCargo.value);
      setChoice(payload, CONFIG.fields.passageiro.sexo, el.bdSexo.value);
      setChoice(payload, CONFIG.fields.passageiro.idioma, el.bdIdioma.value);
      setChoice(payload, CONFIG.fields.passageiro.classificacao, el.bdClassificacao.value);
      setChoice(payload, CONFIG.fields.passageiro.tipoVeiculo, el.bdTipoVeiculo.value);
      if (el.bdNascimento.value) payload[CONFIG.fields.passageiro.nascimento] = el.bdNascimento.value;
      bindLookup(payload, CONFIG.nav.cliente, CONFIG.entitySets.cliente, el.bdCliente.value);

      let created;
      if (state.xrm && !state.mockMode) {
        created = await state.xrm.WebApi.createRecord(CONFIG.entities.passageiro, payload);
      } else {
        created = { id: `local-${Date.now()}` };
      }

      const newPassenger = {
        id: cleanGuid(created.id),
        ...passengerFormState()
      };
      state.passageiros.push(newPassenger);
      persistMockPassengerRecord(newPassenger);
      state.passageiros.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
      clearPassengerCreateForm();
      renderLookupSelect(el.solicitante, state.passageiros);
      renderPassengers();
      renderRiskPanel();
      markDraftDirty();
      setTab("details");
      toast(`Cadastro criado para ${newPassenger.label}!`, "success");
    } catch (error) {
      console.error(error);
      toast(`Falha ao cadastrar passageiro. ${error.message || ""}`, "error", 9000);
    } finally {
      setLoading(false);
    }
  }

  function clearPassengerCreateForm() {
    [
      el.bdNome,
      el.bdTelefone,
      el.bdEndereco,
      el.bdEmail,
      el.bdCr,
      el.bdDepartamento,
      el.bdNascimento,
      el.bdPreferencias
    ].forEach((input) => {
      setFieldValue(input, "");
    });
    [el.bdClassificacao, el.bdCliente, el.bdSexo, el.bdIdioma, el.bdCargo, el.bdTipoVeiculo].forEach((select) => {
      setSelectValue(select, "");
    });
    resetPhoneControl();
    clearValidationStates();
  }

  function passengerFormState() {
    return {
      label: el.bdNome.value.trim(),
      telefone: el.bdTelefone.value.trim(),
      email: el.bdEmail.value.trim(),
      endereco: el.bdEndereco.value.trim(),
      preferencias: el.bdPreferencias.value.trim(),
      cr: el.bdCr.value.trim(),
      clienteId: el.bdCliente.value,
      status: getActivePassengerStatusValue(),
      classificacao: el.bdClassificacao.value,
      sexo: el.bdSexo.value,
      idioma: el.bdIdioma.value,
      cargo: el.bdCargo.value,
      nascimento: el.bdNascimento.value,
      departamento: el.bdDepartamento.value.trim(),
      tipoVeiculo: el.bdTipoVeiculo.value
    };
  }

  function getActivePassengerStatusValue() {
    const active = (state.options.bdStatus || []).find((option) => normalize(option.label) === "ativo");
    if (active) return active.value;
    return FALLBACK.bdStatus[0]?.value || "";
  }

  function readPassengerCreateCandidate() {
    return {
      ...passengerFormState(),
      clienteLabel: state.clientes.find((item) => sameId(item.id, el.bdCliente.value))?.label || ""
    };
  }

  async function findPassengerDuplicateCandidates(candidate) {
    const terms = passengerDuplicateSearchTerms(candidate);
    const rows = [];
    rows.push(...await searchPassengerDuplicateClientPool(candidate.clienteId));
    for (const term of terms) {
      try {
        rows.push(...await searchPassengersServer(term, 20));
      } catch (error) {
        console.warn("Falha ao verificar duplicidade de passageiro", error);
      }
    }

    state.passageiros.forEach((passenger) => rows.push(passenger));
    const uniqueRows = [];
    const seen = new Set();
    rows.forEach((passenger) => {
      const id = cleanGuid(passenger?.id).toLowerCase();
      if (!id || seen.has(id)) return;
      seen.add(id);
      uniqueRows.push(passenger);
    });

    return uniqueRows
      .map((passenger) => scorePassengerCandidate(candidate, passenger))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  async function searchPassengerDuplicateClientPool(clientId) {
    const cleanClientId = cleanGuid(clientId);
    if (!cleanClientId) return [];
    if (!state.xrm || state.mockMode) {
      return state.passageiros.filter((passenger) => sameId(passenger.clienteId, cleanClientId)).slice(0, 100);
    }
    if (!isGuid(cleanClientId)) return [];

    try {
      const f = CONFIG.fields.passageiro;
      const rows = await retrieveAll(
        CONFIG.entities.passageiro,
        `?$select=${passengerSelectFields()}&$filter=_cr40f_cliente_value eq ${cleanClientId}&$orderby=${f.nome} asc&$top=100`
      );
      return rows.map(mapPassageiro);
    } catch (error) {
      console.warn("Falha ao buscar passageiros do mesmo cliente", error);
      return [];
    }
  }

  function passengerDuplicateSearchTerms(candidate) {
    const terms = [];
    const email = String(candidate.email || "").trim();
    const phone = onlyDigits(candidate.telefone);
    const cr = String(candidate.cr || "").trim();
    const name = normalizeName(candidate.label);
    const emailLocal = email.split("@")[0] || "";

    if (email) terms.push(email);
    if (emailLocal.length >= 3) terms.push(emailLocal);
    if (phone.length >= 4) terms.push(phone.slice(-4));
    if (cr) terms.push(cr);
    if (name) {
      terms.push(candidate.label);
      const tokens = name.split(" ").filter((token) => token.length >= 3);
      if (tokens[0]) terms.push(tokens[0]);
      if (tokens.length > 1) terms.push(tokens[tokens.length - 1]);
    }

    return Array.from(new Set(
      terms
        .map((term) => String(term || "").trim())
        .filter((term) => normalize(term).length > 0)
    )).slice(0, 5);
  }

  function scorePassengerCandidate(candidate, passenger) {
    const reasons = [];
    let score = 0;
    const candidatePhone = onlyDigits(candidate.telefone);
    const passengerPhone = onlyDigits(passenger.telefone);
    const candidateEmail = normalize(candidate.email);
    const passengerEmail = normalize(passenger.email);
    const candidateMissingContact = !candidatePhone && !candidateEmail;
    const sameClient = candidate.clienteId && passenger.clienteId && sameId(candidate.clienteId, passenger.clienteId);
    const similarity = nameSimilarity(candidate.label, passenger.label);

    if (candidatePhone && passengerPhone && phoneNumbersMatch(candidatePhone, passengerPhone)) {
      score += sameClient ? 70 : 55;
      reasons.push("Telefone igual");
    } else if (candidatePhone && passengerPhone && phoneNumbersNearlyMatch(candidatePhone, passengerPhone) && (sameClient || similarity >= 0.78)) {
      score += sameClient ? 35 : 25;
      reasons.push("Telefone parecido");
    }
    if (candidateEmail && passengerEmail && candidateEmail === passengerEmail) {
      score += sameClient ? 70 : 55;
      reasons.push("Email igual");
    } else if (candidateEmail && passengerEmail && emailsProbablySame(candidateEmail, passengerEmail) && (sameClient || similarity >= 0.78)) {
      score += sameClient ? 35 : 25;
      reasons.push("Email parecido");
    }

    if (normalizeName(candidate.label) && normalizeName(candidate.label) === normalizeName(passenger.label)) {
      score += 50;
      reasons.push("Nome igual");
      reasons.push("Nome quase igual");
    } else if (similarity >= 0.92) {
      score += 50;
      reasons.push("Nome quase igual");
    } else if (similarity >= 0.84) {
      score += sameClient ? 40 : 35;
      reasons.push("Nome muito parecido");
    } else if (similarity >= 0.74 && sameClient) {
      score += 30;
      reasons.push("Nome parecido no mesmo cliente");
    }
    if (sameClient) {
      score += 15;
      reasons.push("Mesmo cliente");
    }
    if (candidate.cr && passenger.cr && normalize(candidate.cr) === normalize(passenger.cr)) {
      score += 20;
      reasons.push("CR igual");
    }
    if (candidate.departamento && passenger.departamento && normalize(candidate.departamento) === normalize(passenger.departamento)) {
      score += 10;
      reasons.push("Mesmo departamento");
    }

    const strongContactMatch = reasons.includes("Telefone igual") || reasons.includes("Email igual");
    if (!strongContactMatch && score < 45) return null;
    return {
      passenger,
      score,
      reasons: Array.from(new Set(reasons)),
      candidateMissingContact
    };
  }

  function phoneNumbersMatch(left, right) {
    if (left === right) return true;
    const leftComparable = left.length >= 8 ? left.slice(-8) : left;
    const rightComparable = right.length >= 8 ? right.slice(-8) : right;
    return leftComparable.length >= 8 && leftComparable === rightComparable;
  }

  function phoneNumbersNearlyMatch(left, right) {
    const leftComparable = left.length >= 8 ? left.slice(-8) : left;
    const rightComparable = right.length >= 8 ? right.slice(-8) : right;
    if (leftComparable.length < 8 || rightComparable.length < 8 || leftComparable.length !== rightComparable.length) return false;
    return hammingDistance(leftComparable, rightComparable) === 1;
  }

  function emailsProbablySame(left, right) {
    const a = splitEmail(left);
    const b = splitEmail(right);
    if (!a.local || !b.local || !a.domain || !b.domain) return false;
    const sameLocal = stringSimilarity(a.local, b.local) >= 0.88;
    const sameDomain = stringSimilarity(a.domain, b.domain) >= 0.88;
    return sameLocal && sameDomain;
  }

  function splitEmail(value) {
    const parts = normalize(value).split("@");
    return {
      local: parts[0] || "",
      domain: parts[1] || ""
    };
  }

  function nameSimilarity(left, right) {
    const a = normalizeName(left);
    const b = normalizeName(right);
    if (!a || !b) return 0;
    if (a === b) return 1;
    const editScore = stringSimilarity(a, b);
    const aTokens = a.split(" ").filter(Boolean);
    const bTokens = b.split(" ").filter(Boolean);
    const aSet = new Set(aTokens);
    const bSet = new Set(bTokens);
    const overlap = [...aSet].filter((token) => bSet.has(token)).length;
    const exactTokenScore = overlap / Math.max(aSet.size, bSet.size, 1);
    const fuzzyTokenScore = tokenFuzzyNameScore(aTokens, bTokens);
    return Math.max(editScore, exactTokenScore, fuzzyTokenScore);
  }

  function normalizeName(value) {
    return normalize(value)
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\b(sr|sra|dr|dra|mr|mrs|ms)\b/g, " ")
      .replace(/\b(de|da|do|das|dos|e|y|the)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenFuzzyNameScore(leftTokens, rightTokens) {
    if (!leftTokens.length || !rightTokens.length) return 0;
    const usedRight = new Set();
    let total = 0;
    let strongMatches = 0;

    leftTokens.forEach((leftToken) => {
      let bestIndex = -1;
      let bestScore = 0;
      rightTokens.forEach((rightToken, index) => {
        if (usedRight.has(index)) return;
        const score = stringSimilarity(leftToken, rightToken);
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });
      if (bestIndex >= 0) usedRight.add(bestIndex);
      total += bestScore;
      if (bestScore >= 0.78) strongMatches += 1;
    });

    const size = Math.max(leftTokens.length, rightTokens.length, 1);
    const average = total / size;
    const coverage = strongMatches / size;
    return (average * 0.7) + (coverage * 0.3);
  }

  function stringSimilarity(left, right) {
    const a = String(left || "");
    const b = String(right || "");
    if (!a || !b) return 0;
    if (a === b) return 1;
    return 1 - (damerauLevenshteinDistance(a, b) / Math.max(a.length, b.length));
  }

  function hammingDistance(left, right) {
    if (left.length !== right.length) return Infinity;
    let distance = 0;
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) distance += 1;
    }
    return distance;
  }

  function damerauLevenshteinDistance(left, right) {
    const rows = left.length + 1;
    const cols = right.length + 1;
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
    for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

    for (let i = 1; i < rows; i += 1) {
      for (let j = 1; j < cols; j += 1) {
        const cost = left[i - 1] === right[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
        if (
          i > 1 &&
          j > 1 &&
          left[i - 1] === right[j - 2] &&
          left[i - 2] === right[j - 1]
        ) {
          matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
        }
      }
    }

    return matrix[left.length][right.length];
  }

  function levenshteinDistance(left, right) {
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 1; i <= left.length; i += 1) {
      let last = i - 1;
      previous[0] = i;
      for (let j = 1; j <= right.length; j += 1) {
        const current = previous[j];
        previous[j] = left[i - 1] === right[j - 1]
          ? last
          : Math.min(previous[j - 1], previous[j], last) + 1;
        last = current;
      }
    }
    return previous[right.length];
  }

  function openPassengerMatchReview(candidates) {
    if (!candidates.length || !el.passengerMatchOverlay || !el.passengerMatchList) {
      return Promise.resolve({ action: "continue" });
    }
    if (passengerMatchResolve) {
      passengerMatchResolve({ action: "cancel" });
      passengerMatchResolve = null;
    }
    passengerMatchCandidates = candidates;
    renderPassengerMatchList(candidates);
    el.passengerMatchOverlay.hidden = false;
    requestAnimationFrame(() => {
      el.passengerMatchOverlay.querySelector(".passenger-match-dialog")?.focus();
    });
    return new Promise((resolve) => {
      passengerMatchResolve = resolve;
    });
  }

  function renderPassengerMatchList(candidates) {
    el.passengerMatchList.innerHTML = "";
    if (el.passengerMatchSummary) {
      el.passengerMatchSummary.textContent = `${candidates.length} cadastro${candidates.length === 1 ? "" : "s"} parecido${candidates.length === 1 ? "" : "s"}.`;
    }
    const questionSearchKey = "Certeza que este nao e o passageiro desejado?";
    candidates.forEach((candidate, index) => {
      const passenger = candidate.passenger;
      const item = document.createElement("article");
      item.className = "passenger-match-item";
      item.dataset.questionKey = questionSearchKey;
      item.style.setProperty("--match-index", index);

      const main = document.createElement("div");
      main.className = "passenger-match-main";
      const reasonMap = getPassengerMatchReasonMap(candidate.reasons);

      const title = document.createElement("strong");
      title.append(document.createTextNode(passenger.label || "Passageiro sem nome"));
      if (reasonMap.has("nome")) {
        title.classList.add("is-match");
        const titleReason = document.createElement("span");
        titleReason.className = "passenger-match-field-reason";
        titleReason.textContent = reasonMap.get("nome");
        title.appendChild(titleReason);
      }

      const meta = document.createElement("div");
      meta.className = "passenger-match-meta";
      const details = [
        ["cliente", "Cliente", passenger.clienteLabel],
        ["telefone", "Telefone", passenger.telefone],
        ["email", "Email", passenger.email],
        ["cr", "CR", passenger.cr],
        ["departamento", "Departamento", passenger.departamento]
      ].filter(([, , value]) => Boolean(value));

      if (details.length) {
        details.forEach(([key, label, value]) => {
          const detail = document.createElement("span");
          detail.className = "passenger-match-detail";
          detail.classList.toggle("is-match", reasonMap.has(key));
          const detailLabel = document.createElement("small");
          detailLabel.textContent = label;
          const detailValue = document.createElement("b");
          detailValue.textContent = value;
          detailValue.title = value;
          detail.append(detailLabel, detailValue);
          if (reasonMap.has(key)) {
            const reason = document.createElement("span");
            reason.className = "passenger-match-field-reason";
            reason.textContent = reasonMap.get(key);
            detail.appendChild(reason);
          }
          meta.appendChild(detail);
        });
      } else {
        const emptyDetail = document.createElement("span");
        emptyDetail.className = "passenger-match-empty";
        emptyDetail.textContent = "Sem contato cadastrado";
        meta.appendChild(emptyDetail);
      }

      main.append(title, meta);
      item.append(main);
      el.passengerMatchList.appendChild(item);
    });
  }

  function getPassengerMatchReasonMap(reasons) {
    const fields = new Map();
    (reasons || []).forEach((reason) => {
      const text = normalize(reason);
      if (text.includes("nome")) fields.set("nome", reason);
      if (text.includes("telefone")) fields.set("telefone", reason);
      if (text.includes("email") || text.includes("e-mail")) fields.set("email", reason);
      if (text.includes("cliente")) fields.set("cliente", reason);
      if (text.includes("cr")) fields.set("cr", reason);
      if (text.includes("departamento")) fields.set("departamento", reason);
    });
    return fields;
  }

  async function ensureXlsxLibrary() {
    if (window.XLSX) return window.XLSX;
    if (xlsxLibraryLoadPromise) return xlsxLibraryLoadPromise;

    const source = document.getElementById(XLSX_SOURCE_ELEMENT_ID);
    const inlineSource = source?.textContent || "";
    if (inlineSource.trim()) {
      xlsxLibraryLoadPromise = new Promise((resolve, reject) => {
        try {
          const script = document.createElement("script");
          script.text = inlineSource;
          document.head.appendChild(script);
          if (window.XLSX) {
            resolve(window.XLSX);
          } else {
            reject(new Error("Biblioteca XLSX nao inicializou."));
          }
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        xlsxLibraryLoadPromise = null;
        throw error;
      });
      return xlsxLibraryLoadPromise;
    }

    xlsxLibraryLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "vendor/xlsx.full.min.js";
      script.async = true;
      script.onload = () => {
        if (window.XLSX) {
          resolve(window.XLSX);
        } else {
          reject(new Error("Biblioteca XLSX nao inicializou."));
        }
      };
      script.onerror = () => reject(new Error("Falha ao carregar vendor/xlsx.full.min.js."));
      document.head.appendChild(script);
    }).catch((error) => {
      xlsxLibraryLoadPromise = null;
      throw error;
    });
    return xlsxLibraryLoadPromise;
  }

  async function openXlsxImportPicker() {
    if (!window.XlsxImportCore) {
      toast("Leitor XLSX não carregado. Verifique os scripts do web resource.", "error", 8000);
      return;
    }
    if (!state.isNew) {
      toast("Importação XLSX só cria novos serviços. Abra uma tela nova para importar.", "warning", 6000);
      return;
    }
    if (state.isNew && hasPrimaryDraftChanges()) {
      toast("Finalize o agendamento principal antes de importar novos serviços.", "warning", 7000);
      return;
    }
    setLoading(true);
    try {
      await ensureXlsxLibrary();
      el.xlsxImportInput?.click();
    } catch (error) {
      console.error(error);
      toast(error.message || "Falha ao carregar leitor XLSX.", "error", 8000);
    } finally {
      setLoading(false);
    }
  }

  async function handleXlsxImportFile(event) {
    const file = event.target?.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      await ensureXlsxLibrary();
      const rows = await readXlsxPassengersRows(file);
      const review = await buildImportReview(rows, file.name);
      applyImportedExternalStatusRules(review);
      state.importReview = review;
      state.importReviewFilter = importReviewFilters().ALL;
      renderImportReview();
      renderTabBadges();
      setTab("import");
      notifyImportedAutoIgnoredExternalStatuses(review);
      notifyUnknownImportedExternalStatuses(review);
      requestAnimationFrame(() => document.getElementById("tab-panel-import")?.scrollIntoView({ block: "start" }));
    } catch (error) {
      console.error(error);
      toast(error.message || "Falha ao importar XLSX.", "error", 9000);
    } finally {
      event.target.value = "";
      setLoading(false);
    }
  }

  async function readXlsxPassengersRows(file) {
    if (!window.XLSX) throw new Error("Biblioteca XLSX não carregada.");
    const buffer = await file.arrayBuffer();
    const workbook = window.XLSX.read(buffer, { type: "array", cellDates: false });
    const sheetName = workbook.SheetNames.find((name) => normalize(name) === "passengers") || workbook.SheetNames[0];
    if (!sheetName) throw new Error("A planilha não contém abas.");
    const sheet = workbook.Sheets[sheetName];
    const rows = window.XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
    const headers = rows.length ? Object.keys(rows[0]) : [];
    const missing = window.XlsxImportCore.validateImportHeaders(headers);
    if (missing.length) {
      throw new Error(`Planilha fora do padrão. Colunas ausentes: ${missing.join(", ")}.`);
    }
    return rows;
  }

  async function buildImportReview(rows, fileName) {
    const normalizedRows = window.XlsxImportCore.normalizeImportedRows(rows);
    const programs = window.XlsxImportCore.buildImportPrograms(normalizedRows);
    await resolveImportedPassengerMatches(programs);
    await checkImportedProgramDuplicates(programs);
    return {
      fileName,
      rows: normalizedRows,
      programs,
      history: { undo: [], redo: [] },
      createdAt: new Date().toISOString()
    };
  }

  function cloneImportReviewValue(value) {
    return JSON.parse(JSON.stringify(value ?? null));
  }

  function importReviewHistory() {
    if (!state.importReview) return null;
    if (!state.importReview.history) {
      state.importReview.history = { undo: [], redo: [] };
    }
    if (!Array.isArray(state.importReview.history.undo)) state.importReview.history.undo = [];
    if (!Array.isArray(state.importReview.history.redo)) state.importReview.history.redo = [];
    return state.importReview.history;
  }

  function createImportReviewSnapshot() {
    const review = state.importReview;
    if (!review) return null;
    return {
      programs: cloneImportReviewValue(review.programs || []),
      selectedProgramacao: review.selectedProgramacao || "",
      selectedTrechoKey: review.selectedTrechoKey || "",
      editingTrechoKey: review.editingTrechoKey || "",
      filter: normalizeImportReviewFilter(state.importReviewFilter)
    };
  }

  function areImportReviewSnapshotsEqual(a, b) {
    return JSON.stringify(a || null) === JSON.stringify(b || null);
  }

  function captureImportReviewHistory(label = "Alteração") {
    if (!state.importReview || isRestoringImportHistory) return;
    captureGlobalHistoryBeforeMutation(label);
    window.setTimeout(() => commitGlobalHistoryChange(label), 0);
    const history = importReviewHistory();
    const snapshot = createImportReviewSnapshot();
    if (!history || !snapshot) return;
    const last = history.undo[history.undo.length - 1]?.snapshot;
    if (areImportReviewSnapshotsEqual(last, snapshot)) return;
    history.undo.push({ label, snapshot });
    if (history.undo.length > IMPORT_REVIEW_HISTORY_LIMIT) history.undo.shift();
    history.redo = [];
    renderGlobalImportHistoryControls();
  }

  function restoreImportReviewSnapshot(snapshot) {
    if (!state.importReview || !snapshot) return;
    state.importReview.programs = cloneImportReviewValue(snapshot.programs || []);
    state.importReview.selectedProgramacao = snapshot.selectedProgramacao || "";
    state.importReview.selectedTrechoKey = snapshot.selectedTrechoKey || "";
    state.importReview.editingTrechoKey = snapshot.editingTrechoKey || "";
    state.importReviewFilter = normalizeImportReviewFilter(snapshot.filter);
  }

  function closeImportedPassengerPopupWithoutSave() {
    if (!activeImportedPassengerEditRef) return;
    closeAllCustomSelects();
    if (el.passengerEditOverlay) el.passengerEditOverlay.hidden = true;
    if (el.passengerEditFields) el.passengerEditFields.replaceChildren();
    activeImportedPassengerEditRef = null;
    passengerEditEnabled = false;
    setPassengerEditStatus("", "");
  }

  function flushImportedPassengerEditBeforeHistory() {
    if (!activeImportedPassengerEditRef) return;
    flushPassengerEditSaves();
    closeImportedPassengerPopupWithoutSave();
  }

  function undoImportReviewChange() {
    if (!state.importReview) {
      toast("Sem histórico da importação para desfazer.", "warning", 2800);
      return false;
    }
    flushImportedPassengerEditBeforeHistory();
    const history = importReviewHistory();
    if (!history?.undo?.length) {
      toast("Nada para voltar na importação.", "warning", 3000);
      return false;
    }
    const current = createImportReviewSnapshot();
    const previous = history.undo.pop();
    if (current) history.redo.push({ label: previous.label, snapshot: current });
    isRestoringImportHistory = true;
    restoreImportReviewSnapshot(previous.snapshot);
    isRestoringImportHistory = false;
    showImportTabForHistoryFocus();
    renderImportReviewPreservingGallery();
    notifyImportHistoryToast("Voltou", previous, focusImportHistoryTarget(previous.snapshot));
    renderGlobalImportHistoryControls();
    return true;
  }

  function redoImportReviewChange() {
    if (!state.importReview) {
      toast("Sem histórico da importação para refazer.", "warning", 2800);
      return false;
    }
    flushImportedPassengerEditBeforeHistory();
    const history = importReviewHistory();
    if (!history?.redo?.length) {
      toast("Nada para avançar na importação.", "warning", 3000);
      return false;
    }
    const current = createImportReviewSnapshot();
    const next = history.redo.pop();
    if (current) history.undo.push({ label: next.label, snapshot: current });
    isRestoringImportHistory = true;
    restoreImportReviewSnapshot(next.snapshot);
    isRestoringImportHistory = false;
    showImportTabForHistoryFocus();
    renderImportReviewPreservingGallery();
    notifyImportHistoryToast("Avançou", next, focusImportHistoryTarget(next.snapshot));
    renderGlobalImportHistoryControls();
    return true;
  }

  function notifyImportHistoryToast(actionLabel, entry, focusLabel = "") {
    const label = String(entry?.label || "").trim();
    const focus = focusLabel ? ` Foco: ${focusLabel}.` : "";
    toast(label ? `${actionLabel}: ${label}.${focus}` : `${actionLabel} uma alteração.${focus}`, "success", 3200);
  }

  function showImportTabForHistoryFocus() {
    if (!state.importReview) return;
    state.currentTab = "import";
    el.tabs.forEach((button) => {
      const isActive = button.dataset.tab === "import";
      button.classList.toggle("is-active", isActive);
      button.toggleAttribute("aria-current", isActive);
    });
    el.panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === "import"));
  }

  function focusImportHistoryTarget(snapshot) {
    const programacao = snapshot?.selectedProgramacao || state.importReview?.selectedProgramacao || "";
    const trechoKey = snapshot?.selectedTrechoKey || state.importReview?.selectedTrechoKey || "";
    const trecho = findImportedTrecho(programacao, trechoKey);
    const focusLabel = importHistoryFocusLabel(programacao, trecho);
    window.requestAnimationFrame(() => {
      const target = findImportHistoryFocusElement(programacao, trechoKey);
      if (!target) return;
      if (!target.matches?.("button, input, select, textarea, [tabindex]")) target.tabIndex = -1;
      target.scrollIntoView?.({ block: "center", inline: "nearest" });
      target.focus?.({ preventScroll: true });
    });
    return focusLabel;
  }

  function importHistoryFocusLabel(programacao, trecho) {
    if (!programacao && !trecho) return "Importação";
    const when = trecho ? [formatDateInputForDisplay(trecho.dataIso), trecho.horario || "--:--"].filter(Boolean).join(" ") : "";
    return [programacao, when].filter(Boolean).join(" · ") || "Importação";
  }

  function findImportHistoryFocusElement(programacao, trechoKey) {
    if (!el.importReviewPrograms) return null;
    const programSelector = escapeAttributeSelectorValue(programacao);
    const trechoSelector = escapeAttributeSelectorValue(trechoKey);
    return el.importReviewPrograms.querySelector(
      `.import-service-row[data-programacao="${programSelector}"][data-trecho-key="${trechoSelector}"], ` +
      `.import-inspector [data-programacao="${programSelector}"][data-trecho-key="${trechoSelector}"], ` +
      ".import-inspector, .import-service-list"
    );
  }

  function escapeAttributeSelectorValue(value) {
    if (window.CSS?.escape) return window.CSS.escape(String(value || ""));
    return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\a ");
  }

  function isTextEditingTarget(target) {
    if (!target) return false;
    if (target.isContentEditable) return true;
    const tag = String(target.tagName || "").toUpperCase();
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    return false;
  }

  function shouldHandleImportHistoryShortcut(event) {
    if (event.altKey) return false;
    const key = String(event.key || "").toLowerCase();
    const command = event.ctrlKey || event.metaKey;
    const undo = command && key === "z" && !event.shiftKey;
    const redo = command && (key === "y" || (key === "z" && event.shiftKey));
    if (!undo && !redo) return false;
    if (isTextEditingTarget(event.target)) return false;
    return true;
  }

  function handleImportHistoryShortcut(event) {
    if (!shouldHandleImportHistoryShortcut(event)) return;
    const key = String(event.key || "").toLowerCase();
    const command = event.ctrlKey || event.metaKey;
    const undo = command && key === "z" && !event.shiftKey;
    const redo = command && (key === "y" || (key === "z" && event.shiftKey));
    if (!undo && !redo) return;
    event.preventDefault();
    if (undo) undoGlobalHistoryChange();
    if (redo) redoGlobalHistoryChange();
  }

  function importReviewStatuses() {
    return window.XlsxImportCore?.IMPORT_REVIEW_STATUSES || {
      PENDING: "pending",
      CONFIRMED: "confirmed",
      BLOCKED: "blocked",
      IGNORED: "ignored",
      SAVED: "saved"
    };
  }

  function importReviewFilters() {
    return {
      ALL: "all",
      VALIDATED: "validated",
      PENDING: "pending",
      IGNORED: "ignored"
    };
  }

  function normalizeImportReviewFilter(value) {
    const filters = importReviewFilters();
    return Object.values(filters).includes(value) ? value : filters.ALL;
  }

  function normalizeImportedReviewStatus(trecho) {
    const statuses = importReviewStatuses();
    if (trecho?.savedRecordId && trecho.reviewStatus !== statuses.IGNORED) return statuses.SAVED;
    return Object.values(statuses).includes(trecho?.reviewStatus) ? trecho.reviewStatus : statuses.PENDING;
  }

  function importedTrechoExternalStatuses(trecho) {
    const fromTrecho = Array.isArray(trecho?.statusExternos) ? trecho.statusExternos : [];
    const fromLines = Array.isArray(trecho?.linhasImportadas)
      ? trecho.linhasImportadas.map((line) => line?.statusExterno)
      : [];
    return Array.from(new Set([...fromTrecho, ...fromLines]
      .map((status) => String(status || "").trim())
      .filter(Boolean)));
  }

  function importedExternalStatusKey(status) {
    return normalize(status).replace(/\s+/g, " ");
  }

  function applyImportedExternalStatusRules(review) {
    const statuses = importReviewStatuses();
    const unknown = new Set();
    (review?.programs || []).forEach((program) => {
      (program.trechos || []).forEach((trecho) => {
        const externalStatuses = importedTrechoExternalStatuses(trecho);
        trecho.unknownStatusExternos = [];
        const shouldIgnore = externalStatuses.some((status) => IMPORT_XLSX_AUTO_IGNORE_STATUSES.has(importedExternalStatusKey(status)));
        if (shouldIgnore && normalizeImportedReviewStatus(trecho) !== statuses.SAVED) {
          trecho.reviewStatus = statuses.IGNORED;
          trecho.reviewBlockReason = "Ignorado automaticamente: status XLSX Aguardando prestador.";
          trecho.autoIgnoredByExternalStatus = true;
        }
        externalStatuses.forEach((status) => {
          const key = importedExternalStatusKey(status);
          if (!IMPORT_XLSX_STATUS_OPERATION_MAP[key] && !IMPORT_XLSX_AUTO_IGNORE_STATUSES.has(key)) {
            unknown.add(status);
            trecho.unknownStatusExternos.push(status);
          }
        });
      });
    });
    review.unknownStatusExternos = Array.from(unknown).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  function notifyImportedAutoIgnoredExternalStatuses(review) {
    const count = (review?.programs || []).reduce((total, program) => (
      total + (program.trechos || []).filter((trecho) => trecho.autoIgnoredByExternalStatus).length
    ), 0);
    if (!count) return;
    toast(`${count} serviço(s) com status XLSX Aguardando prestador foram ignorados automaticamente.`, "warning", 14000);
  }

  function notifyUnknownImportedExternalStatuses(review) {
    const unknown = review?.unknownStatusExternos || [];
    if (!unknown.length) return;
    toast(`Status XLSX desconhecido: ${unknown.join(", ")}. Fale com o Dev. Estes serviços serão assumidos como Confirmado.`, "warning", 14000);
  }

  function resolveImportedOperationStatusLabel(trecho) {
    const externalStatuses = importedTrechoExternalStatuses(trecho);
    for (const status of externalStatuses) {
      const key = importedExternalStatusKey(status);
      if (IMPORT_XLSX_STATUS_OPERATION_MAP[key]) return IMPORT_XLSX_STATUS_OPERATION_MAP[key];
    }
    return "Confirmado";
  }

  function markImportedReviewPending(trecho) {
    const statuses = importReviewStatuses();
    const status = normalizeImportedReviewStatus(trecho);
    if (status !== statuses.CONFIRMED && status !== statuses.BLOCKED && status !== statuses.SAVED) return;
    if (status === statuses.SAVED) trecho.savedRecordId = "";
    window.XlsxImportCore?.markImportedTrechoPending?.(trecho);
    if (!window.XlsxImportCore?.markImportedTrechoPending && trecho) {
      trecho.reviewStatus = statuses.PENDING;
      trecho.reviewBlockReason = "";
    }
  }

  function summarizeCurrentImportTrechos(trechos) {
    if (window.XlsxImportCore?.summarizeImportReviewTrechos) {
      return window.XlsxImportCore.summarizeImportReviewTrechos(trechos);
    }
    const statuses = importReviewStatuses();
    const counts = { pending: 0, confirmed: 0, blocked: 0, ignored: 0, saved: 0 };
    const saveableTrechos = [];
    (trechos || []).forEach((trecho) => {
      const status = normalizeImportedReviewStatus(trecho);
      counts[status] += 1;
      if (status === statuses.CONFIRMED) saveableTrechos.push(trecho);
    });
    const canScheduleConfirmed = saveableTrechos.length > 0 && counts.pending === 0 && counts.blocked === 0;
    return {
      counts,
      saveableTrechos,
      canScheduleConfirmed,
      blockedReason: canScheduleConfirmed ? "" : (counts.pending ? `${counts.pending} trecho(s) pendente(s) de revisão.` : "Nenhum trecho confirmado para agendar.")
    };
  }

  async function resolveImportedPassengerMatches(programs) {
    const cache = new Map();
    const importClient = getImportClient();
    for (const trecho of programs.flatMap((program) => program.trechos)) {
      for (const passenger of trecho.passageiros) {
        const key = normalize([
          passenger.nome,
          passenger.telefone,
          passenger.email,
          passenger.centroCusto,
          importClient?.id || ""
        ].filter(Boolean).join("|"));
        if (!cache.has(key)) {
          const candidate = importedPassengerCandidate(passenger, importClient);
          const matches = await findPassengerDuplicateCandidates(candidate);
          cache.set(key, matches);
        }
        const candidates = cache.get(key) || [];
        const selected = selectImportedExistingMatch(candidates, importClient);
        passenger.matchCandidates = candidates;
        if (!passenger.nome) {
          passenger.matchStatus = "invalid";
          passenger.matchMessage = "Nome vazio.";
        } else if (selected) {
          mergePassengerRecords([selected.passenger]);
          passenger.matchMessage = "Cadastro existente selecionado automaticamente.";
          applyExistingPassengerToImportedPassenger(passenger, selected.passenger, passenger.matchMessage);
        } else if (candidates.length) {
          passenger.matchStatus = "ambiguous";
          passenger.matchMessage = "Cadastro parecido encontrado.";
        } else {
          passenger.matchStatus = "create-new";
          passenger.matchMessage = "Será criado no Banco de Dados.";
        }
      }
    }
  }

  function importedPassengerCandidate(passenger, importClient = getImportClient()) {
    return {
      label: passenger.nome || "",
      telefone: passenger.telefone || "",
      email: passenger.email || "",
      cr: passenger.centroCusto || "",
      departamento: "",
      clienteId: importClient?.id || "",
      clienteLabel: importClient?.label || CONFIG.importDefaults.clienteLabel || ""
    };
  }

  function getImportClient() {
    const configuredId = cleanGuid(CONFIG.importDefaults.clienteId || "");
    const configuredLabel = CONFIG.importDefaults.clienteLabel || "Embraer";
    if (configuredId) {
      const existing = state.clientes.find((cliente) => sameId(cliente.id, configuredId));
      return {
        id: configuredId,
        label: existing?.label || configuredLabel
      };
    }
    const wanted = normalize(configuredLabel);
    return state.clientes.find((cliente) => normalize(cliente.label) === wanted)
      || state.clientes.find((cliente) => normalize(cliente.label).includes(wanted))
      || null;
  }

  function requireImportClient() {
    const importClient = getImportClient();
    if (!importClient?.id) {
      throw new Error("Cliente Embraer não encontrado. Configure CONFIG.importDefaults.clienteId com o GUID real do Dataverse.");
    }
    return importClient;
  }

  function selectImportedExistingMatch(candidates, importClient = getImportClient()) {
    return (candidates || []).find((candidate) => {
      const reasons = (candidate.reasons || []).map(normalize);
      const sameClient = importClient?.id && candidate.passenger?.clienteId && sameId(candidate.passenger.clienteId, importClient.id);
      if (importClient?.id && !sameClient) return false;
      const exactContact = reasons.includes("telefone igual") || reasons.includes("email igual");
      const exactName = reasons.includes("nome quase igual");
      const identicalNameWithoutImportedContact = candidate.candidateMissingContact && reasons.includes("nome igual");
      return sameClient && ((exactName && exactContact) || identicalNameWithoutImportedContact);
    }) || null;
  }

  async function checkImportedProgramDuplicates(programs) {
    const ids = Array.from(new Set((programs || []).map((program) => program.programacao).filter(Boolean)));
    const candidateMap = new Map();
    if (!ids.length) return candidateMap;
    const tenarisIdField = importedReservaTenarisIdField();

    if (!state.xrm || state.mockMode) {
      const db = getMockDb();
      ids.forEach((programacao) => {
        const rows = db.reservas
          .filter((item) => String(item[tenarisIdField] || item[CONFIG.fields.reserva.idExterno] || item.programacao || "") === programacao)
          .map(importedDuplicateCandidateFromReserva);
        if (rows.length) candidateMap.set(programacao, rows);
      });
    } else {
      const f = CONFIG.fields.reserva;
      for (let index = 0; index < ids.length; index += 15) {
        const batch = ids.slice(index, index + 15);
        const filter = batch.map((id) => `${tenarisIdField} eq '${escapeODataString(id)}'`).join(" or ");
        try {
          const select = [f.id, tenarisIdField, f.idExterno, f.dataSaida, f.trajeto, f.enderecoView, f.destino, f.paxView].join(",");
          const rows = await retrieveAll(CONFIG.entities.reserva, `?$select=${select}&$filter=${filter}`);
          rows.forEach((row) => {
            const key = row[tenarisIdField] || row[f.idExterno];
            if (!candidateMap.has(key)) candidateMap.set(key, []);
            candidateMap.get(key).push(importedDuplicateCandidateFromReserva(row));
          });
        } catch (error) {
          console.warn("Falha ao validar duplicidade de serviço importado", error);
          toast("Não consegui validar duplicidade dos serviços importados. Confirme os campos da reserva no Dataverse.", "warning", 9000);
          break;
        }
      }
    }

    programs.forEach((program) => {
      const candidates = candidateMap.get(program.programacao) || [];
      const exactIds = [];
      const hasAnyExistingServiceInPg = candidates.length > 0;
      program.trechos.forEach((trecho) => {
        const matches = candidates
          .map((candidate) => scoreImportedTrechoDuplicate(trecho, candidate))
          .filter((match) => match.level)
          .sort((a, b) => b.score - a.score);
        const exactMatches = matches.filter((match) => match.level === "exact");
        const possibleMatches = matches.filter((match) => match.level === "possible");
        const strongPossibleMatches = possibleMatches.filter(isStrongImportedPossibleDuplicateMatch);
        const weakPossibleMatches = possibleMatches.filter((match) => !isStrongImportedPossibleDuplicateMatch(match));
        const autoIgnoredMatches = hasAnyExistingServiceInPg
          ? [...candidates].map((candidate) => ({
            recordId: candidate.recordId || "",
            score: 999,
            level: "exact",
            reasons: ["mesma PG (ID Tenaris já existe no Dataverse)"]
          }))
          : [...exactMatches, ...strongPossibleMatches].sort((a, b) => b.score - a.score);
        trecho.duplicateMatches = autoIgnoredMatches;
        trecho.possibleDuplicateMatches = weakPossibleMatches;
        trecho.duplicatedRecordIds = autoIgnoredMatches.map((match) => match.recordId).filter(Boolean);
        exactIds.push(...trecho.duplicatedRecordIds);
        if (trecho.duplicatedRecordIds.length) {
          const statuses = importReviewStatuses();
          const status = normalizeImportedReviewStatus(trecho);
          if (status !== statuses.IGNORED && status !== statuses.SAVED) {
            trecho.reviewStatus = statuses.IGNORED;
            trecho.reviewBlockReason = hasAnyExistingServiceInPg
              ? "Serviço ignorado automaticamente: já existe serviço com esta PG (ID Tenaris) no Dataverse."
              : `Serviço repetido provável: ${formatImportedDuplicateMatch(exactMatches[0] || strongPossibleMatches[0])}.`;
            trecho.autoIgnoredByDuplicate = true;
          }
        } else {
          trecho.autoIgnoredByDuplicate = false;
        }
      });
      program.duplicatedRecordIds = Array.from(new Set(exactIds));
    });
    return candidateMap;
  }

  function importedDuplicateCandidateFromReserva(row) {
    const f = CONFIG.fields.reserva;
    const tenarisIdField = importedReservaTenarisIdField();
    return {
      recordId: cleanGuid(row?.[f.id] || row?.id || row?.recordId || ""),
      programacao: row?.[tenarisIdField] || row?.[f.idExterno] || row?.programacao || "",
      dataSaida: row?.[f.dataSaida] || row?.dataSaida || "",
      trajeto: row?.[f.trajeto] || row?.trajeto || "",
      enderecoView: row?.[f.enderecoView] || row?.enderecoView || "",
      destino: row?.[f.destino] || row?.destino || "",
      paxView: row?.[f.paxView] || row?.paxView || ""
    };
  }

  function scoreImportedTrechoDuplicate(trecho, candidate) {
    return window.XlsxImportCore?.scoreImportedTrechoDuplicate?.(trecho, candidate) || {
      recordId: candidate?.recordId || candidate?.id || "",
      score: 0,
      level: "",
      reasons: []
    };
  }

  function importedReservaTenarisIdField() {
    return CONFIG.fields.reserva.idExterno;
  }

  function isStrongImportedPossibleDuplicateMatch(match) {
    if (!match || match.level !== "possible") return false;
    const reasons = match.reasons || [];
    const hasTimeSignal = reasons.includes("mesmo horario") || reasons.includes("horario proximo");
    const hasPassengerSignal = reasons.includes("mesmos passageiros") || reasons.includes("passageiros parecidos");
    const hasRouteSignal = reasons.includes("mesmo destino")
      || reasons.includes("destino parecido")
      || reasons.includes("trajeto parecido")
      || reasons.includes("mesmo endereco de saida")
      || reasons.includes("endereco de saida parecido");
    return (match.score >= 62 && hasTimeSignal && hasPassengerSignal) || (hasTimeSignal && hasPassengerSignal && hasRouteSignal);
  }

  function renderImportReview() {
    renderGlobalImportHistoryControls();
    const review = state.importReview;
    const importedPrograms = review?.programs || [];
    const trechos = importedPrograms.flatMap((program) => program.trechos || []);
    const pendingPrograms = getImportProgramsForReview(importedPrograms);
    const pendingTrechos = pendingPrograms.flatMap((program) => program.trechos || []);
    const validatedTrechos = getValidatedImportTrechos(importedPrograms);
    const ignoredTrechos = getIgnoredImportTrechos(importedPrograms);
    const activeFilter = normalizeImportReviewFilter(state.importReviewFilter);
    state.importReviewFilter = activeFilter;
    const visiblePrograms = getImportProgramsByReviewFilter(importedPrograms, activeFilter);
    const reviewState = summarizeCurrentImportTrechos(trechos);
    const duplicatedTrechos = trechos.filter((trecho) => trecho.duplicatedRecordIds?.length);
    const hasImportedRows = Array.isArray(review?.rows) && review.rows.length > 0;
    const hasImportData = importedPrograms.length > 0 && hasImportedRows;
    if (!el.importReviewPrograms) return;

    if (!hasImportData) {
      if (el.importReviewEmpty) el.importReviewEmpty.hidden = false;
      if (el.importReviewSummary) el.importReviewSummary.textContent = "Importe um XLSX para revisar serviços por PG e trecho.";
      el.importReviewStats?.replaceChildren();
      el.importReviewIssues?.replaceChildren();
      if (el.importReviewIssues) el.importReviewIssues.hidden = true;
      el.importReviewPrograms.replaceChildren();
      return;
    }
    if (el.importReviewEmpty) el.importReviewEmpty.hidden = true;
    const importClient = getImportClient();
    const summary = [];

    if (hasImportData) {
      summary.push(`${review.rows.length} linha(s)`);
      summary.push(`${review.programs.length} PG(s)`);
      summary.push(`${trechos.length} trecho(s)`);
      summary.push(`${reviewState.counts.confirmed} confirmado(s)`);
      summary.push(`${reviewState.counts.pending} pendente(s)`);
      summary.push(`${reviewState.counts.blocked} bloqueado(s)`);
      summary.push(`${reviewState.counts.ignored} ignorado(s)`);
      summary.push(`Cliente: ${importClient?.label || CONFIG.importDefaults.clienteLabel}`);
      renderImportReviewFilters({
        all: trechos.length,
        validated: validatedTrechos.length,
        pending: pendingTrechos.length,
        ignored: ignoredTrechos.length
      }, activeFilter);
      renderImportGlobalIssues(trechos);
    } else {
      el.importReviewStats?.replaceChildren();
      el.importReviewIssues?.replaceChildren();
      if (el.importReviewIssues) el.importReviewIssues.hidden = true;
    }
    summary.push(`Arquivo: ${review.fileName}.`);
    if (duplicatedTrechos.length) summary.push(`${duplicatedTrechos.length} serviços repetidos.`);
    el.importReviewSummary.textContent = summary.join("  ");

    el.importReviewPrograms.replaceChildren();
    if (hasImportData) {
      el.importReviewPrograms.appendChild(buildImportWorkbench(visiblePrograms, {
        activeFilter
      }));
    }
    initializeImportReviewControls();
    syncDateTimeFieldRowWidths();
    syncImportedPassengerNameColumnWidths();
  }

  function initializeImportReviewControls() {
    el.importReviewPrograms?.querySelectorAll("select").forEach((select) => {
      ensureCustomSelect(select);
      refreshCustomSelect(select);
    });
  }

  function getImportProgramsByReviewFilter(programs, filter) {
    const filters = importReviewFilters();
    if (filter === filters.ALL) return sortImportProgramsByServiceDateTime(programs || []);
    if (filter === filters.PENDING) return getImportProgramsForReview(programs);
    return sortImportProgramsByServiceDateTime((programs || []).map((program) => {
      const trechos = (program.trechos || []).filter((trecho) => {
        const status = normalizeImportedReviewStatus(trecho);
        if (filter === filters.VALIDATED) return isValidatedImportedTrecho(trecho);
        if (filter === filters.IGNORED) return status === importReviewStatuses().IGNORED;
        return false;
      });
      return { ...program, trechos };
    }).filter((program) => program.trechos.length > 0));
  }

  function getImportProgramsForReview(programs) {
    const statuses = importReviewStatuses();
    return sortImportProgramsByServiceDateTime((programs || []).map((program) => {
      const trechos = (program.trechos || []).filter(
        (trecho) => {
          const status = normalizeImportedReviewStatus(trecho);
          return status !== statuses.CONFIRMED && status !== statuses.SAVED && status !== statuses.IGNORED;
        }
      );
      return {
        ...program,
        trechos
      };
    }).filter((program) => program.trechos.length > 0));
  }

  function sortImportProgramsByServiceDateTime(programs) {
    return [...(programs || [])]
      .map((program) => ({
        ...program,
        trechos: sortImportedTrechosByServiceDateTime(program?.trechos || [])
      }))
      .sort((a, b) => compareImportProgramsByFirstServiceDateTime(a, b));
  }

  function sortImportedTrechosByServiceDateTime(trechos) {
    return [...(trechos || [])].sort((a, b) => compareImportedTrechosByServiceDateTime(a, b));
  }

  function compareImportProgramsByFirstServiceDateTime(programA, programB) {
    const firstA = importProgramFirstServiceTimestamp(programA);
    const firstB = importProgramFirstServiceTimestamp(programB);
    if (firstA !== firstB) return firstA - firstB;
    return String(programA?.programacao || "").localeCompare(String(programB?.programacao || ""), "pt-BR");
  }

  function importProgramFirstServiceTimestamp(program) {
    const firstTrecho = sortImportedTrechosByServiceDateTime(program?.trechos || [])[0];
    return importedTrechoServiceTimestamp(firstTrecho);
  }

  function compareImportedTrechosByServiceDateTime(trechoA, trechoB) {
    const stampA = importedTrechoServiceTimestamp(trechoA);
    const stampB = importedTrechoServiceTimestamp(trechoB);
    if (stampA !== stampB) return stampA - stampB;
    return String(trechoA?.key || "").localeCompare(String(trechoB?.key || ""), "pt-BR");
  }

  function importedTrechoServiceTimestamp(trecho) {
    const localDateTime = importedTrechoDateTimeLocal(trecho);
    const parsed = parseDateTimeInputValue(localDateTime);
    if (parsed) return parsed.getTime();
    return Number.POSITIVE_INFINITY;
  }

  function isValidatedImportedTrecho(trecho) {
    const statuses = importReviewStatuses();
    const status = normalizeImportedReviewStatus(trecho);
    return status === statuses.CONFIRMED || status === statuses.SAVED;
  }

  function getValidatedImportTrechos(programs) {
    return (programs || []).flatMap((program) => (
      (program.trechos || [])
        .filter(isValidatedImportedTrecho)
        .map((trecho) => ({ program, trecho }))
    ));
  }

  function getIgnoredImportTrechos(programs) {
    const statuses = importReviewStatuses();
    return (programs || []).flatMap((program) => (
      (program.trechos || [])
        .filter((trecho) => normalizeImportedReviewStatus(trecho) === statuses.IGNORED)
        .map((trecho) => ({ program, trecho }))
    ));
  }

  function hasText(value) {
    if (typeof value === "boolean") return value;
    if (Array.isArray(value) || typeof value === "object") return false;
    return String(value ?? "").trim().length > 0;
  }

  function hasCommonDraftContent(snapshot) {
    if (!snapshot) return false;
    if (state.draftCommonEdited) return true;
    const fields = snapshot?.fields || {};
    const hasPassengers = (snapshot?.selectedPassengers || []).some((item) => item?.passageiro || item?.guid || hasText(item?.telefone) || hasText(item?.enderecoEditado));
    const hasAddressDraft = (snapshot?.enderecoRascunho || []).some((item) => hasText(item?.endereco));
    const hasLookupDraft = hasText(fields.cliente) || hasText(fields.solicitante) || hasText(fields.motorista);
    return hasPassengers || hasAddressDraft || hasLookupDraft || hasText(fields.trajeto) || hasText(fields.destino) || hasText(fields.observacao)
      || hasText(fields.tipoServico) || hasText(fields.tipoVeiculo) || hasText(fields.formaPagamento) || hasText(fields.cr) || hasText(fields.cotacao);
  }

  function renderImportReviewFilters(counts, activeFilter) {
    if (!el.importReviewStats) return;
    const filters = importReviewFilters();
    el.importReviewStats.replaceChildren(
      buildImportReviewFilterButton("Todos", filters.ALL, counts.all, activeFilter),
      buildImportReviewFilterButton("Validados", filters.VALIDATED, counts.validated, activeFilter),
      buildImportReviewFilterButton("Pendentes", filters.PENDING, counts.pending, activeFilter),
      buildImportReviewFilterButton("Ignorados", filters.IGNORED, counts.ignored, activeFilter)
    );
  }

  function renderGlobalImportHistoryControls() {
    if (!el.globalImportHistoryActions) return;
    const history = state.globalHistory;
    const buttons = [
      buildImportHistoryButton(
        "Desfazer",
        "undo",
        !(history?.undo?.length),
        "Ctrl+Z",
        history?.undo?.length ? "Desfazer última alteração do app (Ctrl+Z)" : "Nada para desfazer neste formulário"
      ),
      buildImportHistoryButton(
        "Refazer",
        "redo",
        !(history?.redo?.length),
        "Ctrl+Y / Ctrl+Shift+Z",
        history?.redo?.length ? "Refazer última alteração do app (Ctrl+Y ou Ctrl+Shift+Z)" : "Nada para refazer neste formulário"
      )
    ];
    if (state.isNew) {
      buttons.push(buildImportHistoryButton("Limpar", "clear", false, "", "Apagar todos os dados do formulário e recomeçar"));
    }
    el.globalImportHistoryActions.replaceChildren(...buttons);
  }

  function buildImportHistoryButton(label, action, disabled, shortcut, tooltip) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `import-history-button import-history-button--${action}`;
    button.dataset.importHistoryAction = action;
    button.disabled = !!disabled;
    button.title = tooltip || (shortcut ? `${label} (${shortcut})` : label);
    button.setAttribute("aria-label", tooltip || label);
    if (shortcut) button.setAttribute("aria-keyshortcuts", shortcut);
    button.innerHTML = `${importHistoryIconSvg(action)}<span class="import-history-label">${label}</span>${shortcut ? `<kbd class="import-history-shortcut">${shortcut}</kbd>` : ""}`;
    return button;
  }

  function importHistoryIconSvg(action) {
    const path = action === "undo"
      ? '<path d="M9 14 4 9l5-5"></path><path d="M4 9h10a6 6 0 0 1 0 12h-1"></path>'
      : action === "redo"
        ? '<path d="m15 14 5-5-5-5"></path><path d="M20 9H10a6 6 0 0 0 0 12h1"></path>'
        : '<path d="M9 6a3 3 0 0 1 6 0"></path><path d="M4 8h16"></path><path d="M7 11v6a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-6"></path>';
    return `<svg class="import-history-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${path}</svg>`;
  }

  async function clearAllFormsCompletely() {
    if (!state.isNew) {
      renderGlobalImportHistoryControls();
      toast("Limpar formulário só está disponível em novo serviço.", "warning", 5000);
      return;
    }
    const approved = await requestClearAllFormsConfirmation();
    if (!approved) return;
    setLoading(true);
    try {
      if (el.passengerPickerOverlay && !el.passengerPickerOverlay.hidden) {
        closePassengerPicker();
      }
      if (el.activationGuardOverlay && !el.activationGuardOverlay.hidden) {
        closeActivationGuard();
      }
      closeImportedPassengerPopupWithoutSave();
      closePassengerPreview();
      if (el.passengerMatchOverlay && !el.passengerMatchOverlay.hidden) {
        resolvePassengerMatchReview({ action: "cancel" });
      }
      state.pendingSaveContext = null;
      state.importReview = null;
      state.importReviewFilter = importReviewFilters().ALL;
      state.importDraftEditState = { common: false, retorno: false };
      state.activationDraftEditState = { return: false, repeat: false };
      state.activationGuardDrafts = [];
      state.scheduleDrafts = [];
      state.draftCommonEdited = false;
      state.record = null;
      state.relacoes = [];
      state.enderecoPersonalizadoAtivo = false;
      state.selectedPassengers = [emptyPassenger(1)];
      state.enderecoRascunho = [{ ordem: 1, endereco: "" }];
      state.obs = { motorista: "", interna: "", final: "", passageiro: "" };
      state.obsRet = { motorista: "", interna: "", final: "", passageiro: "" };
      state.obsAtual = "motorista";
      state.retObsAtual = "motorista";
      state.globalHistory = { undo: [], redo: [], pending: null };
      passengerMatchCandidates = [];
      if (el.xlsxImportInput) el.xlsxImportInput.value = "";
      clearSaveLog();
      clearDraftSnapshot(false);

      clearPassengerCreateForm();
      closePassengerPicker();
      closePassengerEditPopup();
      clearValidationStates();
      hydrateForm();
      setFieldValue(el.agendarRetorno, false);
      setFieldValue(el.repetirServico, false);
      setFieldValue(el.retornoData, "");
      setSelectValue(el.retornoHora, "");
      setSelectValue(el.retornoMinuto, "");
      setFieldValue(el.retornoEndereco, "");
      setFieldValue(el.retornoDestino, "");
      setFieldValue(el.retornoObservacao, "");
      setFieldValue(el.frequenteInicio, "");
      setFieldValue(el.frequenteFim, "");
      setSelectValue(el.frequenteTipo, "");
      setFieldValue(el.enderecoPersonalizado, "");
      setFieldValue(el.contabilizarFds, true);
      renderImportReview();
      renderGlobalImportHistoryControls();
      renderScheduleDrafts();
      renderPassengers();
      renderRiskPanel();
      renderTabBadges();
      setTab("details");
      renderDraftStatus("Formulário limpo.");
      toast("Dados removidos. Formulário reaberto do zero.", "success", 4500);
    } catch (error) {
      console.error(error);
      toast(error.message || "Falha ao limpar o formulário.", "error", 9000);
    } finally {
      setLoading(false);
    }
  }

  function requestClearAllFormsConfirmation() {
    if (!el.clearAllFormsOverlay || !el.clearAllFormsCancel || !el.clearAllFormsConfirm) return Promise.resolve(true);
    return new Promise((resolve) => {
      clearAllFormsConfirmationResolve = resolve;
      el.clearAllFormsOverlay.hidden = false;
      requestAnimationFrame(() => {
        el.clearAllFormsCancel?.focus();
      });
    });
  }

  function resolveClearAllFormsConfirmation(confirmed) {
    const resolve = clearAllFormsConfirmationResolve;
    clearAllFormsConfirmationResolve = null;
    if (el.clearAllFormsOverlay) el.clearAllFormsOverlay.hidden = true;
    resolve?.(!!confirmed);
  }

  function handleGlobalImportHistoryAction(event) {
    const button = event.target.closest("[data-import-history-action]");
    if (!button || !el.globalImportHistoryActions?.contains(button)) return;
    const action = button.dataset.importHistoryAction;
    if (action === "undo") return undoGlobalHistoryChange();
    if (action === "redo") return redoGlobalHistoryChange();
    if (action === "clear") return clearAllFormsCompletely();
  }

  function buildImportReviewFilterButton(label, filter, count, activeFilter) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "import-filter";
    button.classList.toggle("is-active", filter === activeFilter);
    button.dataset.importFilter = filter;
    button.setAttribute("aria-pressed", String(filter === activeFilter));
    const text = document.createElement("span");
    text.className = "import-filter-label";
    text.textContent = label;
    const value = document.createElement("span");
    value.className = "import-filter-count";
    value.textContent = String(count || 0);
    button.append(text, value);
    return button;
  }

  function renderImportGlobalIssues(trechos) {
    if (!el.importReviewIssues) return;
    const issues = [];
    if (!getImportClient()?.id) issues.push("Cliente Embraer não encontrado. Configure CONFIG.importDefaults.clienteId ou cadastre Embraer.");
    const duplicated = trechos.filter((trecho) => trecho.duplicatedRecordIds?.length);
    const possible = trechos.filter((trecho) => !trecho.duplicatedRecordIds?.length && trecho.possibleDuplicateMatches?.length);
    if (duplicated.length) issues.push(`${duplicated.length} serviço(s) repetido(s) por horário, trajeto, endereço, destino ou passageiros. Não edite nem salve por aqui.`);
    if (possible.length) issues.push(`${possible.length} serviço(s) parecido(s) com registros existentes. Revise antes de confirmar.`);
    const ambiguous = trechos.reduce((total, trecho) => total + trecho.passageiros.filter((pax) => pax.matchStatus === "ambiguous").length, 0);
    if (ambiguous) issues.push(`${ambiguous} passageiro(s) precisam de decisão de duplicidade.`);
    el.importReviewIssues.hidden = issues.length === 0;
    el.importReviewIssues.replaceChildren(...issues.map((issue) => {
      const item = document.createElement("p");
      item.textContent = issue;
      return item;
    }));
  }

  function ensureSelectedImportedTrecho(programs) {
    const trechos = (programs || []).flatMap((program) => (
      (program.trechos || []).map((trecho) => ({ program, trecho }))
    ));
    if (!trechos.length) return null;
    const currentProgram = state.importReview?.selectedProgramacao || "";
    const currentKey = state.importReview?.selectedTrechoKey || "";
    const selected = trechos.find((item) => item.program.programacao === currentProgram && item.trecho.key === currentKey)
      || trechos.find((item) => normalizeImportedReviewStatus(item.trecho) !== importReviewStatuses().IGNORED)
      || trechos[0];
    state.importReview.selectedProgramacao = selected.program.programacao;
    state.importReview.selectedTrechoKey = selected.trecho.key;
    return selected;
  }

  function importedTrechoEditKey(programacao, trechoKey) {
    return `${programacao || ""}||${trechoKey || ""}`;
  }

  function currentImportedTrechoEditKey() {
    return importedTrechoEditKey(state.importReview?.selectedProgramacao, state.importReview?.selectedTrechoKey);
  }

  function isImportedTrechoEditing(programacao, trechoKey) {
    return state.importReview?.editingTrechoKey === importedTrechoEditKey(programacao, trechoKey);
  }

  function setImportedTrechoEditMode(programacao, trechoKey, enabled) {
    if (!state.importReview) return;
    state.importReview.editingTrechoKey = enabled ? importedTrechoEditKey(programacao, trechoKey) : "";
  }

  function isSplitImportedTrecho(trecho) {
    return trecho?.originStatus === "Split" || trecho?.importOrigin === "split";
  }

  function isDraftImportedTrecho(trecho) {
    return isSplitImportedTrecho(trecho);
  }

  function importOperationalDecisions() {
    return window.XlsxImportCore?.IMPORT_OPERATIONAL_DECISIONS || {
      PENDING: "pending",
      KEEP_WAITING: "keep-waiting",
      SPLIT: "split",
      SPLIT_DRAFT: "split-draft",
      MANUAL_REVIEW: "manual-review"
    };
  }

  function importOperationalModes() {
    return window.XlsxImportCore?.IMPORT_OPERATIONAL_MODES || {
      SINGLE: "single",
      WAITING: "waiting",
      MULTI_PICKUP: "multi-pickup",
      INDEPENDENT_SERVICES: "independent-services",
      SEPARABLE: "separable",
      MANUAL_REVIEW: "manual-review",
      SPLIT_RETURN: "split-return"
    };
  }

  function applyImportedOperationalDecision(trecho, decision) {
    if (window.XlsxImportCore?.applyImportOperationalDecision) {
      return window.XlsxImportCore.applyImportOperationalDecision(trecho, decision);
    }
    const decisions = importOperationalDecisions();
    trecho.operationalDecision = decision;
    const decisionIssue = window.XlsxImportCore?.OPERATIONAL_DECISION_ISSUE || "Decidir se motorista fica a disposicao ou separar ida/busca.";
    trecho.pendencias = (trecho.pendencias || []).filter((issue) => issue !== decisionIssue);
    if (decision === decisions.MANUAL_REVIEW) trecho.pendencias.push(decisionIssue);
    markImportedReviewPending(trecho);
    return trecho;
  }

  function findImportProgram(programacao) {
    return state.importReview?.programs?.find((program) => program.programacao === programacao) || null;
  }

  function splitImportedTrechoForReview(programacao, trecho) {
    const program = findImportProgram(programacao);
    if (!program || !trecho) return null;
    const clone = window.XlsxImportCore?.splitImportedTrecho
      ? window.XlsxImportCore.splitImportedTrecho(program, trecho)
      : createLocalSplitImportedTrecho(program, trecho);
    if (!clone) return null;
    state.importReview.selectedProgramacao = program.programacao;
    state.importReview.selectedTrechoKey = clone.key;
    setImportedTrechoEditMode(program.programacao, clone.key, true);
    return clone;
  }

  function createLocalSplitImportedTrecho(program, source) {
    source.retornoPrevistoDataIso = "";
    source.retornoPrevistoHorario = "";
    applyImportedOperationalDecision(source, importOperationalDecisions().SPLIT);
    markImportedReviewPending(source);
    const key = nextSplitImportedTrechoKey(program);
    const clone = {
      key,
      programacao: program?.programacao || source?.programacao || "",
      solicitacoes: Array.from(new Set(source?.solicitacoes || [])),
      sourceRows: [],
      data: "",
      dataIso: "",
      horario: "",
      origem: "",
      destino: "",
      destinos: [],
      cidadeOrigem: "",
      cidadeDestino: "",
      solicitanteNome: source?.solicitanteNome || "",
      tipoServicoSugerido: source?.tipoServicoSugerido || "",
      tipoVeiculoSugerido: source?.tipoVeiculoSugerido || "",
      tipoServicoValue: source?.tipoServicoValue || "",
      tipoVeiculoValue: source?.tipoVeiculoValue || "",
      motoristaNome: "",
      retornoPrevistoDataIso: "",
      retornoPrevistoHorario: "",
      trajetoCidades: "",
      origemPrincipal: "",
      destinoPrincipal: "",
      linhasImportadas: [],
      passageiros: (source?.passageiros || []).map((passenger) => ({
        ...passenger,
        sourceRow: "",
        origem: "",
        destino: "",
        horario: ""
      })),
      observacoes: Array.from(new Set(source?.observacoes || [])),
      observacaoOperacional: source?.observacaoOperacional || "",
      observacoesFormulario: source?.observacoesFormulario ? { ...source.observacoesFormulario } : null,
      observacaoAtual: source?.observacaoAtual || "motorista",
      pendencias: [],
      reviewStatus: importReviewStatuses().PENDING,
      reviewBlockReason: "",
      savedRecordId: "",
      duplicatedRecordIds: [],
      importOrigin: "split",
      originStatus: "Split",
      operationalMode: "split-return",
      operationalDecision: importOperationalDecisions().SPLIT_DRAFT,
      operationalSuggestion: "Busca separada",
      operationalConfidence: "baixa",
      operationalReason: "Rascunho criado para completar a busca separada."
    };
    program.trechos.push(clone);
    program.pendencias = Array.from(new Set(program.trechos.flatMap((item) => item.pendencias || [])));
    return clone;
  }

  function nextSplitImportedTrechoKey(program) {
    const programacao = program?.programacao || "";
    const keys = new Set((program?.trechos || []).map((trecho) => String(trecho.key || "")));
    let sequence = 1;
    while (keys.has(`${programacao}|split|${sequence}`)) {
      sequence += 1;
    }
    return `${programacao}|split|${sequence}`;
  }

  function createImportPassengerDraft(trecho) {
    return {
      sourceRow: "",
      nome: "",
      telefone: "",
      email: "",
      documento: "",
      centroCusto: "",
      solicitanteNome: trecho?.solicitanteNome || "",
      horario: trecho?.horario || "",
      passageiroId: "",
      passageiroLabel: "",
      matchStatus: "create-new",
      matchCandidates: []
    };
  }

  function renderImportReviewPreservingGallery(scrollTop = null) {
    commitGlobalHistoryChange("Alterar importação");
    const list = el.importReviewPrograms?.querySelector(".import-service-list");
    const nextScrollTop = scrollTop ?? list?.scrollTop ?? 0;
    renderImportReview();
    requestAnimationFrame(() => {
      const nextList = el.importReviewPrograms?.querySelector(".import-service-list");
      if (nextList) nextList.scrollTop = nextScrollTop;
    });
  }

  function buildImportWorkbench(programs, options = {}) {
    const selected = ensureSelectedImportedTrecho(programs);
    const shell = document.createElement("div");
    shell.className = "import-workbench";

    const list = document.createElement("section");
    list.className = "import-service-list";
    list.setAttribute("aria-label", "Serviços importados");
    (programs || []).forEach((program) => {
      const group = document.createElement("article");
      group.className = "import-service-group";
      group.dataset.programacao = program.programacao;
      const title = document.createElement("div");
      title.className = "import-service-group-title";
      const titleText = document.createElement("div");
      titleText.className = "import-service-group-title-text";
      const strong = document.createElement("strong");
      strong.textContent = program.programacao;
      const meta = document.createElement("span");
      meta.textContent = `${program.trechos.length} serviço(s) · ${program.solicitacoes.join(", ") || "sem ST"}`;
      titleText.append(strong, meta);
      title.append(titleText);
      group.appendChild(title);
      program.trechos.forEach((trecho, index) => {
        const isSelected = selected?.program.programacao === program.programacao && selected?.trecho.key === trecho.key;
        group.appendChild(buildImportServiceListItem(program, trecho, index, isSelected));
      });
      list.appendChild(group);
    });
    if (!list.children.length) {
      list.appendChild(buildImportServiceListEmpty(options.activeFilter));
    }

    const inspector = document.createElement("aside");
    inspector.className = "import-inspector";
    inspector.setAttribute("aria-label", "Inspector do serviço importado");
    if (selected) {
      const isDuplicated = !!selected.trecho.duplicatedRecordIds?.length;
      const isSplit = isSplitImportedTrecho(selected.trecho);
      inspector.classList.toggle("is-duplicated", isDuplicated);
      const isEditing = !isDuplicated && isImportedTrechoEditing(selected.program.programacao, selected.trecho.key);
      const inspectorHead = document.createElement("div");
      inspectorHead.className = "import-inspector-head";
      const reviewStatus = normalizeImportedReviewStatus(selected.trecho);
      const statusMeta = importedTrechoReviewMeta(selected.trecho, importedTrechoIssues(selected.trecho));
      addClassIfPresent(inspector, `is-${reviewStatus || ""}`);
      const title = document.createElement("div");
      const eyebrow = document.createElement("span");
      const statusLabels = importReviewStatuses();
      const isAutoIgnoredDuplicate = isImportedDuplicateAutoIgnored(selected.trecho);
      eyebrow.textContent = isDuplicated
        ? isAutoIgnoredDuplicate
          ? "Duplicata ignorada automaticamente"
          : "Serviço bloqueado"
        : isSplit
          ? "Serviço Split"
          : isEditing
            ? "Edição habilitada"
            : reviewStatus === statusLabels.CONFIRMED
              ? "Serviço validado"
              : reviewStatus === statusLabels.SAVED
                ? "Serviço salvo"
                : reviewStatus === statusLabels.IGNORED
                  ? "Serviço ignorado"
                  : reviewStatus === statusLabels.BLOCKED
                    ? "Serviço bloqueado"
                    : "Conferência bloqueada";
      const strong = document.createElement("strong");
      strong.textContent = `${selected.program.programacao} · ${formatDateInputForDisplay(selected.trecho.dataIso)} ${selected.trecho.horario || "--:--"}`;
      title.append(eyebrow, strong);
      const statusBadge = document.createElement("span");
      statusBadge.className = `import-inspector-status import-badge ${isDuplicated ? "danger" : statusMeta.tone}`;
      statusBadge.textContent = isAutoIgnoredDuplicate ? "Duplicata automática" : isDuplicated ? "Bloqueado" : statusMeta.label;
      statusBadge.setAttribute("aria-label", `Status do serviço: ${statusBadge.textContent}`);
      title.appendChild(statusBadge);
      const actions = document.createElement("div");
      actions.className = "import-inspector-actions";
      if (isDuplicated) actions.classList.add("duplicado");
      const canEditSelectedTrecho = canEditImportedTrechoStatus(reviewStatus) && !isDuplicated;
      const editToggle = canEditSelectedTrecho
        ? buildImportEditToggle(selected.program.programacao, selected.trecho.key, isEditing, false)
        : null;
      const reviewActions = buildImportInspectorReviewActions(selected.program.programacao, selected.trecho.key, selected.trecho, normalizeImportedReviewStatus(selected.trecho), isDuplicated);
      actions.append(...[editToggle, ...reviewActions].filter(Boolean));
      inspectorHead.append(title, actions);
      inspector.append(inspectorHead, buildImportTrechoCard(selected.program, selected.trecho, selected.program.trechos.indexOf(selected.trecho), {
        editable: isEditing
      }));
    } else {
      const empty = document.createElement("div");
      empty.className = "import-inspector-empty";
      const strong = document.createElement("strong");
      strong.textContent = "Nenhum serviço neste filtro";
      const span = document.createElement("span");
      span.textContent = "Use Todos, Validados, Pendentes ou Ignorados para trocar a galeria.";
      empty.append(strong, span);
      inspector.appendChild(empty);
    }

    shell.append(list, inspector);
    return shell;
  }

  function canEditImportedTrechoStatus(reviewStatus) {
    const statuses = importReviewStatuses();
    return reviewStatus !== statuses.CONFIRMED
      && reviewStatus !== statuses.IGNORED
      && reviewStatus !== statuses.SAVED;
  }

  function buildImportServiceListEmpty(activeFilter) {
    const empty = document.createElement("div");
    empty.className = "import-service-list-empty";
    const strong = document.createElement("strong");
    strong.textContent = activeFilter === importReviewFilters().PENDING ? "Sem pendências" : "Nenhum item neste filtro";
    const span = document.createElement("span");
    span.textContent = "Use os filtros acima para trocar a visão da importação.";
    empty.append(strong, span);
    return empty;
  }

  function buildImportEditToggle(programacao, trechoKey, isEditing, disabled = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "icon-button passenger-edit-toggle import-edit-toggle";
    button.classList.toggle("is-active", !!isEditing);
    button.dataset.importAction = "toggle-edit";
    button.dataset.programacao = programacao;
    button.dataset.trechoKey = trechoKey;
    button.setAttribute("aria-pressed", String(!!isEditing));
    button.disabled = !!disabled;
    button.title = disabled ? "Serviço já existe no sistema. Edite pelo sistema." : "";
    button.setAttribute("aria-label", disabled ? "Serviço bloqueado por duplicidade" : isEditing ? "Bloquear edição do serviço" : "Habilitar edição do serviço");
    button.innerHTML = `
      <svg class="passenger-edit-icon-edit" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 16.5V20h3.5L18.06 9.44l-3.5-3.5L4 16.5Zm15.71-9.71a1 1 0 0 0 0-1.42l-1.08-1.08a1 1 0 0 0-1.42 0l-.86.86 3.5 3.5.86-.86Z"></path>
      </svg>
      <svg class="passenger-edit-icon-lock" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-7-2a2 2 0 0 1 4 0v2h-4V7Zm3 8.73V17h-2v-1.27a2 2 0 1 1 2 0Z"></path>
      </svg>
    `;
    return button;
  }

  function buildImportServiceListItem(program, trecho, index, isSelected) {
    const issues = importedTrechoIssues(trecho);
    const status = importedTrechoReviewMeta(trecho, issues);
    const isDuplicated = !!trecho.duplicatedRecordIds?.length;
    const isAutoIgnoredDuplicate = isImportedDuplicateAutoIgnored(trecho);
    const isSplit = isSplitImportedTrecho(trecho);
    const wrap = document.createElement("div");
    wrap.className = "import-service-row-wrap";
    wrap.dataset.programacao = program.programacao;
    wrap.dataset.trechoKey = trecho.key;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "import-service-row";
    button.classList.toggle("is-selected", !!isSelected);
    button.classList.toggle("is-duplicated", isDuplicated);
    button.classList.toggle("is-waiting", importedTrechoHasReturn(trecho) && !isDraftImportedTrecho(trecho));
    button.classList.toggle("is-split", isSplit);
    addClassIfPresent(button, `is-${normalizeImportedReviewStatus(trecho) || ""}`);
    button.dataset.importAction = "select-trecho";
    button.dataset.programacao = program.programacao;
    button.dataset.trechoKey = trecho.key;
    button.setAttribute("aria-current", isSelected ? "true" : "false");
    button.setAttribute("aria-label", `${isSelected ? "Selecionado. " : ""}${importedTrechoServiceListTimeLabel(trecho)}. Status: ${isAutoIgnoredDuplicate ? "Duplicata automática (ignorado automaticamente)" : isDuplicated ? "Não editar" : status.label}.`);

    const main = document.createElement("span");
    main.className = "import-service-main";
    const title = document.createElement("strong");
    title.textContent = importedTrechoServiceListTimeLabel(trecho);
    const meta = document.createElement("span");
    meta.textContent = composeImportTrajeto(trecho) || trecho.destino || "rota pendente";
    main.append(title, meta);

    const side = document.createElement("span");
    side.className = "import-service-side";
    const badge = document.createElement("span");
    badge.className = `import-badge ${isDuplicated ? "danger" : trecho.possibleDuplicateMatches?.length ? "warning" : status.tone}`;
    badge.textContent = isAutoIgnoredDuplicate
      ? "Duplicata automática"
      : isDuplicated
        ? "Não editar"
        : trecho.possibleDuplicateMatches?.length
          ? "Parecido"
          : status.label;
    side.append(badge);
    button.append(main, side);
    wrap.append(button);
    return wrap;
  }

  function buildImportProgramCard(program) {
    const card = document.createElement("article");
    card.className = "import-program";
    card.dataset.programacao = program.programacao;
    const head = document.createElement("header");
    head.className = "import-program-head";
    const title = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = program.programacao;
    const meta = document.createElement("span");
    meta.textContent = `${program.trechos.length} trecho(s) · ${program.solicitacoes.join(", ") || "sem ST"}`;
    title.append(strong, meta);
    const status = document.createElement("span");
    status.className = program.duplicatedRecordIds?.length ? "import-badge danger" : "import-badge";
    status.textContent = program.duplicatedRecordIds?.length ? "Serviço repetido" : "Novo";
    head.append(title, status);
    card.appendChild(head);
    program.trechos.forEach((trecho, index) => card.appendChild(buildImportTrechoCard(program, trecho, index)));
    return card;
  }

  function buildImportTrechoCard(program, trecho, index, options = {}) {
    const card = document.createElement("section");
    card.className = "import-trecho";
    card.classList.toggle("is-saved", !!trecho.savedRecordId);
    const isDuplicated = !!trecho.duplicatedRecordIds?.length;
    const reviewStatus = normalizeImportedReviewStatus(trecho);
    const isEditing = !!options.editable && !isDuplicated;
    addClassIfPresent(card, `is-${reviewStatus || ""}`);
    card.classList.toggle("is-duplicated", isDuplicated);
    card.classList.toggle("is-editing", isEditing);
    card.classList.toggle("is-locked", !isEditing);
    card.dataset.programacao = program.programacao;
    card.dataset.trechoKey = trecho.key;
    const issues = importedTrechoIssues(trecho);
    const displayIssues = importedTrechoDisplayIssues(trecho, issues);

    const head = document.createElement("header");
    head.className = "import-trecho-head";
    const title = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = `Serviço ${index + 1}`;
    const meta = document.createElement("span");
    meta.textContent = `${formatDateInputForDisplay(trecho.dataIso)} ${trecho.horario || "--:--"} · ${trecho.passageiros.length} passageiro(s)`;
    title.append(strong, meta);
    const badge = document.createElement("span");
    const reviewMeta = importedTrechoReviewMeta(trecho, issues);
    badge.className = `import-badge ${reviewMeta.tone}`;
    badge.textContent = reviewMeta.label;
    head.append(title, badge);

    const duplicateLock = buildImportDuplicateLockNotice(trecho);

    const fieldStack = document.createElement("div");
    fieldStack.className = "import-hot-grid import-editor-stack";
    fieldStack.append(
      buildImportInput("Data e hora", "dataHora", importedTrechoDateTimeLocal(trecho), "datetime-local"),
      buildImportInput("Horário previsto de retorno", "retornoPrevisto", importedTrechoReturnDateTimeLocal(trecho), "datetime-local"),
      buildImportSelect("Tipo do serviço", "tipoServicoValue", sortByLabel(state.options.tipoServico), trecho.tipoServicoValue || findOptionValue("tipoServico", trecho.tipoServicoSugerido)),
      buildImportSelect("Tipo do veículo", "tipoVeiculoValue", state.options.tipoVeiculo, trecho.tipoVeiculoValue || findOptionValue("tipoVeiculo", trecho.tipoVeiculoSugerido)),
      buildImportTextarea("Endereço de saída", "origem", trecho.origem),
      buildImportTextarea("Destino", "destino", trecho.destino),
      buildImportTextarea("Trajeto", "trajetoCidades", trecho.trajetoCidades || composeImportTrajeto(trecho)),
      buildImportObservationField(trecho)
    );

    const passengerList = document.createElement("div");
    passengerList.className = "import-passengers";
    const passengerHead = document.createElement("div");
    passengerHead.className = "import-passengers-head";
    const passengerTitle = document.createElement("strong");
    passengerTitle.textContent = "Passageiros";
    const isPassengerPickerOpen = !!trecho.passengerPickerOpen && isEditing;
    const addPassengerButton = buildImportAction("+", "add-import-passenger", !isEditing);
    addPassengerButton.className = "import-add-inline-button import-add-passenger-button";
    addPassengerButton.title = isEditing ? "Adicionar passageiro ao serviço" : "Habilite edição para adicionar passageiro.";
    addPassengerButton.setAttribute("aria-label", "Adicionar passageiro ao serviço");
    passengerHead.append(passengerTitle, addPassengerButton);
    passengerList.appendChild(passengerHead);
    if (isPassengerPickerOpen) {
      const picker = document.createElement("div");
      picker.className = "import-passenger-add-picker";
      picker.appendChild(buildImportPassengerAddSelect(trecho));
      passengerList.appendChild(picker);
    }
    if (!trecho.passageiros.length && !isPassengerPickerOpen) {
      const emptyPassenger = document.createElement("p");
      emptyPassenger.className = "import-passenger-empty";
      emptyPassenger.textContent = "Nenhum passageiro.";
      passengerList.appendChild(emptyPassenger);
    }
    trecho.passageiros.forEach((passenger, passengerIndex) => {
      passengerList.appendChild(buildImportPassengerRow(passenger, passengerIndex, {
        editable: isEditing
      }));
    });
    const solicitanteSection = buildImportSolicitanteSection(trecho, {
      editable: isEditing
    });
    passengerList.appendChild(solicitanteSection);

    const issueList = document.createElement("div");
    issueList.className = "import-trecho-issues";
    issueList.hidden = displayIssues.length === 0;
    issueList.replaceChildren(...displayIssues.map((issue) => {
      const item = document.createElement("span");
      item.textContent = issue;
      return item;
    }));

    const actions = document.createElement("footer");
    actions.className = "import-trecho-actions";
    if (reviewStatus === importReviewStatuses().SAVED) {
      actions.append(buildImportAction("Salvo", "noop", true));
    } else if (isDuplicated) {
      actions.append(buildImportAction("Bloqueado", "noop", true));
    }

    const blocks = [head];
    if (duplicateLock) blocks.push(duplicateLock);
    blocks.push(fieldStack, passengerList, issueList, actions);
    card.append(...blocks);
    setImportedTrechoControlsMode(card, isEditing);
    return card;
  }

  function buildImportInspectorReviewActions(programacao, trechoKey, trecho, reviewStatus, isDuplicated = false) {
    const statuses = importReviewStatuses();
    const attachContext = (button) => {
      button.classList.add("import-inspector-review-action");
      button.dataset.programacao = programacao;
      button.dataset.trechoKey = trechoKey;
      return button;
    };
    if (reviewStatus === statuses.SAVED) {
      return [attachContext(buildImportAction("Salvo", "noop", true))];
    }
    if (reviewStatus === statuses.IGNORED || reviewStatus === statuses.CONFIRMED) {
      return [attachContext(buildImportAction("Revisar", "review-pending"))];
    }
    const splitButton = canShowImportedSplitAction(trecho, reviewStatus, isDuplicated)
      ? attachContext(buildImportAction("Separar ida/busca", "split-trecho"))
      : null;
    if (splitButton) {
      splitButton.classList.add("secondary-action");
      splitButton.title = "Criar segunda OS rascunho na mesma PG.";
    }
    const validateButton = attachContext(buildImportAction("Validar", "confirm-review", !!isDuplicated));
    validateButton.title = isDuplicated ? "Serviço já existe no sistema. Validação bloqueada." : "Validar este serviço importado.";
    const ignoreButton = attachContext(buildImportAction("Ignorar", "ignore-trecho"));
    ignoreButton.title = "Ignorar este serviço na importação.";
    return [splitButton, validateButton, ignoreButton].filter(Boolean);
  }

  function canShowImportedSplitAction(trecho, reviewStatus = normalizeImportedReviewStatus(trecho), isDuplicated = false) {
    const statuses = importReviewStatuses();
    const modes = importOperationalModes();
    const decisions = importOperationalDecisions();
    const currentDecision = trecho.operationalDecision || "";
    return reviewStatus === statuses.PENDING
      && !isDuplicated
      && !isDraftImportedTrecho(trecho)
      && currentDecision !== decisions.SPLIT
      && currentDecision !== decisions.SPLIT_DRAFT
      && trecho?.operationalMode !== modes.MULTI_PICKUP
      && trecho?.operationalMode !== modes.INDEPENDENT_SERVICES
      && importedTrechoHasReturn(trecho);
  }

  function importedTrechoHasReturn(trecho) {
    return !!(trecho?.retornoPrevistoHorario || trecho?.retornoPrevistoDataIso);
  }

  function importedTrechoWindowLabel(trecho) {
    const saida = trecho?.horario || "--:--";
    const retorno = trecho?.retornoPrevistoHorario || "";
    if (retorno && retorno !== saida) return `${saida} → ${retorno}`;
    return saida;
  }

  function importedTrechoServiceListTimeLabel(trecho) {
    const date = formatDateInputForDisplay(trecho?.dataIso);
    const window = importedTrechoWindowLabel(trecho);
    return [date, window].filter(Boolean).join(" · ");
  }

  function importedTrechoReturnLabel(trecho) {
    if (!importedTrechoHasReturn(trecho)) return "Sem retorno previsto";
    return formatImportedTrechoDateTimeLabel(trecho?.retornoPrevistoDataIso || trecho?.dataIso, trecho?.retornoPrevistoHorario);
  }

  function formatImportedTrechoDateTimeLabel(dataIso, horario) {
    return `${formatDateInputForDisplay(dataIso)} ${horario || "--:--"}`.trim();
  }

  function importPassengerCountLabel(count) {
    const total = Number(count) || 0;
    return `${total} ${total === 1 ? "pax" : "pax"}`;
  }

  function buildImportDuplicateLockNotice(trecho) {
    if (!trecho.duplicatedRecordIds?.length) return null;
    const notice = document.createElement("div");
    notice.className = "import-duplicate-lock";
    notice.setAttribute("role", "alert");
    const strong = document.createElement("strong");
    strong.textContent = "Não edite este serviço";
    const span = document.createElement("span");
    span.textContent = `${formatImportedDuplicateMatch(trecho.duplicateMatches?.[0])}. Clique em qualquer campo para copiar a informação. Edite somente o registro original.`;
    notice.append(strong, span);
    return notice;
  }

  function setImportedTrechoControlsMode(card, isEditing) {
    card.querySelectorAll("[data-import-field], [data-import-passenger-field], [data-import-observation-text], [data-import-obs-type]").forEach((control) => {
      if (control.hasAttribute("data-import-obs-type")) {
        control.disabled = false;
        return;
      }
      if (control.hasAttribute("data-import-observation-text")) {
        const activeObsType = card.querySelector("[data-import-obs-type].is-active")?.dataset.importObsType || "motorista";
        control.readOnly = !isEditing || activeObsType === "motorista";
        return;
      }
      if (control.tagName === "SELECT" || control.tagName === "BUTTON") {
        control.disabled = !isEditing;
      } else {
        control.readOnly = !isEditing;
      }
    });
  }

  function importedTrechoReviewMeta(trecho, issues = []) {
    const statuses = importReviewStatuses();
    const status = normalizeImportedReviewStatus(trecho);
    if (isImportedDuplicateAutoIgnored(trecho)) return { label: "Duplicata automática", tone: "danger" };
    if (trecho.duplicatedRecordIds?.length) return { label: "Não editável", tone: "danger" };
    if (status === statuses.SAVED) return { label: "Salvo", tone: "success" };
    if (status === statuses.IGNORED) return { label: "Ignorado", tone: "danger" };
    if (status === statuses.CONFIRMED) return { label: "Confirmado", tone: "success" };
    if (status === statuses.BLOCKED) return { label: "Bloqueado", tone: "danger" };
    if (isSplitImportedTrecho(trecho)) return { label: "Split", tone: "manual" };
    if (issues.length) return { label: "Pendente", tone: "warning" };
    return { label: "Pendente", tone: "warning" };
  }

  function importedTrechoDisplayIssues(trecho, issues = []) {
    const statuses = importReviewStatuses();
    const status = normalizeImportedReviewStatus(trecho);
    const output = [...issues];
    if (trecho.duplicatedRecordIds?.length) {
      output.unshift(`Serviço repetido provável: ${formatImportedDuplicateMatch(trecho.duplicateMatches?.[0])}. Sem edição e sem salvamento pela importação.`);
    } else if (trecho.possibleDuplicateMatches?.length) {
      output.unshift(`Possível duplicidade: ${formatImportedDuplicateMatch(trecho.possibleDuplicateMatches[0])}. Revise antes de confirmar.`);
    }
    if (status === statuses.BLOCKED && trecho.reviewBlockReason) {
      output.unshift(`Bloqueado: ${trecho.reviewBlockReason}`);
    }
    return Array.from(new Set(output));
  }

  function isImportedDuplicateAutoIgnored(trecho) {
    return !!(trecho?.duplicatedRecordIds?.length
      && normalizeImportedReviewStatus(trecho) === importReviewStatuses().IGNORED
      && trecho?.autoIgnoredByDuplicate);
  }

  function formatImportedDuplicateMatch(match) {
    if (!match) return "Serviço repetido provável";
    const reasons = (match.reasons || []).filter(Boolean).slice(0, 4).join(", ");
    return reasons ? `Serviço repetido provável por ${reasons}` : "Serviço repetido provável";
  }

  function buildImportInput(label, field, value, type = "text", wide = false) {
    const wrap = document.createElement("label");
    const typeClass = String(type || "text").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    wrap.className = `field import-field is-${typeClass}${wide ? " span-2 is-wide" : ""}`;
    wrap.dataset.importInputType = type;
    wrap.dataset.importCopy = "1";
    wrap.dataset.copyLabel = label;
    const span = document.createElement("span");
    span.textContent = label;
    const input = document.createElement("input");
    input.type = type;
    if (type === "datetime-local") input.step = "300";
    input.value = value ?? "";
    input.dataset.importField = field;
    if (type === "number") input.step = "0.01";
    wrap.append(span, input);
    return wrap;
  }

  function buildImportTextarea(label, field, value, options = {}) {
    const wrap = document.createElement("label");
    wrap.className = "field import-field span-2 is-wide is-textarea";
    if (options.obs) wrap.classList.add("obs-field");
    wrap.dataset.importInputType = "textarea";
    wrap.dataset.importCopy = "1";
    wrap.dataset.copyLabel = label;
    const span = document.createElement("span");
    span.textContent = label;
    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    if (options.obs) {
      textarea.maxLength = 500;
      textarea.placeholder = "Ex.: preferir veículo com água, sem paradas, rota direta.";
    }
    textarea.value = value ?? "";
    textarea.dataset.importField = field;
    wrap.append(span, textarea);
    return wrap;
  }

  function buildImportObservationField(trecho) {
    const obs = ensureImportedObservationState(trecho);
    const current = obs.current || "motorista";
    const wrap = document.createElement("div");
    wrap.className = "field import-field span-2 is-wide is-textarea obs-field";
    wrap.dataset.importInputType = "textarea";
    wrap.dataset.importCopy = "1";
    wrap.dataset.copyLabel = "Observação";
    const span = document.createElement("span");
    span.textContent = "Observação operacional";
    const segmented = document.createElement("div");
    segmented.className = "segmented";
    segmented.setAttribute("role", "tablist");
    segmented.setAttribute("aria-label", "Tipo de observação importada");
    [
      ["motorista", "Mot"],
      ["interna", "Interna"],
      ["final", "Final"],
      ["passageiro", "Pref Pax"]
    ].forEach(([key, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `seg${current === key ? " is-active" : ""}`;
      button.dataset.importAction = "switch-import-obs";
      button.dataset.importObsType = key;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(current === key));
      button.textContent = label;
      segmented.appendChild(button);
    });
    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.maxLength = 500;
    textarea.placeholder = "Ex.: preferir veículo com água, sem paradas, rota direta.";
    textarea.value = obs[current] || "";
    textarea.dataset.importObservationText = "1";
    wrap.append(span, segmented, textarea);
    return wrap;
  }

  function ensureImportedObservationState(trecho) {
    const current = ["motorista", "interna", "final", "passageiro"].includes(trecho?.observacaoAtual)
      ? trecho.observacaoAtual
      : "motorista";
    const existing = trecho?.observacoesFormulario || {};
    const obs = {
      motorista: importedMotoristaObservationFromXlsx(trecho),
      interna: existing.interna ?? trecho?.observacaoInterna ?? importedDefaultInternalObservation(trecho),
      final: existing.final ?? trecho?.observacaoFinal ?? "",
      passageiro: existing.passageiro ?? trecho?.observacaoPassageiro ?? composeImportedTrechoPreferencias(trecho),
      current
    };
    if (!String(obs.passageiro || "").trim()) {
      obs.passageiro = composeImportedTrechoPreferencias(trecho);
    }
    if (trecho) {
      trecho.observacoesFormulario = obs;
      trecho.observacaoAtual = current;
      syncImportedObservationFields(trecho);
    }
    return obs;
  }

  function syncImportedObservationFields(trecho) {
    const obs = trecho?.observacoesFormulario || {};
    trecho.observacaoOperacional = importedMotoristaObservationFromXlsx(trecho);
    trecho.observacaoInterna = obs.interna || "";
    trecho.observacaoFinal = obs.final || "";
    trecho.observacaoPassageiro = obs.passageiro || "";
  }

  function importedMotoristaObservationFromXlsx(trecho) {
    if (!trecho) return "";
    if (!Object.prototype.hasOwnProperty.call(trecho, "observacaoOperacionalXlsx")) {
      trecho.observacaoOperacionalXlsx = trecho.observacaoOperacional || "";
    }
    return String(trecho.observacaoOperacionalXlsx || "");
  }

  function importedDefaultInternalObservation(trecho) {
    if (!trecho?.programacao) return "";
    if (isSplitImportedTrecho(trecho)) return `Serviço criado por Split na PG: ${trecho.programacao}.`;
    return `Importado via XLSX. PG: ${trecho.programacao}. ST: ${(trecho.solicitacoes || []).join(", ") || "-"}.`;
  }

  function composeImportedTrechoPreferencias(trecho) {
    return (trecho?.passageiros || [])
      .map((passenger) => {
        const record = importedResolvedPassenger(passenger);
        const preferencias = String(record?.preferencias || passenger?.preferencias || "").trim();
        if (!preferencias) return "";
        const label = normalizePassengerDisplayName(record?.label || passenger?.passageiroLabel || passenger?.nome) || "Passageiro";
        return `${firstName(label) || label} - ${preferencias}`;
      })
      .filter(Boolean)
      .join(";\n");
  }

  function buildImportSelect(label, field, options, value) {
    const wrap = document.createElement("label");
    wrap.className = "field required import-field is-select";
    wrap.dataset.importInputType = "select";
    wrap.dataset.importCopy = "1";
    wrap.dataset.copyLabel = label;
    const span = document.createElement("span");
    span.textContent = label;
    const select = document.createElement("select");
    select.required = true;
    select.setAttribute("aria-required", "true");
    select.dataset.importField = field;
    select.innerHTML = '<option value=""></option>';
    (options || []).forEach((optionRow) => {
      const option = document.createElement("option");
      option.value = String(optionRow.value);
      option.textContent = optionRow.label;
      select.appendChild(option);
    });
    select.value = value ? String(value) : "";
    wrap.append(span, select);
    return wrap;
  }

  function buildImportSolicitanteSection(trecho, options = {}) {
    const isEditable = !!options.editable;
    const rows = importedSolicitanteLookupRows(trecho);
    const selectedValue = resolveImportedSolicitanteSelectValue(trecho, rows);
    const selectedRow = rows.find((row) => String(row.id) === String(selectedValue)) || null;
    const isLinkedSolicitante = !!selectedValue && !isImportedSolicitanteTempId(selectedValue);
    const hasSolicitante = !!selectedValue && !!selectedRow;
    const isPickerOpen = !!trecho.solicitantePickerOpen && isEditable && !hasSolicitante;
    const statusLabel = importedSolicitanteStatusLabel(selectedValue, selectedRow);
    const displayName = normalizePassengerDisplayName(selectedRow?.label) || selectedRow?.label || "Solicitante";
    const section = document.createElement("section");
    section.className = "import-solicitante-section";
    section.setAttribute("aria-label", "Solicitante");

    const head = document.createElement("div");
    head.className = "import-passengers-head import-solicitante-head";
    const title = document.createElement("strong");
    title.textContent = "Solicitante";
    head.appendChild(title);
    if (!hasSolicitante && isEditable && !isPickerOpen) {
      const addButton = buildImportAction("+", "add-import-solicitante");
      addButton.className = "import-add-inline-button import-add-solicitante-button";
      addButton.title = "Adicionar solicitante ao serviço";
      addButton.setAttribute("aria-label", "Adicionar solicitante ao serviço");
      head.appendChild(addButton);
    }

    section.appendChild(head);

    if (!hasSolicitante && !isPickerOpen) {
      const empty = document.createElement("p");
      empty.className = "import-passenger-empty import-solicitante-empty";
      empty.textContent = "Sem solicitante.";
      section.appendChild(empty);
      return section;
    }

    if (isPickerOpen) {
      const picker = document.createElement("div");
      picker.className = "import-solicitante-picker";
      picker.appendChild(buildImportSolicitanteSelect(trecho, rows, ""));
      section.appendChild(picker);
      return section;
    }

    const row = document.createElement("div");
    row.className = `import-passenger import-solicitante-row import-passenger-row passenger-row is-${isLinkedSolicitante ? "use-existing" : "create-new"}`;
    row.classList.toggle("is-locked", !isEditable);
    row.setAttribute("aria-label", "Solicitante");
    row.dataset.importSolicitante = "1";

    const label = document.createElement("div");
    label.className = "row-label";
    const rowIndex = document.createElement("span");
    rowIndex.className = "row-index";
    rowIndex.textContent = "S";
    rowIndex.setAttribute("aria-hidden", "true");

    const titleWrap = document.createElement("span");
    titleWrap.className = "row-title-wrap";
    const rowTitle = document.createElement("button");
    rowTitle.type = "button";
    rowTitle.className = "row-title passenger-name-button import-passenger-name-button import-solicitante-name-button";
    rowTitle.dataset.importAction = "open-import-solicitante";
    rowTitle.textContent = displayName;
    rowTitle.title = isLinkedSolicitante ? "Editar cadastro do solicitante" : "Editar dados antes de salvar";
    rowTitle.setAttribute("aria-label", isLinkedSolicitante ? `Editar ${displayName}` : `Editar dados importados de ${displayName}`);
    const statusDot = document.createElement("span");
    statusDot.className = "import-passenger-status-dot import-solicitante-status-dot";
    statusDot.title = statusLabel;
    statusDot.setAttribute("aria-label", statusLabel);
    const rowPreview = document.createElement("div");
    rowPreview.className = "passenger-preview";
    rowPreview.setAttribute("role", "status");
    rowPreview.setAttribute("aria-live", "polite");
    rowPreview.setAttribute("aria-hidden", "true");
    renderPassengerPreview(rowPreview, importedSolicitantePreviewRecord(trecho, selectedValue, rows));
    titleWrap.append(rowTitle, statusDot, rowPreview);
    label.append(rowIndex, titleWrap);

    const control = document.createElement("div");
    control.className = "import-passenger-decision import-passenger-compact-actions import-solicitante-actions";
    const status = document.createElement("strong");
    status.textContent = statusLabel;
    control.appendChild(status);
    if (isEditable) {
      const removeButton = buildImportRemoveButton("remove-import-solicitante", "Remover solicitante");
      removeButton.classList.add("import-solicitante-remove");
      control.appendChild(removeButton);
    }
    row.append(label);
    if (control.querySelector("button")) row.append(control);
    section.appendChild(row);
    return section;
  }

  function buildImportSolicitanteSelect(trecho, lookupRows = null, selectedValue = null) {
    const wrap = document.createElement("label");
    wrap.className = "field required import-solicitante-field is-select";
    wrap.dataset.importInputType = "select";
    wrap.dataset.importCopy = "1";
    wrap.dataset.copyLabel = "Solicitante";
    const span = document.createElement("span");
    span.textContent = "Solicitante";
    const select = document.createElement("select");
    select.dataset.importField = "solicitanteRecordId";
    select.dataset.selectVariant = "person-client";
    select.dataset.placeholderLabel = "Selecionar solicitante";
    wrap.append(span, select);
    const rows = lookupRows || importedSolicitanteLookupRows(trecho);
    renderLookupSelect(select, rows);
    const resolvedValue = selectedValue ?? resolveImportedSolicitanteSelectValue(trecho, rows);
    setSelectValue(select, resolvedValue);
    return wrap;
  }

  function buildImportPassengerAddSelect(trecho, lookupRows = null) {
    const wrap = document.createElement("label");
    wrap.className = "field required import-solicitante-field import-passenger-add-field is-select";
    wrap.dataset.importInputType = "select";
    wrap.dataset.importCopy = "1";
    wrap.dataset.copyLabel = "Passageiro";
    const span = document.createElement("span");
    span.textContent = "Passageiro";
    const select = document.createElement("select");
    select.dataset.importField = "passengerRecordIdToAdd";
    select.dataset.selectVariant = "person-client";
    select.dataset.placeholderLabel = "Selecionar passageiro";
    wrap.append(span, select);
    const rows = lookupRows || importedSolicitanteLookupRows(trecho);
    renderLookupSelect(select, rows);
    setSelectValue(select, "");
    return wrap;
  }

  function importedTrechoHasSolicitante(trecho) {
    const rows = importedSolicitanteLookupRows(trecho);
    const selectedValue = resolveImportedSolicitanteSelectValue(trecho, rows);
    return !!selectedValue && rows.some((row) => String(row.id) === String(selectedValue));
  }

  function importedSolicitanteLookupRows(trecho) {
    const existingRows = sortByLabel(state.passageiros);
    const existingNames = new Set(existingRows.map((row) => normalize(row.label)).filter(Boolean));
    const importedRows = importedSolicitanteCandidateRows(trecho)
      .filter((row) => !existingNames.has(normalize(row.label)));
    return [...importedRows, ...existingRows];
  }

  function importedSolicitanteCandidateRows(trecho = null) {
    const candidates = new Map();
    const importClientLabel = getImportClient()?.label || CONFIG.importDefaults.clienteLabel || "Cliente da importação";
    const addCandidate = (person = {}, sourceLabel = "Pendente de cadastro no XLSX") => {
      const name = normalizePassengerDisplayName(person.nome || person.label || person.solicitanteNome);
      const key = normalize(name);
      if (!key || candidates.has(key)) return;
      candidates.set(key, {
        id: importedSolicitanteTempId(name),
        label: name,
        clienteLabel: person.clienteLabel || importClientLabel,
        search: [name, person.telefone, person.email, person.centroCusto, sourceLabel].filter(Boolean).join(" "),
        sourcePerson: {
          nome: name,
          telefone: person.telefone || "",
          email: person.email || "",
          centroCusto: person.centroCusto || importedTrechoCr(trecho) || ""
        }
      });
    };

    if (trecho?.removedSolicitanteNome) addCandidate({ nome: trecho.removedSolicitanteNome }, "Removido deste serviço");
    if (trecho?.solicitanteNome) addCandidate({ nome: trecho.solicitanteNome, centroCusto: importedTrechoCr(trecho) }, "Importado da planilha");

    const programs = state.importReview?.programs || [];
    programs.forEach((program) => {
      (program?.trechos || []).forEach((item) => {
        if (item?.solicitanteNome) {
          addCandidate({ nome: item.solicitanteNome, centroCusto: importedTrechoCr(item) }, "Solicitante do XLSX");
        }
        (item?.passageiros || []).forEach((passenger) => {
          if (passenger?.matchStatus === "use-existing" && passenger?.passageiroId) return;
          addCandidate(passenger, "Passageiro do XLSX");
        });
      });
    });

    return sortByLabel(Array.from(candidates.values()));
  }

  function resolveImportedSolicitanteSelectValue(trecho, rows) {
    if (trecho?.solicitanteRecordId) return trecho.solicitanteRecordId;
    const importedName = String(trecho?.solicitanteRecordLabel || trecho?.solicitanteNome || "").trim();
    if (!importedName) return "";
    const existing = resolvePassengerByName(importedName);
    if (existing) return existing.id;
    return rows.find((row) => row.id === importedSolicitanteTempId(importedName))?.id || "";
  }

  function importedSolicitanteTempId(name) {
    return `__imported_solicitante__:${normalize(name)}`;
  }

  function isImportedSolicitanteTempId(value) {
    return String(value || "").startsWith("__imported_solicitante__:");
  }

  function importedSolicitantePersonFromValue(value, rows = [], trecho = null) {
    const row = rows.find((item) => String(item.id) === String(value)) || null;
    if (!row) return null;
    if (!isImportedSolicitanteTempId(value)) {
      const existing = getPassengerById(value);
      return existing ? {
        id: existing.id,
        label: existing.label,
        nome: existing.label,
        telefone: existing.telefone || "",
        email: existing.email || "",
        centroCusto: existing.cr || ""
      } : null;
    }
    return {
      ...(row.sourcePerson || {}),
      nome: row.sourcePerson?.nome || row.label,
      label: row.label,
      centroCusto: row.sourcePerson?.centroCusto || importedTrechoCr(trecho) || ""
    };
  }

  function importedPersonNameKey(person = {}) {
    return normalize(normalizePassengerDisplayName(
      person.nome || person.label || person.passageiroLabel || person.solicitanteNome || ""
    ));
  }

  function importedPassengerIdentityKey(passenger = {}) {
    const id = cleanGuid(passenger.passageiroId || passenger.id || "");
    if (id) return `id:${id.toLowerCase()}`;
    const name = importedPersonNameKey(passenger);
    return name ? `name:${name}` : "";
  }

  function importedSolicitanteIdentityKey(trecho, selectedValue = null, rows = null) {
    const lookupRows = rows || importedSolicitanteLookupRows(trecho);
    const value = selectedValue ?? resolveImportedSolicitanteSelectValue(trecho, lookupRows);
    if (!value) return "";
    if (!isImportedSolicitanteTempId(value)) {
      const id = cleanGuid(value);
      return id ? `id:${id.toLowerCase()}` : "";
    }
    const row = lookupRows.find((item) => String(item.id) === String(value)) || null;
    const draft = trecho?.solicitantePessoaImportada || {};
    const name = importedPersonNameKey({
      nome: draft.nome || row?.sourcePerson?.nome || row?.label || trecho?.solicitanteRecordLabel || trecho?.solicitanteNome
    });
    return name ? `name:${name}` : "";
  }

  function importedPassengerMatchesIdentity(passenger, identity) {
    if (!passenger || !identity) return false;
    return importedPassengerIdentityKey(passenger) === identity
      || (identity.startsWith("name:") && `name:${importedPersonNameKey(passenger)}` === identity);
  }

  function importedPassengerDraftRecord(passenger = {}) {
    const nome = normalizePassengerDisplayName(passenger.nome || passenger.label || passenger.passageiroLabel);
    return {
      nome,
      label: nome,
      telefone: passenger.telefone || "",
      email: passenger.email || "",
      centroCusto: passenger.centroCusto || passenger.cr || ""
    };
  }

  function applyExistingPassengerToImportedPassenger(passenger, existing, message = "") {
    if (!passenger || !existing) return passenger;
    const label = normalizePassengerDisplayName(existing.label || passenger.passageiroLabel || passenger.nome);
    passenger.matchStatus = "use-existing";
    passenger.matchMessage = message || "Cadastro existente vinculado. Banco de Dados não será atualizado.";
    passenger.passageiroId = existing.id || passenger.passageiroId || "";
    passenger.passageiroLabel = label;
    passenger.nome = label;
    passenger.telefone = existing.telefone || "";
    passenger.email = existing.email || "";
    passenger.centroCusto = existing.cr || passenger.centroCusto || "";
    passenger.preferencias = existing.preferencias || "";
    return passenger;
  }

  function createImportPassengerFromSelectedPerson(trecho, value, rows = null) {
    const lookupRows = rows || importedSolicitanteLookupRows(trecho);
    const selected = importedSolicitantePersonFromValue(value, lookupRows, trecho);
    if (!selected) return null;
    const passenger = createImportPassengerDraft(trecho);
    const name = normalizePassengerDisplayName(selected.nome || selected.label);
    passenger.nome = name;
    passenger.telefone = selected.telefone || "";
    passenger.email = selected.email || "";
    passenger.centroCusto = selected.centroCusto || importedTrechoCr(trecho) || "";
    passenger.matchCandidates = [];
    if (!isImportedSolicitanteTempId(value)) {
      passenger.matchStatus = "use-existing";
      applyExistingPassengerToImportedPassenger(
        passenger,
        getPassengerById(selected.id || value) || {
          id: selected.id || value,
          label: selected.label || name,
          telefone: selected.telefone || "",
          email: selected.email || "",
          cr: selected.centroCusto || importedTrechoCr(trecho) || ""
        },
        "Cadastro existente vinculado. Banco de Dados não será atualizado."
      );
      return passenger;
    }
    passenger.matchStatus = "create-new";
    passenger.passageiroId = "";
    passenger.passageiroLabel = "";
    passenger.matchMessage = "Criar novo com nome, telefone, email, CR e cliente.";
    return passenger;
  }

  function linkedImportedPassengerForSolicitante(trecho, selectedValue = null, rows = null, identityOverride = "") {
    const identity = identityOverride || importedSolicitanteIdentityKey(trecho, selectedValue, rows);
    if (!identity) return null;
    return (trecho?.passageiros || []).find((passenger) => importedPassengerMatchesIdentity(passenger, identity)) || null;
  }

  function importedSolicitanteStatusLabel(value, row = null) {
    if (!value) return "Solicitante pendente";
    const label = normalizePassengerDisplayName(row?.label) || row?.label || "solicitante";
    return isImportedSolicitanteTempId(value)
      ? "Criar novo solicitante"
      : `Usar existente: ${label}`;
  }

  function importedSolicitanteEditableRecord(trecho, selectedValue = null, rows = null) {
    const lookupRows = rows || importedSolicitanteLookupRows(trecho);
    const value = selectedValue ?? resolveImportedSolicitanteSelectValue(trecho, lookupRows);
    const selected = importedSolicitantePersonFromValue(value, lookupRows, trecho) || {};
    const linkedPassenger = linkedImportedPassengerForSolicitante(trecho, value, lookupRows);
    const linked = linkedPassenger && (!value || isImportedSolicitanteTempId(value))
      ? importedPassengerDraftRecord(linkedPassenger)
      : {};
    const draft = trecho?.solicitantePessoaImportada || {};
    const nome = normalizePassengerDisplayName(
      linked.nome || draft.nome || selected.nome || selected.label || trecho?.solicitanteRecordLabel || trecho?.solicitanteNome
    );
    return {
      nome,
      label: nome,
      telefone: linked.telefone || draft.telefone || selected.telefone || "",
      email: linked.email || draft.email || selected.email || "",
      centroCusto: linked.centroCusto || draft.centroCusto || selected.centroCusto || importedTrechoCr(trecho) || ""
    };
  }

  function syncImportedSolicitanteDraft(trecho, draft, linkedPassenger = null) {
    if (!trecho) return;
    const nome = normalizePassengerDisplayName(draft?.nome || draft?.label);
    const linkedPassengerId = cleanGuid(linkedPassenger?.passageiroId || linkedPassenger?.id || "");
    if (linkedPassengerId) {
      trecho.solicitantePessoaImportada = null;
      trecho.solicitanteNome = nome || linkedPassenger?.passageiroLabel || linkedPassenger?.label || "";
      trecho.solicitanteRecordLabel = nome || linkedPassenger?.passageiroLabel || linkedPassenger?.label || "";
      trecho.solicitanteRecordId = linkedPassengerId;
      return;
    }
    trecho.solicitantePessoaImportada = {
      nome,
      telefone: draft?.telefone || "",
      email: draft?.email || "",
      centroCusto: draft?.centroCusto || importedTrechoCr(trecho) || ""
    };
    trecho.solicitanteNome = nome;
    trecho.solicitanteRecordLabel = nome;
    trecho.solicitanteRecordId = nome ? importedSolicitanteTempId(nome) : "";
  }

  function syncImportedSolicitanteFromPassenger(trecho, passenger, previousIdentity = "") {
    if (!trecho || !passenger) return false;
    const rows = importedSolicitanteLookupRows(trecho);
    const solicitanteIdentity = importedSolicitanteIdentityKey(trecho, null, rows);
    const matchesPrevious = previousIdentity && solicitanteIdentity === previousIdentity;
    const matchesCurrent = importedPassengerMatchesIdentity(passenger, solicitanteIdentity);
    if (!matchesPrevious && !matchesCurrent) return false;
    syncImportedSolicitanteDraft(trecho, importedPassengerDraftRecord(passenger), passenger);
    return true;
  }

  function syncImportedPassengerFromSolicitante(trecho, draft, previousIdentity = "") {
    if (!trecho || !draft) return false;
    const rows = importedSolicitanteLookupRows(trecho);
    const currentIdentity = importedSolicitanteIdentityKey(trecho, null, rows);
    const passenger = (trecho.passageiros || []).find((item) => (
      (previousIdentity && importedPassengerMatchesIdentity(item, previousIdentity))
      || importedPassengerMatchesIdentity(item, currentIdentity)
    ));
    if (!passenger) return false;
    passenger.nome = normalizePassengerDisplayName(draft.nome || draft.label);
    passenger.telefone = draft.telefone || "";
    passenger.email = draft.email || "";
    passenger.centroCusto = draft.centroCusto || importedTrechoCr(trecho) || "";
    passenger.passageiroId = "";
    passenger.passageiroLabel = "";
    passenger.matchCandidates = [];
    passenger.matchStatus = "create-new";
    passenger.matchMessage = "Dados revisados no mesmo registro do solicitante. Ao salvar, o sistema revalida duplicidade antes de criar.";
    return true;
  }

  function resolvePassengerByName(name) {
    const normalizedName = normalize(name);
    if (!normalizedName) return null;
    return state.passageiros.find((passenger) => normalize(passenger.label) === normalizedName) || null;
  }

  function buildImportPassengerRow(passenger, index, options = {}) {
    const isEditable = !!options.editable;
    const isExistingPassenger = !!cleanGuid(passenger.passageiroId || "");
    const displayName = normalizePassengerDisplayName(passenger.nome || passenger.passageiroLabel) || "Passageiro";
    const row = document.createElement("div");
    row.className = `import-passenger import-passenger-row passenger-row is-${passenger.matchStatus || "pending"}`;
    row.classList.toggle("is-locked", !isEditable);
    row.dataset.passengerIndex = String(index);

    const label = document.createElement("div");
    label.className = "row-label";
    const rowIndex = document.createElement("span");
    rowIndex.className = "row-index";
    rowIndex.textContent = String(index + 1).padStart(2, "0");
    rowIndex.setAttribute("aria-hidden", "true");
    const titleWrap = document.createElement("span");
    titleWrap.className = "row-title-wrap";
    const rowTitle = document.createElement("button");
    rowTitle.type = "button";
    rowTitle.className = "row-title passenger-name-button import-passenger-name-button";
    rowTitle.dataset.importAction = "open-import-passenger";
    rowTitle.textContent = displayName;
    rowTitle.title = isExistingPassenger ? "Editar cadastro do passageiro" : "Editar dados antes de salvar";
    rowTitle.setAttribute("aria-label", isExistingPassenger ? `Editar ${displayName}` : `Editar dados importados de ${displayName}`);
    const statusDot = document.createElement("span");
    statusDot.className = "import-passenger-status-dot";
    statusDot.title = importedPassengerStatusLabel(passenger);
    statusDot.setAttribute("aria-label", importedPassengerStatusLabel(passenger));
    const rowPreview = document.createElement("div");
    rowPreview.className = "passenger-preview";
    rowPreview.setAttribute("role", "status");
    rowPreview.setAttribute("aria-live", "polite");
    rowPreview.setAttribute("aria-hidden", "true");
    const compareRecord = importedPassengerExistingCompareRecord(passenger);
    if (compareRecord) {
      renderImportedPassengerComparisonPreview(rowPreview, passenger, compareRecord);
    } else {
      renderPassengerPreview(rowPreview, importedPassengerPreviewRecord(passenger));
    }
    titleWrap.append(rowTitle, statusDot, rowPreview);
    label.append(rowIndex, titleWrap);

    const decision = document.createElement("div");
    decision.className = "import-passenger-decision import-passenger-compact-actions";
    const status = document.createElement("strong");
    status.textContent = importedPassengerStatusLabel(passenger);
    decision.appendChild(status);
    if (isEditable) {
      const removeButton = buildImportRemoveButton("remove-import-passenger", `Remover ${displayName}`);
      removeButton.classList.add("import-passenger-remove");
      decision.appendChild(removeButton);
    }

    if (passenger.matchStatus === "ambiguous" && passenger.matchCandidates?.length) {
      passenger.matchCandidates.slice(0, 3).forEach((candidate) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "text-action import-candidate";
        button.dataset.importAction = "use-existing-passenger";
        button.dataset.passengerId = candidate.passenger.id;
        button.textContent = `É ${normalizePassengerDisplayName(candidate.passenger.label) || candidate.passenger.label}`;
        button.title = "Vincular ao cadastro existente, sem atualizar o Banco de Dados.";
        decision.appendChild(button);
      });
      const createButton = document.createElement("button");
      createButton.type = "button";
      createButton.className = "text-action danger";
      createButton.dataset.importAction = "create-new-passenger";
      createButton.textContent = "Novo";
      createButton.title = "Criar novo cadastro com nome, telefone, email, CR e cliente.";
      decision.appendChild(createButton);
    }

    row.append(label);
    if (decision.querySelector("button")) {
      row.append(decision);
    }
    return row;
  }

  function importedPassengerPreviewRecord(passenger) {
    const existing = importedResolvedPassenger(passenger);
    const importClient = getImportClient();
    return {
      ...(existing || {}),
      id: existing?.id || passenger.passageiroId || "",
      label: normalizePassengerDisplayName(existing?.label || passenger.passageiroLabel || passenger.nome) || "Passageiro",
      telefone: existing?.telefone || passenger.telefone || "",
      email: existing?.email || passenger.email || "",
      clienteLabel: existing?.clienteLabel || importClient?.label || CONFIG.importDefaults.clienteLabel || "",
      cargo: existing?.cargo || "",
      departamento: existing?.departamento || "",
      cr: passenger.centroCusto || existing?.cr || "",
      preferencias: existing?.preferencias || "",
      tipoVeiculoLabel: existing?.tipoVeiculoLabel || "",
      endereco: existing?.endereco || "",
      importStatus: importedPassengerStatusLabel(passenger),
      idioma: existing?.idioma || "",
      sexo: existing?.sexo || "",
      classificacao: existing?.classificacao || ""
    };
  }

  function buildImportAction(label, action, disabled = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = action === "save-trecho" || action === "confirm-review" ? "primary-action" : "secondary-action";
    button.dataset.importAction = action;
    button.textContent = label;
    button.disabled = !!disabled;
    return button;
  }

  function importedSolicitantePreviewRecord(trecho, selectedValue = null, rows = null) {
    const lookupRows = rows || importedSolicitanteLookupRows(trecho);
    const value = selectedValue ?? resolveImportedSolicitanteSelectValue(trecho, lookupRows);
    const existing = value && !isImportedSolicitanteTempId(value) ? getPassengerById(value) : null;
    const draft = importedSolicitanteEditableRecord(trecho, value, lookupRows);
    const importClient = getImportClient();
    return {
      ...(existing || {}),
      id: existing?.id || value || "",
      label: normalizePassengerDisplayName(existing?.label || draft.label || draft.nome) || "Solicitante",
      telefone: existing?.telefone || draft.telefone || "",
      email: existing?.email || draft.email || "",
      clienteLabel: existing?.clienteLabel || importClient?.label || CONFIG.importDefaults.clienteLabel || "",
      cargo: existing?.cargo || "",
      departamento: existing?.departamento || "",
      cr: draft.centroCusto || existing?.cr || "",
      preferencias: existing?.preferencias || "",
      tipoVeiculoLabel: existing?.tipoVeiculoLabel || "",
      endereco: existing?.endereco || "",
      importStatus: importedSolicitanteStatusLabel(value, lookupRows.find((row) => String(row.id) === String(value))),
      idioma: existing?.idioma || "",
      sexo: existing?.sexo || "",
      classificacao: existing?.classificacao || ""
    };
  }

  function importedPassengerExistingCompareRecord(passenger) {
    if (passenger.matchStatus !== "ambiguous") return null;
    return passenger.matchCandidates?.[0]?.passenger || null;
  }

  function buildImportRemoveButton(action, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "import-row-remove-button";
    button.dataset.importAction = action;
    button.title = label;
    button.setAttribute("aria-label", label);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("import-row-remove-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M7 7l10 10M17 7L7 17");
    svg.appendChild(path);
    button.appendChild(svg);
    return button;
  }

  function importedPassengerStatusLabel(passenger) {
    if (passenger.matchStatus === "use-existing") return `Usar existente: ${passenger.passageiroLabel}`;
    if (passenger.matchStatus === "create-new") return "Criar novo passageiro";
    if (passenger.matchStatus === "ambiguous") return "Confirmar se é o mesmo passageiro";
    if (passenger.matchStatus === "invalid") return passenger.matchMessage || "Inválido";
    return passenger.matchMessage || "Pendente";
  }

  function importedTrechoIssues(trecho) {
    const issues = [...(trecho?.pendencias || [])];
    if (!getImportClient()?.id) issues.push("Cliente Embraer ausente.");
    if (!trecho.dataIso) issues.push("Data inválida.");
    if (!trecho.horario) issues.push("Horário vazio.");
    if (!trecho.destino) issues.push("Destino vazio.");
    if (!resolveImportOption("tipoServico", trecho.tipoServicoValue, trecho.tipoServicoSugerido)) issues.push("Tipo de serviço sem mapeamento.");
    if (!resolveImportOption("tipoVeiculo", trecho.tipoVeiculoValue, trecho.tipoVeiculoSugerido)) issues.push("Tipo de veículo sem mapeamento.");
    if (!trecho.passageiros.length) issues.push("Nenhum passageiro informado.");
    trecho.passageiros.forEach((passenger) => {
      if (!String(passenger.nome || "").trim()) issues.push("Passageiro sem nome.");
      if (passenger.matchStatus === "ambiguous") issues.push(`Decidir passageiro: ${passenger.nome}.`);
      if (passenger.matchStatus === "invalid") issues.push(`Passageiro inválido na linha ${passenger.sourceRow}.`);
    });
    return Array.from(new Set(issues));
  }

  async function handleImportFieldCopy(event) {
    const copyTarget = event.target.closest("[data-import-copy]");
    if (!copyTarget || event.target.closest("[data-import-action]")) return;
    const trechoCard = copyTarget.closest(".import-trecho");
    if (!trechoCard || (!trechoCard.classList.contains("is-locked") && !trechoCard.classList.contains("is-duplicated"))) return;
    const control = copyTarget.querySelector("[data-import-field], [data-import-passenger-field], [data-import-observation-text]");
    const value = importCopyControlValue(control);
    if (!value) return;
    try {
      await copyTextToClipboard(value);
      showImportFieldCopyFeedback(copyTarget);
    } catch (error) {
      console.warn("Falha ao copiar campo importado", error);
      showImportFieldCopyFeedback(copyTarget, "Não copiou");
    }
  }

  function importCopyControlValue(control) {
    if (!control) return "";
    if (control.tagName === "SELECT") {
      return control.selectedOptions?.[0]?.textContent?.trim() || control.value || "";
    }
    return String(control.value || "").trim();
  }

  function showImportFieldCopyFeedback(target, message = "Copiado") {
    target.dataset.copyFeedback = message;
    target.classList.add("is-copied");
    window.clearTimeout(target._importCopyTimer);
    target._importCopyTimer = window.setTimeout(() => {
      target.classList.remove("is-copied");
      delete target.dataset.copyFeedback;
    }, 1100);
  }

  function handleImportReviewFilterAction(event) {
    const historyButton = event.target.closest("[data-import-history-action]");
    if (historyButton && state.importReview) {
      if (historyButton.dataset.importHistoryAction === "undo") undoImportReviewChange();
      if (historyButton.dataset.importHistoryAction === "redo") redoImportReviewChange();
      return;
    }
    const button = event.target.closest("[data-import-filter]");
    if (!button || !state.importReview) return;
    state.importReviewFilter = normalizeImportReviewFilter(button.dataset.importFilter);
    renderImportReviewPreservingGallery(0);
  }

  function handleImportReviewKeyboardNavigation(event) {
    if (!shouldHandleImportReviewKeyboardNavigation(event)) return;
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const rows = visibleImportServiceRows();
    if (!rows.length) return;
    const currentIndex = currentImportServiceRowIndex(rows, event.target);
    const nextIndex = Math.max(0, Math.min(rows.length - 1, currentIndex + direction));
    if (nextIndex === currentIndex) return;
    const nextRow = rows[nextIndex];
    event.preventDefault();
    selectImportedTrechoFromKeyboard(nextRow);
  }

  function shouldHandleImportReviewKeyboardNavigation(event) {
    if (!state.importReview) return false;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return false;
    if (isTextEditingTarget(event.target)) return false;
    return !!event.target.closest("#importReviewPrograms");
  }

  function visibleImportServiceRows() {
    return [...(el.importReviewPrograms?.querySelectorAll(".import-service-row[data-programacao][data-trecho-key]") || [])];
  }

  function currentImportServiceRowIndex(rows, target) {
    const focusedRow = target?.closest?.(".import-service-row[data-programacao][data-trecho-key]");
    if (focusedRow) {
      const focusedIndex = rows.indexOf(focusedRow);
      if (focusedIndex >= 0) return focusedIndex;
    }
    const currentProgramacao = state.importReview?.selectedProgramacao || "";
    const currentTrechoKey = state.importReview?.selectedTrechoKey || "";
    const selectedIndex = rows.findIndex((row) => (
      row.dataset.programacao === currentProgramacao && row.dataset.trechoKey === currentTrechoKey
    ));
    return selectedIndex >= 0 ? selectedIndex : 0;
  }

  function selectImportedTrechoFromKeyboard(row) {
    if (!row || !state.importReview) return;
    const programacao = row.dataset.programacao || "";
    const trechoKey = row.dataset.trechoKey || "";
    const listScrollTop = row.closest(".import-service-list")?.scrollTop ?? 0;
    state.importReview.selectedProgramacao = programacao;
    state.importReview.selectedTrechoKey = trechoKey;
    renderImportReviewPreservingGallery(listScrollTop);
    requestAnimationFrame(() => {
      focusImportedServiceRow(programacao, trechoKey);
    });
  }

  function focusImportedServiceRow(programacao, trechoKey) {
    const programSelector = escapeAttributeSelectorValue(programacao);
    const trechoSelector = escapeAttributeSelectorValue(trechoKey);
    const row = el.importReviewPrograms?.querySelector(
      `.import-service-row[data-programacao="${programSelector}"][data-trecho-key="${trechoSelector}"]`
    );
    if (!row) return;
    row.focus({ preventScroll: true });
    row.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function handleImportReviewAction(event) {
    const action = event.target.closest("[data-import-action]");
    if (!action) return;
    const trechoCard = action.closest("[data-trecho-key]");
    const passengerRow = action.closest("[data-passenger-index]");
    const trecho = trechoCard ? findImportedTrecho(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey) : null;
    if (!trecho) return;

    if (action.dataset.importAction === "switch-import-obs") {
      const next = action.dataset.importObsType || "motorista";
      const obs = ensureImportedObservationState(trecho);
      const textarea = trechoCard.querySelector("[data-import-observation-text]");
      obs[obs.current || "motorista"] = textarea?.value || "";
      obs.current = next;
      trecho.observacaoAtual = next;
      syncImportedObservationFields(trecho);
      trechoCard.querySelectorAll("[data-import-obs-type]").forEach((button) => {
        const isActive = button.dataset.importObsType === next;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      });
      if (textarea) {
        textarea.value = obs[next] || "";
        textarea.readOnly = !isImportedTrechoEditing(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey) || next === "motorista";
        requestAnimationFrame(() => {
          textarea.focus();
          textarea.setSelectionRange?.(textarea.value.length, textarea.value.length);
        });
      }
      return;
    }
    if (action.dataset.importAction === "noop") {
      return;
    }
    if (action.dataset.importAction === "select-trecho") {
      const listScrollTop = action.closest(".import-service-list")?.scrollTop ?? 0;
      state.importReview.selectedProgramacao = trechoCard.dataset.programacao;
      state.importReview.selectedTrechoKey = trechoCard.dataset.trechoKey;
      setImportedTrechoEditMode(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey, isDraftImportedTrecho(trecho));
      renderImportReviewPreservingGallery(listScrollTop);
      return;
    }
    if (action.dataset.importAction === "toggle-edit") {
      if (trecho.duplicatedRecordIds?.length) {
        toast("Serviço já existe no sistema. Edite pelo sistema.", "warning", 6000);
        return;
      }
      const programacao = trechoCard.dataset.programacao;
      const trechoKey = trechoCard.dataset.trechoKey;
      const enable = !isImportedTrechoEditing(programacao, trechoKey);
      setImportedTrechoEditMode(programacao, trechoKey, enable);
      renderImportReviewPreservingGallery();
      if (enable) {
        requestAnimationFrame(() => {
          el.importReviewPrograms?.querySelector(".import-inspector [data-import-field], .import-inspector [data-import-passenger-field], .import-inspector [data-import-observation-text]")?.focus();
        });
      }
      return;
    }
    if (action.dataset.importAction === "split-trecho") {
      if (normalizeImportedReviewStatus(trecho) !== importReviewStatuses().PENDING) {
        toast("Separar ida/busca só é permitido enquanto o serviço está pendente.", "warning", 5000);
        return;
      }
      if (!canShowImportedSplitAction(trecho, normalizeImportedReviewStatus(trecho), !!trecho.duplicatedRecordIds?.length)) {
        toast("Separar ida/busca indisponível para este serviço.", "warning", 5000);
        return;
      }
      if (trecho.duplicatedRecordIds?.length) {
        toast("Serviço já existe no sistema. Edite pelo sistema.", "warning", 6000);
        return;
      }
      if (isDraftImportedTrecho(trecho)) {
        toast("Split disponível apenas no serviço importado original.", "warning", 5000);
        return;
      }
      const modes = importOperationalModes();
      const cannotSplitInterpretedPg = trecho.operationalMode === modes.MULTI_PICKUP
        || trecho.operationalMode === modes.INDEPENDENT_SERVICES
        || !importedTrechoHasReturn(trecho);
      if (cannotSplitInterpretedPg) {
        toast("Split indisponível para esta interpretação da PG.", "warning", 5000);
        return;
      }
      const listScrollTop = el.importReviewPrograms?.querySelector(".import-service-list")?.scrollTop ?? 0;
      captureImportReviewHistory("Separar ida/busca");
      const clone = splitImportedTrechoForReview(trechoCard.dataset.programacao, trecho);
      renderImportReviewPreservingGallery(listScrollTop);
      requestAnimationFrame(() => {
        el.importReviewPrograms?.querySelector(".import-inspector [data-import-field]")?.focus();
      });
      toast(clone ? "Busca separada criada. Revise os dados pré-preenchidos." : "Não consegui criar Split.", clone ? "success" : "error", 6000);
      return;
    }
    if (action.dataset.importAction === "confirm-review") {
      if (trecho.duplicatedRecordIds?.length) {
        toast("Serviço já existe no sistema. Para editar, acesse o serviço no sistema.", "warning", 7000);
        return;
      }
      const issues = importedTrechoIssues(trecho);
      captureImportReviewHistory("Validar serviço");
      window.XlsxImportCore?.confirmImportedTrechoReview?.(trecho, issues);
      if (!window.XlsxImportCore?.confirmImportedTrechoReview) {
        const statuses = importReviewStatuses();
        trecho.reviewStatus = issues.length ? statuses.BLOCKED : statuses.CONFIRMED;
        trecho.reviewBlockReason = issues[0] || "";
      }
      if (issues.length) {
        toast(`Não validado: ${issues[0]}`, "error", 8000);
      } else {
        toast("Serviço validado. Ele será incluído ao salvar a importação.", "success", 4500);
      }
      setImportedTrechoEditMode(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey, false);
      renderImportReviewPreservingGallery();
      return;
    }
    if (action.dataset.importAction === "ignore-trecho") {
      captureImportReviewHistory("Ignorar serviço");
      window.XlsxImportCore?.ignoreImportedTrechoReview?.(trecho);
      if (!window.XlsxImportCore?.ignoreImportedTrechoReview) {
        trecho.reviewStatus = importReviewStatuses().IGNORED;
        trecho.reviewBlockReason = "";
        trecho.autoIgnoredByDuplicate = false;
      }
      setImportedTrechoEditMode(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey, false);
      renderImportReviewPreservingGallery();
      toast("Serviço ignorado. Ele não será salvo nesta importação.", "error", 4500);
      return;
    }
    if (action.dataset.importAction === "review-pending") {
      captureImportReviewHistory("Revisar novamente");
      window.XlsxImportCore?.markImportedTrechoPending?.(trecho);
      if (!window.XlsxImportCore?.markImportedTrechoPending) {
        trecho.reviewStatus = importReviewStatuses().PENDING;
        trecho.reviewBlockReason = "";
        trecho.autoIgnoredByDuplicate = false;
      }
      state.importReview.selectedProgramacao = trechoCard.dataset.programacao;
      state.importReview.selectedTrechoKey = trechoCard.dataset.trechoKey;
      setImportedTrechoEditMode(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey, false);
      renderImportReviewPreservingGallery();
      return;
    }
    if (action.dataset.importAction === "save-trecho") {
      saveImportedTrecho(trecho);
      return;
    }
    if (action.dataset.importAction === "add-import-passenger") {
      if (!isImportedTrechoEditing(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey)) {
        toast("Habilite a edição pelo ícone de lápis antes de alterar o serviço.", "warning", 5000);
        return;
      }
      trecho.solicitantePickerOpen = false;
      trecho.passengerPickerOpen = true;
      renderImportReviewPreservingGallery();
      return;
    }
    if (action.dataset.importAction === "add-import-solicitante") {
      if (!isImportedTrechoEditing(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey)) {
        toast("Habilite a edição pelo ícone de lápis antes de alterar o serviço.", "warning", 5000);
        return;
      }
      trecho.passengerPickerOpen = false;
      trecho.solicitantePickerOpen = true;
      renderImportReviewPreservingGallery();
      return;
    }
    if (action.dataset.importAction === "open-import-solicitante") {
      openImportedSolicitanteEdit(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey);
      return;
    }
    if (action.dataset.importAction === "remove-import-solicitante") {
      if (!isImportedTrechoEditing(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey)) {
        toast("Habilite a edição pelo ícone de lápis antes de alterar o serviço.", "warning", 5000);
        return;
      }
      captureImportReviewHistory("Remover solicitante");
      markImportedReviewPending(trecho);
      trecho.removedSolicitanteNome = trecho.solicitanteRecordLabel || trecho.solicitanteNome || trecho.removedSolicitanteNome || "";
      trecho.solicitanteRecordId = "";
      trecho.solicitanteRecordLabel = "";
      trecho.solicitanteNome = "";
      trecho.solicitantePessoaImportada = null;
      trecho.solicitantePickerOpen = false;
      renderImportReviewPreservingGallery();
      return;
    }
    if (passengerRow) {
      const passengerIndex = Number(passengerRow.dataset.passengerIndex);
      const passenger = trecho.passageiros[passengerIndex];
      if (!passenger) return;
      if (action.dataset.importAction === "open-import-passenger") {
        openImportedPassengerEdit(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey, passengerIndex);
        return;
      }
      if (action.dataset.importAction === "use-existing-passenger") {
        const candidate = passenger.matchCandidates.find((item) => sameId(item.passenger.id, action.dataset.passengerId));
        if (!candidate) return;
        const previousIdentity = importedPassengerIdentityKey(passenger);
        captureImportReviewHistory("Vincular passageiro existente");
        markImportedReviewPending(trecho);
        mergePassengerRecords([candidate.passenger]);
        applyExistingPassengerToImportedPassenger(
          passenger,
          candidate.passenger,
          "Cadastro existente vinculado. Banco de Dados não será atualizado."
        );
        syncImportedSolicitanteFromPassenger(trecho, passenger, previousIdentity);
        renderImportReviewPreservingGallery();
        return;
      }
      if (action.dataset.importAction === "create-new-passenger") {
        const previousIdentity = importedPassengerIdentityKey(passenger);
        captureImportReviewHistory("Criar novo passageiro");
        markImportedReviewPending(trecho);
        passenger.matchStatus = "create-new";
        passenger.passageiroId = "";
        passenger.passageiroLabel = "";
        passenger.matchMessage = "Criar novo com nome, telefone, email, CR e cliente.";
        syncImportedSolicitanteFromPassenger(trecho, passenger, previousIdentity);
        renderImportReviewPreservingGallery();
        openImportedPassengerEdit(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey, passengerIndex);
        return;
      }
      if (!isImportedTrechoEditing(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey)) {
        toast("Habilite a edição pelo ícone de lápis antes de alterar o serviço.", "warning", 5000);
        return;
      }
      if (action.dataset.importAction === "remove-import-passenger") {
        captureImportReviewHistory("Remover passageiro");
        markImportedReviewPending(trecho);
        trecho.passageiros.splice(passengerIndex, 1);
        trecho.destino = composeImportPassengerDestinations(trecho);
      }
      renderImportReviewPreservingGallery();
    }
  }

  function handleImportReviewInput(event) {
    const trechoCard = event.target.closest("[data-trecho-key]");
    if (!trechoCard) return;
    const trecho = findImportedTrecho(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey);
    if (!trecho) return;
    if (trecho.duplicatedRecordIds?.length) {
      event.preventDefault();
      toast("Serviço repetido não permite edição nesta tela.", "warning", 6000);
      return;
    }
    const passengerRow = event.target.closest("[data-passenger-index]");
    const passengerField = event.target.dataset.importPassengerField;
    if (!isImportedTrechoEditing(trechoCard.dataset.programacao, trechoCard.dataset.trechoKey)) {
      event.preventDefault();
      return;
    }

    if (event.target.dataset.importObservationText) {
      const obs = ensureImportedObservationState(trecho);
      const current = obs.current || "motorista";
      if (current === "motorista") {
        event.target.value = importedMotoristaObservationFromXlsx(trecho);
        return;
      }
      if (String(obs[current] ?? "") === String(event.target.value ?? "")) return;
      captureImportReviewHistory("Editar observação do serviço");
      markImportedReviewPending(trecho);
      obs[current] = event.target.value;
      syncImportedObservationFields(trecho);
      return;
    }

    if (passengerRow && passengerField) {
      const passenger = trecho.passageiros[Number(passengerRow.dataset.passengerIndex)];
      if (!passenger) return;
      if (String(passenger[passengerField] ?? "") === String(event.target.value ?? "")) return;
      captureImportReviewHistory("Editar passageiro do serviço");
      markImportedReviewPending(trecho);
      passenger[passengerField] = event.target.value;
      if (["nome", "telefone", "email", "centroCusto"].includes(passengerField)) {
        passenger.passageiroId = "";
        passenger.passageiroLabel = "";
        passenger.matchCandidates = [];
        passenger.matchStatus = "create-new";
        passenger.matchMessage = "Dados revisados. Ao salvar, o sistema revalida duplicidade antes de criar.";
      }
      if (passengerField === "destino") {
        trecho.destino = composeImportPassengerDestinations(trecho);
        const destinoField = trechoCard.querySelector('[data-import-field="destino"]');
        if (destinoField) destinoField.value = trecho.destino;
      }
      return;
    }

    const field = event.target.dataset.importField;
    if (!field) return;
    const value = event.target.value;
    if (field === "passengerRecordIdToAdd") {
      if (!value) return;
      const passengerRows = importedSolicitanteLookupRows(trecho);
      const passenger = createImportPassengerFromSelectedPerson(trecho, value, passengerRows);
      if (!passenger) return;
      const passengerIdentity = importedPassengerIdentityKey(passenger);
      if (passengerIdentity && (trecho.passageiros || []).some((item) => importedPassengerMatchesIdentity(item, passengerIdentity))) {
        setSelectValue(event.target, "");
        toast("Passageiro já está neste serviço.", "warning", 4000);
        return;
      }
      captureImportReviewHistory("Adicionar passageiro");
      markImportedReviewPending(trecho);
      trecho.passageiros.push(passenger);
      trecho.passengerPickerOpen = false;
      renderImportReviewPreservingGallery();
      return;
    }
    const solicitanteRows = field === "solicitanteRecordId" ? importedSolicitanteLookupRows(trecho) : null;
    const currentValue = field === "dataHora"
      ? importedTrechoDateTimeLocal(trecho)
      : field === "retornoPrevisto"
        ? importedTrechoReturnDateTimeLocal(trecho)
        : field === "solicitanteRecordId"
          ? resolveImportedSolicitanteSelectValue(trecho, solicitanteRows || [])
          : String(trecho[field] ?? "");
    if (String(currentValue ?? "") === String(value ?? "")) return;
    captureImportReviewHistory("Editar campo do serviço");
    markImportedReviewPending(trecho);
    if (field === "dataHora") {
      trecho.dataIso = datePartFromInputValue(value);
      trecho.horario = timePartFromInputValue(value);
      if (event.type === "change") {
        window.setTimeout(renderImportReview, 0);
      }
      return;
    }
    if (field === "retornoPrevisto") {
      trecho.retornoPrevistoDataIso = datePartFromInputValue(value);
      trecho.retornoPrevistoHorario = timePartFromInputValue(value);
      if (event.type === "change") {
        window.setTimeout(renderImportReview, 0);
      }
      return;
    }
    if (field === "solicitanteRecordId") {
      const selected = importedSolicitantePersonFromValue(value, solicitanteRows || [], trecho);
      trecho.solicitanteRecordId = value || "";
      trecho.solicitanteRecordLabel = selected?.label || selected?.nome || "";
      trecho.solicitanteNome = selected?.nome || selected?.label || "";
      trecho.solicitantePessoaImportada = isImportedSolicitanteTempId(value) && selected ? {
        nome: selected.nome || selected.label || "",
        telefone: selected.telefone || "",
        email: selected.email || "",
        centroCusto: selected.centroCusto || importedTrechoCr(trecho) || ""
      } : null;
      const linkedPassenger = linkedImportedPassengerForSolicitante(trecho, value, solicitanteRows || []);
      if (linkedPassenger) {
        syncImportedSolicitanteDraft(trecho, importedPassengerDraftRecord(linkedPassenger), linkedPassenger);
      }
      trecho.solicitantePickerOpen = false;
      trecho.passengerPickerOpen = false;
      if (event.type === "change") {
        window.setTimeout(renderImportReview, 0);
      }
      return;
    }
    trecho[field] = value;
    if (event.type === "change") {
      window.setTimeout(renderImportReview, 0);
    }
  }

  function findImportedTrecho(programacao, trechoKey) {
    const program = state.importReview?.programs?.find((item) => item.programacao === programacao);
    return program?.trechos.find((trecho) => trecho.key === trechoKey) || null;
  }

  function importedResolvedPassenger(passenger) {
    if (passenger.matchStatus !== "use-existing" || !passenger.passageiroId) return null;
    const importClient = getImportClient();
    return state.passageiros.find((item) => sameId(item.id, passenger.passageiroId)) || {
      id: passenger.passageiroId,
      label: passenger.passageiroLabel || passenger.nome,
      telefone: passenger.telefone || "",
      email: passenger.email || "",
      endereco: "",
      preferencias: "",
      cr: passenger.centroCusto || "",
      clienteId: importClient?.id || "",
      clienteLabel: importClient?.label || CONFIG.importDefaults.clienteLabel || ""
    };
  }

  async function saveImportedTrecho(trecho, options = {}) {
    if (normalizeImportedReviewStatus(trecho) !== importReviewStatuses().CONFIRMED) {
      toast("Confirme a revisão individual antes de salvar este trecho.", "warning", 7000);
      return null;
    }
    const issues = importedTrechoIssues(trecho);
    if (issues.length) {
      toast(`Resolva antes de salvar: ${issues[0]}`, "error", 8000);
      return null;
    }
    if (trecho.duplicatedRecordIds?.length) {
      toast("Serviço repetido provável. A importação não cria outro registro com horário, trajeto, endereço, destino e passageiros parecidos.", "error", 9000);
      return null;
    }
    const manageLoading = !options.skipLoading;
    if (manageLoading) setLoading(true);
    let createdReservaId = "";
    try {
      const context = await buildImportedSaveContext(trecho);
      const payload = buildImportedReservaPayload(trecho, context);
      const saved = await saveReserva(payload);
      createdReservaId = saved.id;
      await replacePassengerRelations(saved.id, context.colOrdemPassageiros, context, true);
      window.XlsxImportCore?.markImportedTrechoSaved?.(trecho, saved.id);
      if (!window.XlsxImportCore?.markImportedTrechoSaved) {
        trecho.savedRecordId = saved.id;
        trecho.reviewStatus = importReviewStatuses().SAVED;
        trecho.reviewBlockReason = "";
      }
      trecho.duplicatedRecordIds = Array.from(new Set([...(trecho.duplicatedRecordIds || []), saved.id]));
      if (!options.silentSuccess) {
        toast(`Trecho ${trecho.programacao} salvo.`, "success", 5000);
        renderImportReview();
      }
      return saved;
    } catch (error) {
      console.error(error);
      if (createdReservaId && state.xrm && !state.mockMode) {
        try {
          await state.xrm.WebApi.deleteRecord(CONFIG.entities.reserva, createdReservaId);
        } catch (cleanupError) {
          console.warn("Falha ao desfazer reserva importada incompleta", cleanupError);
        }
      }
      toast(error.message || "Falha ao salvar trecho importado.", "error", 9000);
      return null;
    } finally {
      if (manageLoading) setLoading(false);
    }
  }

  async function buildImportedSaveContext(trecho) {
    const importClient = requireImportClient();
    const colOrdemPassageiros = [];
    for (let index = 0; index < trecho.passageiros.length; index += 1) {
      const passenger = trecho.passageiros[index];
      const record = await ensureImportedPassengerRecord(passenger);
      colOrdemPassageiros.push({
        passageiro: record,
        ordem: index + 1,
        guid: record.id,
        enderecoSaidaBD: passenger.origem || trecho.origem || ""
      });
    }
    const solicitanteRecord = await ensureImportedSolicitanteRecord(trecho, colOrdemPassageiros);
    const dataHoraPrincipal = combineDateTime(trecho.dataIso, ...String(trecho.horario || "").split(":"));
    const retornoPrevisto = combineDateTime(
      trecho.retornoPrevistoDataIso || trecho.dataIso,
      ...String(trecho.retornoPrevistoHorario || "").split(":")
    );
    return {
      importClient,
      solicitanteRecord: solicitanteRecord || colOrdemPassageiros[0]?.passageiro || null,
      dataHoraPrincipal,
      retornoPrevisto,
      trajeto: composeImportTrajeto(trecho),
      enderecoCompleto: trecho.origem || colOrdemPassageiros.map((item) => `${item.ordem}. ${firstName(item.passageiro.label)} - ${item.enderecoSaidaBD || "indeterminado"}`).join(";\n"),
      passageirosTelefones: colOrdemPassageiros.map((item) => `${item.passageiro.label} - ${item.passageiro.telefone || "indeterminado"}`).join(";\n"),
      preferencias: "",
      emailPassageiro: "",
      colOrdemPassageiros,
      enderecoPersonalizadoAtivo: false
    };
  }

  async function ensureImportedPassengerRecord(passenger) {
    if (passenger.matchStatus === "use-existing" && passenger.passageiroId) {
      const existing = importedResolvedPassenger(passenger);
      if (existing) {
        mergePassengerRecords([existing]);
        return existing;
      }
    }
    if (passenger.matchStatus === "ambiguous") {
      const selected = selectImportedExistingMatch(passenger.matchCandidates, getImportClient());
      if (selected) {
        mergePassengerRecords([selected.passenger]);
        applyExistingPassengerToImportedPassenger(passenger, selected.passenger, "Cadastro existente vinculado. Banco de Dados não será atualizado.");
        return selected.passenger;
      }
      throw new Error(`Decida o passageiro ${passenger.nome} antes de salvar.`);
    }
    const existing = await findImportedExistingPerson(passenger);
    if (existing) {
      applyExistingPassengerToImportedPassenger(passenger, existing, "Cadastro existente vinculado. Banco de Dados não será atualizado.");
      return existing;
    }
    return createImportedPassenger(passenger);
  }

  async function createImportedPassenger(passenger) {
    const record = await createImportedPersonRecord(passenger);
    passenger.matchStatus = "use-existing";
    passenger.passageiroId = record.id;
    passenger.passageiroLabel = record.label;
    return record;
  }

  async function ensureImportedSolicitanteRecord(trecho, colOrdemPassageiros = []) {
    if (trecho.solicitanteRecordId) {
      if (!isImportedSolicitanteTempId(trecho.solicitanteRecordId)) {
        const existing = state.passageiros.find((passenger) => sameId(passenger.id, trecho.solicitanteRecordId));
        if (existing) return existing;
      }
    }
    const linkedPassenger = linkedImportedPassengerForSolicitante(trecho);
    const linkedPassengerIndex = linkedPassenger ? trecho.passageiros.indexOf(linkedPassenger) : -1;
    const linkedPassengerRecord = linkedPassengerIndex >= 0 ? colOrdemPassageiros[linkedPassengerIndex]?.passageiro : null;
    if (linkedPassengerRecord) {
      trecho.solicitanteRecordId = linkedPassengerRecord.id;
      trecho.solicitanteRecordLabel = linkedPassengerRecord.label;
      trecho.solicitantePessoaImportada = null;
      return linkedPassengerRecord;
    }
    const selected = isImportedSolicitanteTempId(trecho.solicitanteRecordId)
      ? importedSolicitantePersonFromValue(trecho.solicitanteRecordId, importedSolicitanteLookupRows(trecho), trecho)
      : null;
    const nome = String(selected?.nome || selected?.label || trecho.solicitanteRecordLabel || trecho.solicitanteNome || "").trim();
    if (!nome) return null;
    const person = {
      nome,
      telefone: selected?.telefone || trecho.solicitantePessoaImportada?.telefone || "",
      email: selected?.email || trecho.solicitantePessoaImportada?.email || "",
      origem: "",
      centroCusto: selected?.centroCusto || trecho.solicitantePessoaImportada?.centroCusto || importedTrechoCr(trecho),
      matchStatus: "create-new",
      passageiroId: "",
      passageiroLabel: ""
    };
    const existing = await findImportedExistingPerson(person);
    const record = existing || await createImportedPersonRecord(person);
    trecho.solicitanteRecordId = record.id;
    trecho.solicitanteRecordLabel = record.label;
    return record;
  }

  async function findImportedExistingPerson(person) {
    const importClient = requireImportClient();
    const matches = await findPassengerDuplicateCandidates(importedPassengerCandidate(person, importClient));
    const selected = selectImportedExistingMatch(matches, importClient);
    if (!selected) return null;
    mergePassengerRecords([selected.passenger]);
    return selected.passenger;
  }

  async function createImportedPersonRecord(person) {
    const importClient = requireImportClient();
    const key = normalize([
      person.nome,
      person.telefone,
      person.email,
      person.centroCusto,
      importClient.id
    ].join("|"));
    if (importPassengerCreateLocks.has(key)) return importPassengerCreateLocks.get(key);
    const promise = (async () => {
      const payload = {
        [CONFIG.fields.passageiro.nome]: normalizePassengerDisplayName(person.nome),
        [CONFIG.fields.passageiro.telefone]: phoneStorageValue(person.telefone || "", "55"),
        [CONFIG.fields.passageiro.email]: normalizeEmail(person.email || ""),
        [CONFIG.fields.passageiro.cr]: person.centroCusto || ""
      };
      bindLookup(payload, CONFIG.nav.cliente, CONFIG.entitySets.cliente, importClient.id);

      let created;
      if (state.xrm && !state.mockMode) {
        created = await state.xrm.WebApi.createRecord(CONFIG.entities.passageiro, payload);
      } else {
        created = { id: `import-pax-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}` };
      }
      const record = {
        id: cleanGuid(created.id),
        label: normalizePassengerDisplayName(person.nome),
        telefone: formatPhoneNumber(person.telefone || ""),
        email: normalizeEmail(person.email || ""),
        endereco: "",
        preferencias: "",
        cr: person.centroCusto || "",
        clienteId: importClient.id,
        clienteLabel: importClient.label
      };
      mergePassengerRecords([record]);
      persistMockPassengerRecord(record);
      return record;
    })();
    importPassengerCreateLocks.set(key, promise);
    try {
      return await promise;
    } finally {
      importPassengerCreateLocks.delete(key);
    }
  }

  function buildImportedReservaPayload(trecho, context) {
    const f = CONFIG.fields.reserva;
    const importObs = ensureImportedObservationState(trecho);
    const tenarisIdField = importedReservaTenarisIdField();
    const payload = {
      [tenarisIdField]: trecho.programacao,
      [f.enderecoView]: context.enderecoCompleto,
      [f.destino]: trecho.destino || "",
      [f.dataSaida]: context.dataHoraPrincipal.toISOString(),
      [f.obsOperacao]: importObs.motorista || "",
      [f.obsInterna]: importObs.interna || (isSplitImportedTrecho(trecho)
        ? `Serviço criado por Split na PG: ${trecho.programacao}.`
        : importedDefaultInternalObservation(trecho)),
      [f.obsFinal]: importObs.final || "",
      [f.perfilPassageiro]: importObs.passageiro || "",
      [f.email]: "",
      [f.trajeto]: context.trajeto,
      [f.paxView]: context.passageirosTelefones,
      [f.receber]: false,
      [f.cr]: importedTrechoCr(trecho)
    };
    setChoice(payload, f.status, findOptionValue("statusOperacao", resolveImportedOperationStatusLabel(trecho)) || findOptionValue("statusOperacao", "Confirmado"));
    setChoice(payload, f.statusFaturamento, el.statusFaturamento.value || findOptionValue("statusFaturamento", "Pendente"));
    setChoice(payload, f.tipoServico, resolveImportOption("tipoServico", trecho.tipoServicoValue, trecho.tipoServicoSugerido));
    setChoice(payload, f.tipoVeiculo, resolveImportOption("tipoVeiculo", trecho.tipoVeiculoValue, trecho.tipoVeiculoSugerido));
    setChoice(payload, f.formaPagamento, el.formaPagamento.value);
    if (context.retornoPrevisto) payload[f.previsaoRetorno] = context.retornoPrevisto.toISOString();
    bindLookup(payload, CONFIG.nav.cliente, CONFIG.entitySets.cliente, context.importClient.id);
    bindLookup(payload, CONFIG.nav.solicitante, CONFIG.entitySets.passageiro, context.solicitanteRecord?.id || context.colOrdemPassageiros[0]?.guid);
    const motorista = findMotoristaByName(trecho.motoristaNome);
    bindLookup(payload, CONFIG.nav.motorista, CONFIG.entitySets.funcionario, motorista?.id || el.motorista.value);
    return payload;
  }

  function resolveImportOption(key, explicitValue, suggestedLabel) {
    if (explicitValue && state.options[key]?.some((item) => String(item.value) === String(explicitValue))) {
      return explicitValue;
    }
    if (suggestedLabel) return findOptionValue(key, suggestedLabel);
    return "";
  }

  function composeImportTrajeto(trecho) {
    if (trecho?.trajetoCidades) return trecho.trajetoCidades;
    return [trecho.cidadeOrigem, trecho.cidadeDestino].filter(Boolean).join(" / ") || [trecho.origem, trecho.destino].filter(Boolean).join(" / ");
  }

  function importedTrechoCr(trecho) {
    const seen = new Set();
    return (trecho.passageiros || [])
      .map((passenger) => String(passenger.centroCusto || "").trim())
      .filter((centroCusto) => {
        const key = normalize(centroCusto);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .join(" / ");
  }

  function composeImportPassengerDestinations(trecho) {
    const passageiros = trecho?.passageiros || [];
    const uniqueDestinos = [];
    passageiros.forEach((passenger) => {
      const destino = String(passenger.destino || "").trim();
      const key = normalize(destino);
      if (key && !uniqueDestinos.some((item) => normalize(item) === key)) {
        uniqueDestinos.push(destino);
      }
    });
    if (uniqueDestinos.length <= 1) return uniqueDestinos[0] || "";
    return passageiros.map((passenger, index) => {
      const destino = String(passenger.destino || "").trim();
      const nome = firstName(passenger.nome) || `Passageiro ${index + 1}`;
      return `${index + 1}. ${nome} - ${destino || "destino não informado"}`;
    }).join(";\n");
  }

  function findMotoristaByName(name) {
    const wanted = normalize(name);
    if (!wanted) return null;
    return state.motoristas.find((motorista) => {
      const searchable = normalize([motorista.label, motorista.nomeCompleto, motorista.search].filter(Boolean).join(" "));
      return searchable.includes(wanted) || wanted.includes(searchable);
    }) || null;
  }

  function formatDateInputForDisplay(value) {
    if (!value) return "sem data";
    const [year, month, day] = datePartFromInputValue(value).split("-");
    return year && month && day ? `${day}/${month}/${year}` : value;
  }

  function resolvePassengerMatchReview(result) {
    const resolve = passengerMatchResolve;
    passengerMatchResolve = null;
    if (resolve) resolve(result || { action: "cancel" });
    if (el.passengerMatchOverlay) el.passengerMatchOverlay.hidden = true;
  }

  async function saveForm() {
    captureObsState();
    if (isImportSaveMode()) {
      performImportedServicesSave();
      return;
    }

    if (state.isNew && !hasPrimaryDraftChanges()) {
      toast("Preencha e valide o formulário antes de agendar. Nada alterado para salvar.", "warning", 7000);
      return;
    }

    const context = buildSaveContext();
    clearValidationStates();
    proceedSaveContext(context);
  }

  function isImportSaveMode() {
    return state.currentTab === "import" && !!state.importReview?.programs?.length;
  }

  function collectImportedTrechos(review = state.importReview) {
    return (review?.programs || []).flatMap((program) => (program?.trechos || []));
  }

  function summarizeImportTrechoStatuses(trechos = []) {
    const statuses = importReviewStatuses();
    const counts = {
      pending: 0,
      confirmed: 0,
      blocked: 0,
      ignored: 0,
      saved: 0,
      total: 0
    };
    (trechos || []).forEach((trecho) => {
      const status = normalizeImportedReviewStatus(trecho);
      if (Object.prototype.hasOwnProperty.call(counts, status)) {
        counts[status] += 1;
      } else {
        counts.pending += 1;
      }
      counts.total += 1;
    });
    return counts;
  }

  function hasPrimaryDraftChanges() {
    if (!state.isNew) return true;
    if (state.draftCommonEdited) return true;
    if (state.scheduleDrafts?.length) return true;
    if (state.activationDraftEditState?.return || state.activationDraftEditState?.repeat) return true;
    if ((state.selectedPassengers || []).some((item) => item?.passageiro || item?.guid || hasText(item?.telefone) || hasText(item?.enderecoEditado))) return true;
    if ((state.enderecoRascunho || []).some((item) => hasText(item?.endereco))) return true;

    const snapshot = createDraftSnapshot();
    return hasCommonDraftContent(snapshot);
  }

  async function performImportedServicesSave() {
    if (!state.importReview?.programs?.length) {
      toast("Importe um XLSX antes de agendar serviços importados.", "warning", 7000);
      return;
    }

    const trechos = collectImportedTrechos(state.importReview);
    const counts = summarizeImportTrechoStatuses(trechos);
    const statuses = importReviewStatuses();
    if (!counts.total) {
      toast("Nenhum serviço importado para agendar.", "warning", 5000);
      return;
    }

    if (counts.ignored === counts.total) {
      toast("Todos os serviços importados estão ignorados. Revise ou remova os itens antes de agendar.", "warning", 7000);
      return;
    }

    if (counts.pending || counts.blocked) {
      const parts = [];
      if (counts.pending) parts.push(`${counts.pending} pendente(s)`);
      if (counts.blocked) parts.push(`${counts.blocked} bloqueado(s)`);
      toast(`Validação incompleta dos serviços importados: ${parts.join(" e ")}. ${counts.ignored ? `${counts.ignored} ignorado(s). ` : ""}Confirme ou descarte os itens antes de agendar.`, "warning", 8000);
      return;
    }

    const confirmedTrechos = trechos.filter((trecho) => normalizeImportedReviewStatus(trecho) === statuses.CONFIRMED);
    const validatedTrechos = confirmedTrechos.filter((trecho) => !importedTrechoIssues(trecho).length);
    if (!validatedTrechos.length) {
      toast("Não há serviços importados confirmados com validação completa.", "warning", 7000);
      return;
    }

    if (activeImportedPassengerEditRef) {
      flushImportedPassengerEditBeforeHistory();
    }

    setLoading(true);
    state.pendingSaveContext = null;
    clearSaveLog();

    try {
      const results = await runImportedSaveQueue(validatedTrechos);
      const savedCount = results.filter(Boolean).length;
      const failedCount = results.length - savedCount;

      if (!savedCount) {
        toast("Falha ao agendar serviços importados. Verifique os erros e tente novamente.", "error", 9000);
        return;
      }

      if (failedCount) {
        toast(`${savedCount} serviço(s) agendado(s). ${failedCount} serviço(s) falharam.`, "warning", 8000);
      } else {
        toast(`${savedCount} serviço(s) importado(s) agendado(s) com sucesso.`, "success", 7000);
      }
      renderImportReview();
      renderTabBadges();
    } catch (error) {
      console.error(error);
      toast(error.message || "Falha ao agendar serviços importados.", "error", 9000);
    } finally {
      setLoading(false);
    }
  }

  async function runImportedSaveQueue(trechos) {
    const results = new Array(trechos.length).fill(null);
    let nextIndex = 0;
    const workerCount = Math.min(IMPORT_SAVE_CONCURRENCY, trechos.length);
    const workers = Array.from({ length: workerCount }, async () => {
      while (nextIndex < trechos.length) {
        const index = nextIndex;
        nextIndex += 1;
        results[index] = await saveImportedTrecho(trechos[index], {
          silentSuccess: true,
          skipLoading: true
        });
      }
    });
    await Promise.all(workers);
    return results;
  }

  function proceedSaveContext(context, options = {}) {
    const validation = validateContext(context);
    if (validation) {
      state.pendingSaveContext = null;
      toast(validation, "error", 7000);
      focusInvalidField(validation);
      return;
    }

    if (!options.skipActivationGuard) {
      const inactiveDrafts = collectInactiveActivationDrafts();
      if (inactiveDrafts.length) {
        state.pendingSaveContext = context;
        openActivationGuard(inactiveDrafts);
        return;
      }
    }

    if (!options.skipReturnReceiveScope && shouldAskReturnReceiveScope(context)) {
      state.pendingSaveContext = context;
      openReturnReceiveScope();
      return;
    }

    state.pendingSaveContext = context;
    openReviewBeforeSave(context);
  }

  function collectInactiveActivationDrafts() {
    const drafts = [];
    if (hasInactiveReturnDraft()) {
      drafts.push({
        type: "return",
        tab: "return",
        label: "Retorno",
        detail: "Campos de retorno preenchidos, mas a chave Ativado está desligada."
      });
    }
    if (hasInactiveRepeatDraft()) {
      drafts.push({
        type: "repeat",
        tab: "repeat",
        label: "Repetir",
        detail: "Campos de repetição preenchidos, mas a chave Ativado está desligada."
      });
    }
    return drafts;
  }

  function openActivationGuard(drafts) {
    if (!el.activationGuardOverlay || !el.activationGuardList) {
      proceedSaveContext(state.pendingSaveContext || buildSaveContext(), { skipActivationGuard: true });
      return;
    }
    state.activationGuardDrafts = drafts;
    el.activationGuardList.innerHTML = "";
    drafts.forEach((draft) => {
      const item = document.createElement("article");
      item.className = "activation-guard-item";
      const dot = document.createElement("span");
      dot.className = "activation-guard-dot";
      dot.setAttribute("aria-hidden", "true");
      const text = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = draft.label;
      const detail = document.createElement("span");
      detail.textContent = draft.detail;
      text.append(title, detail);
      item.append(dot, text);
      el.activationGuardList.appendChild(item);
    });
    el.activationGuardOverlay.hidden = false;
    requestAnimationFrame(() => {
      el.activationGuardActivate?.focus();
    });
  }

  function closeActivationGuard() {
    if (el.activationGuardOverlay) el.activationGuardOverlay.hidden = true;
    state.activationGuardDrafts = [];
  }

  function shouldAskReturnReceiveScope(context) {
    if (!state.isNew || !el.receberRetorno?.checked || !el.repetirServico.checked) return false;
    if (el.frequenteTipo.value !== "Ida e retorno") return false;
    if (context.receberRetornoScope) return false;
    return collectReturnReceiveTimestamps(context).length > 0;
  }

  function openReturnReceiveScope() {
    if (!el.returnReceiveScopeOverlay) {
      resolveReturnReceiveScope("all");
      return;
    }
    el.returnReceiveScopeOverlay.hidden = false;
    requestAnimationFrame(() => {
      el.returnReceiveScopeAll?.focus();
    });
  }

  function closeReturnReceiveScope() {
    if (el.returnReceiveScopeOverlay) el.returnReceiveScopeOverlay.hidden = true;
  }

  function resolveReturnReceiveScope(action) {
    const context = state.pendingSaveContext || buildSaveContext();
    closeReturnReceiveScope();

    if (action === "review") {
      state.pendingSaveContext = null;
      setTab("return");
      return;
    }

    context.receberRetornoScope = action === "last" ? "last" : "all";
    context.receberRetornoUltimoTimestamp = resolveLastReturnReceiveTimestamp(context);
    proceedSaveContext(context, { skipReturnReceiveScope: true });
  }

  function resolveLastReturnReceiveTimestamp(context) {
    const timestamps = collectReturnReceiveTimestamps(context);
    return timestamps.length ? timestamps[timestamps.length - 1] : null;
  }

  function collectReturnReceiveTimestamps(context) {
    const timestamps = [];
    const pushDate = (date) => {
      if (!date || Number.isNaN(date.getTime())) return;
      timestamps.push(date.getTime());
    };

    if (el.agendarRetorno.checked) pushDate(context.dataHoraRetorno);

    if (el.repetirServico.checked && (el.frequenteTipo.value === "Retorno" || el.frequenteTipo.value === "Ida e retorno")) {
      const dates = generateFrequentDates(el.frequenteInicio.value, el.frequenteFim.value, el.contabilizarFds.checked);
      const retornoTime = el.retornoHora.value && el.retornoMinuto.value
        ? timeFromParts(el.retornoHora.value, el.retornoMinuto.value)
        : { hours: 18, minutes: 0 };
      const originalRetorno = context.dataHoraRetorno?.getTime();
      dates.forEach((date) => {
        const dataRetorno = withClock(date, retornoTime.hours, retornoTime.minutes);
        if (originalRetorno && dataRetorno.getTime() === originalRetorno) return;
        pushDate(dataRetorno);
      });
    }

    return Array.from(new Set(timestamps)).sort((a, b) => a - b);
  }

  function resolveActivationGuard(action) {
    const drafts = [...(state.activationGuardDrafts || [])];
    const context = state.pendingSaveContext || buildSaveContext();
    closeActivationGuard();

    if (action === "review") {
      state.pendingSaveContext = null;
      const first = drafts[0];
      if (first?.tab) setTab(first.tab);
      return;
    }

    if (action === "activate") {
      drafts.forEach((draft) => {
        if (draft.type === "return") el.agendarRetorno.checked = true;
        if (draft.type === "repeat") el.repetirServico.checked = true;
      });
      renderTabBadges();
      proceedSaveContext(buildSaveContext());
      return;
    }

    proceedSaveContext(context, { skipActivationGuard: true });
  }

  async function performSave() {
    const context = state.pendingSaveContext || buildSaveContext();
    closeReviewOverlay(false);
    clearSaveLog();
    addSaveLog("success", "Validação concluída", "Campos obrigatórios aprovados.");
    setLoading(true);
    try {
      const results = [];

      if (state.isNew) {
        addSaveLog("info", "Criando principal", formatDateTime(context.dataHoraPrincipal));
        const principal = await saveReserva(buildReservaPayload(context, "principal", context.dataHoraPrincipal));
        results.push({ tipo: "Principal", data: context.dataHoraPrincipal, result: principal });
        addSaveLog("success", "Principal salvo", principal.id);
        addSaveLog("info", "Vinculando passageiros", `${context.colOrdemPassageiros.length} passageiro(s).`);
        await replacePassengerRelations(principal.id, context.colOrdemPassageiros, context, true);
        addSaveLog("success", "Passageiros vinculados", "Principal.");

        if (el.repetirServico.checked) {
          addSaveLog("info", "Criando recorrência", "Gerando serviços frequentes.");
          const frequent = await createFrequentServices(context);
          results.push(...frequent);
          addSaveLog("success", "Recorrência salva", `${frequent.length} serviço(s).`);
        }

        if (el.agendarRetorno.checked) {
          addSaveLog("info", "Criando retorno", formatDateTime(context.dataHoraRetorno));
          const retorno = await saveReserva(buildReservaPayload(context, "retorno", context.dataHoraRetorno));
          results.push({ tipo: "Retorno", data: context.dataHoraRetorno, result: retorno });
          await replacePassengerRelations(retorno.id, context.colOrdemPassageiros, context, false);
          addSaveLog("success", "Retorno salvo", retorno.id);
        }
      } else {
        if (el.agendarRetorno.checked || el.repetirServico.checked) {
      throw new Error("Agendamento de retorno e serviços frequentes só na criação.");
        }
        addSaveLog("info", "Atualizando reserva", state.recordId);
        const updated = await saveReserva(buildReservaPayload(context, "edicao", context.dataHoraPrincipal), state.recordId);
        addSaveLog("info", "Recriando vínculos", `${context.colOrdemPassageiros.length} passageiro(s).`);
        await replacePassengerRelations(state.recordId, context.colOrdemPassageiros, context, true, true);
        results.push({ tipo: "Edição", data: context.dataHoraPrincipal, result: updated });
        addSaveLog("success", "Edição salva", state.recordId);
      }

      const total = results.length;
      const message = state.isNew
        ? (total === 1 ? "Serviço criado com sucesso" : `${total} serviços criados com sucesso!`)
        : "Serviço editado com sucesso!";
      addSaveLog("success", "Fluxo concluído", message);
      showSuccess(message);
      clearDraftSnapshot(false);
      state.pendingSaveContext = null;
      resetAfterSuccess();
    } catch (error) {
      console.error(error);
      addSaveLog("error", "Falha no salvamento", error.message || "Erro desconhecido.");
      toast(error.message || "Falha ao salvar formulário.", "error", 9000);
    } finally {
      setLoading(false);
    }
  }

  function captureObsState() {
    state.obs[state.obsAtual] = el.observacao.value;
    state.obsRet[state.retObsAtual] = el.retornoObservacao.value;
    state.obs.passageiro = composePreferencias();
    state.obsRet.passageiro = composePreferencias();
  }

  function buildSaveContext() {
    syncAllDateTimeInputs();
    const dataHoraPrincipal = combineDateTime(el.saidaData.value, el.saidaHora.value, el.saidaMinuto.value);
    const retPrev = buildRetornoPrevisto(dataHoraPrincipal);
    const dataHoraRetorno = combineDateTime(el.retornoData.value, el.retornoHora.value, el.retornoMinuto.value);
    const colOrdemPassageiros = getValidPassengerRows().map((item) => ({
      passageiro: item.passageiro,
      ordem: item.ordem,
      guid: item.guid,
      enderecoSaidaBD: getDraftAddress(item.ordem) || item.enderecoEditado || ""
    }));
    const additionalSchedules = [];

    return {
      dataHoraPrincipal,
      dataHoraRetorno,
      retornoPrevisto: retPrev,
      trajeto: el.trajeto.value.trim(),
      enderecoCompleto: composeEnderecoCompleto(),
      enderecoCompletoInvertido: composeEnderecoCompletoInvertido(),
      passageirosTelefones: composePassageirosTelefones(),
      preferencias: composePreferencias(),
      emailPassageiro: firstPassengerValue("email"),
      colOrdemPassageiros,
      additionalSchedules
    };
  }

  function buildAdditionalScheduleContexts(mainDateTime) {
    return state.scheduleDrafts.map((item, index) => {
      const dataHora = combineDateTime(item.data, item.hora, item.minuto);
      return {
        index,
        dataHora,
        retornoPrevisto: buildScheduleRetornoPrevisto(item, dataHora || mainDateTime),
        tipoServico: item.tipoServico || "",
        tipoVeiculo: item.tipoVeiculo || "",
        motorista: item.motorista || "",
        trajeto: String(item.trajeto || "").trim(),
        destino: String(item.destino || "").trim(),
        obsMotorista: String(item.obsMotorista || "").trim()
      };
    });
  }

  function buildScheduleRetornoPrevisto(item, baseDateTime) {
    const explicitRetorno = parseDateTimeInputValue(item?.retPrevDateTime);
    if (explicitRetorno) return explicitRetorno;
    if (!baseDateTime || !item.retPrevHora || !item.retPrevMinuto || !item.hora || !item.minuto) return null;
    const saidaTime = timeFromParts(item.hora, item.minuto);
    const retornoTime = timeFromParts(item.retPrevHora, item.retPrevMinuto);
    const base = new Date(baseDateTime);
    if (retornoTime.minutesTotal < saidaTime.minutesTotal) base.setDate(base.getDate() + 1);
    return withClock(base, retornoTime.hours, retornoTime.minutes);
  }

  function validateContext(context) {
    const statusLabel = optionLabel("statusOperacao", el.statusOperacao.value);
    const isTroca = statusLabel === "Troca de Veículos";
    if (!context.dataHoraPrincipal || !el.saidaHora.value || !el.saidaMinuto.value) return "'Data e horário de saída' são obrigatórios.";
    if (!el.tipoServico.value && !isTroca) return "'Tipo do Serviço' é obrigatório.";
    if (!el.tipoVeiculo.value && !isTroca) return "'Tipo do Veículo' é obrigatório.";
    if (!context.trajeto && !isTroca) return "'Trajeto' (Cidade de origem/destino) é obrigatório.";
    if (context.colOrdemPassageiros.length === 0 && !isTroca) return "É obrigatório selecionar pelo menos um passageiro.";
    if (!context.enderecoCompleto && !isTroca) return "'Endereço de saída' é obrigatório.";
    if (!el.destino.value.trim() && !isTroca) return "'Destino' é obrigatório.";
    if (!el.cliente.value) return "'Cliente' é obrigatório.";
    if (!el.solicitante.value) return "'Solicitante' é obrigatório.";
    if (el.agendarRetorno.checked && !el.retornoData.value) return "'Data de retorno' é obrigatória.";
    if (el.agendarRetorno.checked && !el.retornoEndereco.value.trim()) return "'Endereço de Saída - Retorno' é obrigatório.";
    if (el.agendarRetorno.checked && !el.retornoDestino.value.trim()) return "'Destino - Retorno' é obrigatório.";
    if (el.agendarRetorno.checked && context.dataHoraRetorno && context.dataHoraPrincipal && context.dataHoraRetorno < context.dataHoraPrincipal) return "Data de retorno nao pode ser anterior a saida.";
    if (el.repetirServico.checked && (!el.frequenteInicio.value || !el.frequenteFim.value)) return "'Data de início e fim - Serviços Frequentes' são obrigatórios.";
    if (el.repetirServico.checked && el.frequenteInicio.value && el.frequenteFim.value && new Date(el.frequenteFim.value) < new Date(el.frequenteInicio.value)) return "'Data final' não pode ser anterior à data inicial.";
    const frequentPeriodError = validateFrequentServicePeriod();
    if (frequentPeriodError) return frequentPeriodError;
    if (el.repetirServico.checked && !el.frequenteTipo.value) return "'Tipo de Serviço Frequente' é obrigatório.";
    if (hasDuplicatePassengers()) return "Erro: passageiro duplicado na lista. Remova as duplicatas.";
    return "";
  }

  function validateFrequentServicePeriod() {
    if (!el.repetirServico.checked || !el.frequenteInicio.value || !el.frequenteFim.value) return "";
    const days = dateRangeDays(el.frequenteInicio.value, el.frequenteFim.value);
    if (days > MAX_FREQUENT_SERVICE_DAYS) {
      return `Periodo frequente muito grande. Limite: ${MAX_FREQUENT_SERVICE_DAYS} dias.`;
    }
    const dates = generateFrequentDates(el.frequenteInicio.value, el.frequenteFim.value, el.contabilizarFds.checked);
    const multiplier = el.frequenteTipo.value === "Ida e retorno" ? 2 : 1;
    if (dates.length * multiplier > MAX_FREQUENT_SERVICE_RECORDS) {
      return `Periodo frequente muito grande. Limite: ${MAX_FREQUENT_SERVICE_RECORDS} servicos.`;
    }
    return "";
  }

  function dateRangeDays(startValue, endValue) {
    const start = new Date(`${startValue}T00:00:00`);
    const end = new Date(`${endValue}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
  }

  function buildReservaPayload(context, kind, dataHora, scheduleOverride = null) {
    const f = CONFIG.fields.reserva;
    const isReturn = kind === "retorno" || kind === "frequenteRetorno";
    const retornoPrevisto = scheduleOverride ? scheduleOverride.retornoPrevisto : context.retornoPrevisto;
    const trajeto = scheduleOverride ? scheduleOverride.trajeto : context.trajeto;
    const destino = scheduleOverride ? scheduleOverride.destino : el.destino.value.trim();
    const payload = {
      [f.enderecoView]: isReturn ? el.retornoEndereco.value.trim() : context.enderecoCompleto,
      [f.destino]: isReturn ? el.retornoDestino.value.trim() : destino,
      [f.dataSaida]: dataHora.toISOString(),
      [f.obsOperacao]: isReturn ? state.obsRet.motorista : (scheduleOverride?.obsMotorista ?? state.obs.motorista),
      [f.obsInterna]: isReturn ? state.obsRet.interna : state.obs.interna,
      [f.obsFinal]: isReturn ? state.obsRet.final : state.obs.final,
      [f.perfilPassageiro]: context.preferencias,
      [f.email]: context.emailPassageiro || "",
      [f.trajeto]: isReturn ? invertTrajeto(context.trajeto) : trajeto,
      [f.paxView]: context.passageirosTelefones,
      [f.cotacao]: parseNumber(el.cotacao.value),
      [f.receber]: resolveReceberPayloadValue(context, kind, dataHora),
      [f.cr]: normalizeCodeValue(el.cr.value)
    };

    if (!isReturn && retornoPrevisto) payload[f.previsaoRetorno] = retornoPrevisto.toISOString();
    if (!isReturn) payload[f.enderecoPersonalizado] = state.enderecoPersonalizadoAtivo ? el.enderecoPersonalizado.value.trim() : null;
    if (isReturn) payload["cr40f_enderecodesaida1"] = el.retornoEndereco.value.trim();

    setChoice(payload, f.status, el.statusOperacao.value);
    setChoice(payload, f.statusFaturamento, el.statusFaturamento.value);
    setChoice(payload, f.tipoServico, scheduleOverride ? scheduleOverride.tipoServico : el.tipoServico.value);
    setChoice(payload, f.tipoVeiculo, scheduleOverride ? scheduleOverride.tipoVeiculo : el.tipoVeiculo.value);
    setChoice(payload, f.formaPagamento, el.formaPagamento.value);

    bindLookup(payload, CONFIG.nav.cliente, CONFIG.entitySets.cliente, el.cliente.value);
    bindLookup(payload, CONFIG.nav.solicitante, CONFIG.entitySets.passageiro, el.solicitante.value);
    bindLookup(payload, CONFIG.nav.motorista, CONFIG.entitySets.funcionario, scheduleOverride ? scheduleOverride.motorista : el.motorista.value);
    bindLookup(payload, CONFIG.nav.financeiro, CONFIG.entitySets.financeiro, el.op.value);
    return payload;
  }

  function resolveReceberPayloadValue(context, kind, dataHora) {
    const isReturn = kind === "retorno" || kind === "frequenteRetorno";
    if (!isReturn) return !!el.receber.checked;
    if (!el.receberRetorno?.checked) return false;
    if (context.receberRetornoScope !== "last") return true;
    const timestamp = dataHora?.getTime?.();
    return timestamp === context.receberRetornoUltimoTimestamp;
  }

  async function createFrequentServices(context) {
    const frequentPeriodError = validateFrequentServicePeriod();
    if (frequentPeriodError) {
      throw new Error(frequentPeriodError);
    }
    if (new Date(el.frequenteFim.value) < new Date(el.frequenteInicio.value)) {
      throw new Error("Data final não pode ser anterior a data inicial para serviços frequentes.");
    }
    const results = [];
    const dates = generateFrequentDates(el.frequenteInicio.value, el.frequenteFim.value, el.contabilizarFds.checked);
    const tipo = el.frequenteTipo.value;
    const principalTime = context.dataHoraPrincipal.getTime();

    if (tipo === "Ida" || tipo === "Ida e retorno") {
      for (const date of dates) {
        const dataIda = withTime(date, context.dataHoraPrincipal);
        if (dataIda.getTime() === principalTime) continue;
        const payload = buildReservaPayload(context, "frequenteIda", dataIda);
        delete payload[CONFIG.fields.reserva.previsaoRetorno];
        const retornoPrev = buildRecurringRetornoPrevisto(context, dataIda);
        if (retornoPrev) payload[CONFIG.fields.reserva.previsaoRetorno] = retornoPrev.toISOString();
        const saved = await saveReserva(payload);
        results.push({ tipo: "Ida", data: dataIda, result: saved });
        await replacePassengerRelations(saved.id, context.colOrdemPassageiros, context, true);
      }
    }

    if (tipo === "Retorno" || tipo === "Ida e retorno") {
      const retornoTime = el.retornoHora.value && el.retornoMinuto.value
        ? timeFromParts(el.retornoHora.value, el.retornoMinuto.value)
        : { hours: 18, minutes: 0 };
      const originalRetorno = context.dataHoraRetorno?.getTime();
      for (const date of dates) {
        const dataRetorno = withClock(date, retornoTime.hours, retornoTime.minutes);
        if (originalRetorno && dataRetorno.getTime() === originalRetorno) continue;
        const payload = buildReservaPayload(context, "frequenteRetorno", dataRetorno);
        const saved = await saveReserva(payload);
        results.push({ tipo: "Retorno", data: dataRetorno, result: saved });
        await replacePassengerRelations(saved.id, context.colOrdemPassageiros, context, false);
      }
    }

    return results;
  }

  async function saveReserva(payload, id) {
    if (!state.xrm || state.mockMode) {
      const saved = upsertMockRecord(payload, id);
      state.recordId = saved.id;
      return { id: saved.id };
    }
    if (id) {
      await state.xrm.WebApi.updateRecord(CONFIG.entities.reserva, id, payload);
      return { id };
    }
    const created = await state.xrm.WebApi.createRecord(CONFIG.entities.reserva, payload);
    return { id: cleanGuid(created.id) };
  }

  function buildPassengerRelationPayload(reservaId, item, context, includeAddress, includeLookups) {
    const payload = {
      [CONFIG.fields.servicoPassageiro.ordem]: item.ordem
    };
    if (includeLookups) {
      bindLookup(payload, CONFIG.nav.servicoGeral, CONFIG.entitySets.reserva, reservaId);
      bindLookup(payload, CONFIG.nav.servicoBancoDados, CONFIG.entitySets.passageiro, item.guid);
    }
    if (includeAddress) {
      const sharedAddress = context?.enderecoPersonalizadoAtivo ?? state.enderecoPersonalizadoAtivo;
      payload[CONFIG.fields.servicoPassageiro.endereco] = sharedAddress ? "" : (item.enderecoSaidaBD || "");
    }
    return payload;
  }

  function uniquePassengerRelationItems(passengers) {
    const byPassengerId = new Map();
    (passengers || []).forEach((item) => {
      const passengerId = cleanGuid(item?.guid || item?.passageiro?.id || "");
      if (!passengerId) return;
      const existing = byPassengerId.get(passengerId);
      if (!existing) {
        byPassengerId.set(passengerId, {
          ...item,
          guid: passengerId
        });
        return;
      }
      const currentAddress = String(existing.enderecoSaidaBD || "").trim();
      const nextAddress = String(item.enderecoSaidaBD || "").trim();
      if (nextAddress && !currentAddress.includes(nextAddress)) {
        existing.enderecoSaidaBD = [currentAddress, nextAddress].filter(Boolean).join(" / ");
      }
    });
    return Array.from(byPassengerId.values()).map((item, index) => ({
      ...item,
      ordem: index + 1
    }));
  }

  async function replacePassengerRelations(reservaId, passengers, context, includeAddress, removeExisting) {
    const relationPassengers = uniquePassengerRelationItems(passengers);
    if (!relationPassengers.length) return;
    if (!state.xrm || state.mockMode) {
      replaceMockRelations(reservaId, relationPassengers, includeAddress);
      return;
    }

    if (removeExisting) {
      const existing = await retrieveAll(
        CONFIG.entities.servicoPassageiro,
        `?$select=${CONFIG.fields.servicoPassageiro.id},_cr40f_bancodedados_value&$filter=_cr40f_geral_value eq ${reservaId}`
      );
      const existingByPassengerId = new Map();
      existing.forEach((row) => {
        const passengerId = cleanGuid(row._cr40f_bancodedados_value);
        if (!passengerId) return;
        if (!existingByPassengerId.has(passengerId)) {
          existingByPassengerId.set(passengerId, []);
        }
        existingByPassengerId.get(passengerId).push(row);
      });

      const usedRelationIds = new Set();
      await Promise.all(relationPassengers.map((item) => {
        const passengerId = cleanGuid(item.guid);
        const bucket = passengerId ? existingByPassengerId.get(passengerId) : null;
        const current = bucket?.shift();
        if (!current) {
          return state.xrm.WebApi.createRecord(
            CONFIG.entities.servicoPassageiro,
            buildPassengerRelationPayload(reservaId, item, context, includeAddress, true)
          );
        }
        const relationId = cleanGuid(current[CONFIG.fields.servicoPassageiro.id]);
        usedRelationIds.add(relationId);
        return state.xrm.WebApi.updateRecord(
          CONFIG.entities.servicoPassageiro,
          relationId,
          buildPassengerRelationPayload(reservaId, item, context, includeAddress, false)
        );
      }));

      await Promise.all(existing
        .filter((row) => !usedRelationIds.has(cleanGuid(row[CONFIG.fields.servicoPassageiro.id])))
        .map((row) => state.xrm.WebApi.deleteRecord(
          CONFIG.entities.servicoPassageiro,
          row[CONFIG.fields.servicoPassageiro.id]
        )));
      return;
    }

    await Promise.all(relationPassengers.map((item) => (
      state.xrm.WebApi.createRecord(
        CONFIG.entities.servicoPassageiro,
        buildPassengerRelationPayload(reservaId, item, context, includeAddress, true)
      )
    )));
  }

  function setChoice(payload, field, value) {
    if (value === "" || value === null || value === undefined) return;
    const numeric = Number(value);
    payload[field] = Number.isFinite(numeric) ? numeric : value;
  }

  function bindLookup(payload, navName, entitySet, id) {
    if (!id) return;
    payload[`${navName}@odata.bind`] = `/${entitySet}(${cleanGuid(id)})`;
  }

  function resetAfterSuccess() {
    if (!state.isNew) return;
    state.enderecoPersonalizadoAtivo = false;
    state.selectedPassengers = [];
    state.scheduleDrafts = [];
    state.enderecoRascunho = [];
    state.activationDraftEditState = { return: false, repeat: false };
    state.obs = { motorista: "", interna: "", final: "", passageiro: "" };
    state.obsRet = { motorista: "", interna: "", final: "", passageiro: "" };
    state.obsAtual = "motorista";
    state.retObsAtual = "motorista";
    [
      el.trajeto,
      el.observacao,
      el.cotacao,
      el.cr,
      el.destino,
      el.retornoEndereco,
      el.retornoDestino,
      el.retornoObservacao,
      el.retornoData,
      el.retPrevDateTime,
      el.frequenteInicio,
      el.frequenteFim,
      el.enderecoPersonalizado
    ].forEach((input) => {
      setFieldValue(input, "");
    });
    [
      el.tipoServico,
      el.tipoVeiculo,
      el.motorista,
      el.formaPagamento,
      el.cliente,
      el.solicitante,
      el.op,
      el.retornoHora,
      el.retornoMinuto,
      el.frequenteTipo
    ].forEach((select) => {
      setSelectValue(select, "");
    });
    [el.agendarRetorno, el.repetirServico, el.receber, el.receberRetorno].forEach((input) => {
      setFieldValue(input, false);
    });
    setFieldValue(el.contabilizarFds, true);
    clearPassengerCreateForm();
    closePassengerPicker();
    closePassengerEditPopup();
    clearValidationStates();
    hydrateForm();
    renderScheduleDrafts();
    renderPassengers();
    renderRiskPanel();
    renderTabBadges();
    setTab("details");
  }

  function buildRetornoPrevisto(baseDateTime) {
    const explicitRetorno = parseDateTimeInputValue(el.retPrevDateTime?.value);
    if (explicitRetorno) return explicitRetorno;
    if (!baseDateTime || !el.retPrevHora.value || !el.retPrevMinuto.value) return null;
    const saidaTime = timeFromParts(el.saidaHora.value, el.saidaMinuto.value);
    const retornoTime = timeFromParts(el.retPrevHora.value, el.retPrevMinuto.value);
    const base = new Date(baseDateTime);
    if (retornoTime.minutesTotal < saidaTime.minutesTotal) base.setDate(base.getDate() + 1);
    return withClock(base, retornoTime.hours, retornoTime.minutes);
  }

  function buildRecurringRetornoPrevisto(context, baseDateTime) {
    if (!baseDateTime || !el.retPrevHora.value || !el.retPrevMinuto.value) return null;
    const saidaTime = timeFromParts(el.saidaHora.value, el.saidaMinuto.value);
    const retornoTime = timeFromParts(el.retPrevHora.value, el.retPrevMinuto.value);
    const base = new Date(baseDateTime);
    const explicitRetorno = parseDateTimeInputValue(el.retPrevDateTime?.value);
    let dayOffsetApplied = false;
    if (explicitRetorno && context?.dataHoraPrincipal) {
      const principalDay = new Date(context.dataHoraPrincipal);
      const retornoDay = new Date(explicitRetorno);
      principalDay.setHours(0, 0, 0, 0);
      retornoDay.setHours(0, 0, 0, 0);
      const dayOffset = Math.round((retornoDay.getTime() - principalDay.getTime()) / 86400000);
      if (dayOffset > 0) {
        base.setDate(base.getDate() + dayOffset);
        dayOffsetApplied = true;
      }
    }
    if (!dayOffsetApplied && retornoTime.minutesTotal < saidaTime.minutesTotal) {
      base.setDate(base.getDate() + 1);
    }
    return withClock(base, retornoTime.hours, retornoTime.minutes);
  }

  function combineDateTime(dateValue, hourValue, minuteValue) {
    const parsed = parseDateTimeInputValue(dateValue);
    if (parsed) return parsed;
    if (!dateValue || hourValue === "" || minuteValue === "") return null;
    const [year, month, day] = dateValue.split("-").map(Number);
    return new Date(year, month - 1, day, Number(hourValue), Number(minuteValue), 0, 0);
  }

  function setDateTimeFields(date, dateInput, hourSelect, minuteSelect, allowBlank = false) {
    if (!dateInput) return;
    dateInput.value = date && !Number.isNaN(date.getTime()) ? toDateTimeLocalInput(date) : "";
    setTimeFields(date, hourSelect, minuteSelect, allowBlank);
  }

  function setTimeFields(date, hourSelect, minuteSelect, allowBlank) {
    if (!date || Number.isNaN(date.getTime())) {
      hourSelect.value = allowBlank ? "" : "00";
      minuteSelect.value = allowBlank ? "" : "00";
      return;
    }
    hourSelect.value = String(date.getHours()).padStart(2, "0");
    minuteSelect.value = String(Math.min(55, Math.floor(date.getMinutes() / 5) * 5)).padStart(2, "0");
  }

  function timeFromParts(hour, minute) {
    const hours = Number(hour || 0);
    const minutes = Number(minute || 0);
    return { hours, minutes, minutesTotal: hours * 60 + minutes };
  }

  function withTime(date, timeSource) {
    return withClock(date, timeSource.getHours(), timeSource.getMinutes());
  }

  function withClock(date, hours, minutes) {
    const next = new Date(date);
    next.setHours(hours, minutes, 0, 0);
    return next;
  }

  function generateFrequentDates(startValue, endValue, includeWeekends) {
    const start = new Date(`${startValue}T00:00:00`);
    const end = new Date(`${endValue}T00:00:00`);
    const dates = [];
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const day = date.getDay();
      if (includeWeekends || (day !== 0 && day !== 6)) dates.push(new Date(date));
    }
    return dates;
  }

  function composeEnderecoCompleto() {
    if (state.enderecoPersonalizadoAtivo) return el.enderecoPersonalizado.value.trim();
    return getValidPassengerRows()
      .sort((a, b) => a.ordem - b.ordem)
      .map((item) => `${item.ordem}. ${firstName(item.passageiro?.label) || `Passageiro ${item.ordem}`} - ${getDraftAddress(item.ordem) || item.enderecoEditado || "indeterminado"}`)
      .join(";\n");
  }

  function composeEnderecoCompletoInvertido() {
    const rows = getValidPassengerRows().sort((a, b) => b.ordem - a.ordem);
    const total = rows.length;
    return rows
      .map((item, index) => {
        const ordemExibicao = index + 1;
        return `${ordemExibicao}. ${firstName(item.passageiro?.label) || `Passageiro ${total - index}`} - ${getDraftAddress(item.ordem) || item.enderecoEditado || "indeterminado"}`;
      })
      .join(";\n");
  }

  function composePassageirosTelefones() {
    return getValidPassengerRows()
      .sort((a, b) => a.ordem - b.ordem)
      .map((item) => `${item.passageiro.label} - ${item.telefone || item.passageiro.telefone || "indeterminado"}`)
      .join(";\n");
  }

  function composePreferencias() {
    return getValidPassengerRows()
      .sort((a, b) => a.ordem - b.ordem)
      .filter((item) => (item.passageiro?.preferencias || "").trim())
      .map((item) => `${firstName(item.passageiro.label) || item.passageiro.label} - ${item.passageiro.preferencias.trim()}`)
      .join(";\n");
  }

  function firstPassengerValue(key) {
    const row = getValidPassengerRows().find((item) => item.passageiro?.[key]);
    return row?.passageiro?.[key] || "";
  }

  function getValidPassengerRows() {
    return state.selectedPassengers.filter((item) => item.guid && item.passageiro);
  }

  function hasDuplicatePassengers() {
    const ids = getValidPassengerRows().map((item) => cleanGuid(item.guid).toLowerCase());
    return new Set(ids).size !== ids.length;
  }

  function invertTrajeto(trajeto) {
    const parts = String(trajeto || "").split(" / ").map((part) => part.trim()).filter(Boolean);
    return parts.length >= 2 ? parts.reverse().join(" / ") : trajeto;
  }

  function firstName(name) {
    return String(name || "").trim().split(/\s+/)[0] || "";
  }

  function setSelectValue(select, value, fallback = "") {
    if (!select) return;
    if (!select.options) {
      select.value = value ?? fallback ?? "";
      return;
    }
    const stringValue = value === null || value === undefined ? "" : String(value);
    if (stringValue && [...select.options].some((option) => option.value === stringValue)) {
      select.value = stringValue;
      refreshCustomSelect(select);
      return;
    }
    select.value = fallback && [...select.options].some((option) => option.value === String(fallback)) ? String(fallback) : "";
    refreshCustomSelect(select);
  }

  function focusInvalidField(message) {
    const text = normalize(String(message || "")).replace(/\s+/g, " ");
    const revealed = revealInvalidFieldByMessage(text, message);
    if (revealed) return;
    if (text.includes("agendamento")) {
      focusField(el.scheduleDraftRows);
      return;
    }
    if (text.includes("horário") && text.includes("saída")) {
      focusField(el.saidaData);
      return;
    }
    if (text.includes("tipo do serviço")) {
      focusField(el.tipoServico);
      return;
    }
    if (text.includes("tipo do veiculo")) {
      focusField(el.tipoVeiculo);
      return;
    }
    if (text.includes("trajeto")) {
      focusField(el.trajeto);
      return;
    }
    if (text.includes("pelo menos um passageiro")) {
      if (el.addPassenger) {
        el.addPassenger.focus();
      } else {
        focusField(el.passengerRows);
      }
      return;
    }
    if (text.includes("endereço de saída")) {
      if (el.enderecoPersonalizadoAtivo && el.enderecoPersonalizado) {
        focusField(el.enderecoPersonalizado);
      } else if (state.selectedPassengers?.length) {
        focusField(el.passengerRows);
      } else {
        focusField(el.trajeto);
      }
      return;
    }
    if (text.includes("destino")) {
      focusField(el.destino);
      return;
    }
    if (text.includes("data de retorno") || text.includes("destino - retorno")) {
      focusField(el.retornoData);
      return;
    }
    if (text.includes("data de início") || text.includes("data de fim")) {
      focusField(el.frequenteInicio);
      return;
    }
    if (text.includes("tipo de serviço frequente") || text.includes("tipo de serviço frequente")) {
      focusField(el.frequenteTipo);
      return;
    }
  }

  function revealInvalidFieldByMessage(text, message) {
    if (text.includes("agendamento")) {
      revealInvalidField(el.scheduleDraftRows, message, { tab: "repeat" });
      return true;
    }
    if (text.includes("horario") && text.includes("saida")) {
      revealInvalidField(el.saidaData, message, { related: [el.saidaHora, el.saidaMinuto] });
      return true;
    }
    if (text.includes("tipo do servico")) {
      revealInvalidField(el.tipoServico, message);
      return true;
    }
    if (text.includes("tipo do veiculo")) {
      revealInvalidField(el.tipoVeiculo, message);
      return true;
    }
    if (text.includes("trajeto")) {
      revealInvalidField(el.trajeto, message);
      return true;
    }
    if (text.includes("pelo menos um passageiro")) {
      revealInvalidField(el.passengerBlock || el.passengerRows || el.addPassenger, message);
      return true;
    }
    if (text.includes("endereco de saida")) {
      if (state.enderecoPersonalizadoAtivo && el.enderecoPersonalizado) {
        revealInvalidField(el.enderecoPersonalizado, message);
        return true;
      }
      if (state.selectedPassengers?.length) {
        const row = [...(el.passengerRows?.querySelectorAll(".passenger-row") || [])]
          .find((item) => {
            const ordem = Number(item.dataset.ordem || 0);
            const selected = state.selectedPassengers.find((passenger) => passenger.ordem === ordem);
            return selected && !(getDraftAddress(ordem) || selected.enderecoEditado || "");
          });
        revealInvalidField(row?.querySelector(".passenger-address") || el.passengerRows, message);
        return true;
      }
      revealInvalidField(el.trajeto, message);
      return true;
    }
    if (text.includes("data de retorno")) {
      revealInvalidField(el.retornoData, message, { tab: "return", related: [el.retornoHora, el.retornoMinuto] });
      return true;
    }
    if (text.includes("destino - retorno")) {
      revealInvalidField(el.retornoDestino, message, { tab: "return" });
      return true;
    }
    if (text.includes("destino")) {
      revealInvalidField(el.destino, message);
      return true;
    }
    if (text.includes("cliente")) {
      revealInvalidField(el.cliente, message);
      return true;
    }
    if (text.includes("solicitante")) {
      revealInvalidField(el.solicitante, message);
      return true;
    }
    if (text.includes("data de inicio") || text.includes("data de fim")) {
      revealInvalidField(el.frequenteInicio, message, { tab: "repeat", related: [el.frequenteFim] });
      return true;
    }
    if (text.includes("data final")) {
      revealInvalidField(el.frequenteFim, message, { tab: "repeat", related: [el.frequenteInicio] });
      return true;
    }
    if (text.includes("tipo de servico frequente")) {
      revealInvalidField(el.frequenteTipo, message, { tab: "repeat" });
      return true;
    }
    return false;
  }

  function revealInvalidField(element, message, options = {}) {
    const target = element || document.querySelector(".panel.is-active .field");
    const related = [target, ...(options.related || [])].filter(Boolean);
    const tab = options.tab || tabForElement(target);
    if (tab && state.currentTab !== tab) setTab(tab);
    related.forEach((item) => markFieldInvalid(item, message));
    window.setTimeout(() => {
      const scrollTarget = getValidationShell(target);
      scrollTarget?.scrollIntoView?.({ behavior: "smooth", block: "center", inline: "nearest" });
      window.setTimeout(() => focusField(target), 180);
    }, 40);
  }

  function markFieldInvalid(element, message) {
    if (!element) return;
    const shell = getValidationShell(element);
    if (shell) {
      shell.classList.add("is-invalid");
      shell.dataset.validationMessage = message || "Campo obrigatorio.";
    }
    const control = getValidationControl(element);
    control?.setAttribute?.("aria-invalid", "true");
    const custom = customSelectRoots.get(control);
    custom?.trigger?.setAttribute("aria-invalid", "true");
  }

  function clearFieldValidation(element) {
    if (!element) return;
    const shell = getValidationShell(element);
    shell?.classList?.remove("is-invalid");
    if (shell?.dataset) delete shell.dataset.validationMessage;
    const control = getValidationControl(element);
    control?.removeAttribute?.("aria-invalid");
    const custom = customSelectRoots.get(control);
    custom?.trigger?.removeAttribute("aria-invalid");
  }

  function clearValidationStates() {
    document.querySelectorAll(".is-invalid").forEach((item) => {
      item.classList.remove("is-invalid");
      if (item.dataset) delete item.dataset.validationMessage;
    });
    document.querySelectorAll("[aria-invalid='true']").forEach((item) => item.removeAttribute("aria-invalid"));
  }

  function getValidationShell(element) {
    if (!element) return null;
    return element.closest?.(".field, .passenger-row, .passenger-block, .schedule-draft") || element;
  }

  function getValidationControl(element) {
    if (!element) return null;
    if (element.matches?.("input, select, textarea, button")) return element;
    return element.querySelector?.("input, select, textarea, button") || null;
  }

  function tabForElement(element) {
    return element?.closest?.(".panel")?.dataset?.panel || "";
  }

  function focusField(element) {
    if (!element) return;
    const state = customSelectRoots.get(element);
    if (state && state.trigger) {
      state.trigger.focus();
      return;
    }
    try {
      element.focus();
      return;
    } catch (_) {
      // noop
    }
  }

  function applyPassengerEditEmptySignals() {
    if (!el.passengerEditFields || !el.passengerEditFields.childElementCount) return;
    const rows = el.passengerEditFields.querySelectorAll(".passenger-edit-field");
    rows.forEach((row) => {
      const controls = row.querySelectorAll(
        "input.passenger-edit-control:not([type='checkbox']), " +
          "textarea.passenger-edit-control, " +
          "select.passenger-edit-control, " +
          ".custom-select-trigger"
      );
      if (!controls.length) return;
      let allEmpty = true;
      controls.forEach((control) => {
        const empty = isPassengerEditControlEmpty(control);
        control.classList.toggle("is-empty", empty);
        if (!empty) allEmpty = false;
      });
      row.classList.toggle("is-empty", allEmpty);
    });
  }

  function isPassengerEditControlEmpty(control) {
    if (control.matches(".custom-select-trigger")) {
      const root = control.closest(".custom-select");
      const source = root ? root.querySelector("select") : null;
      if (!source) return false;
      return String(source.value || "").trim().length === 0;
    }
    if (!control) return true;
    if (control.tagName === "SELECT") {
      return String(control.value || "").trim().length === 0;
    }
    return String(control.value || "").trim().length === 0;
  }

  function findOptionValue(key, label) {
    const wanted = normalize(label);
    return state.options[key].find((item) => normalize(item.label) === wanted)?.value || "";
  }

  function optionLabel(key, value) {
    return state.options[key].find((item) => String(item.value) === String(value))?.label || "";
  }

  async function copyTextToClipboard(value) {
    const text = String(value || "").trim();
    if (!text) return;
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        console.warn("Clipboard API indisponível, usando fallback", error);
      }
    }
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "readonly");
    input.style.position = "fixed";
    input.style.opacity = "0";
    input.style.pointerEvents = "none";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    if (!copied) throw new Error("Fallback de cópia recusado pelo navegador.");
  }

  function clearCopyNotice() {
    document.querySelectorAll(".copy-notice").forEach((node) => node.remove());
  }

  function showCopyNotice(anchor, message, isError = false) {
    if (!anchor?.getBoundingClientRect) return;
    clearCopyNotice();
    const range = document.createRange();
    range.selectNodeContents(anchor);
    const rects = [...range.getClientRects()].filter((item) => item.width || item.height);
    const textRect = rects[rects.length - 1] || anchor.getBoundingClientRect();
    const notice = document.createElement("div");
    notice.className = `copy-notice${isError ? " is-error" : ""}`;
    notice.textContent = message;
    document.body.appendChild(notice);

    const gap = 6;
    const width = notice.offsetWidth || 72;
    const height = notice.offsetHeight || 22;
    const preferredLeft = textRect.right + gap;
    const fallbackLeft = textRect.left - width - gap;
    const left = preferredLeft + width + 12 <= window.innerWidth
      ? preferredLeft
      : Math.max(12, fallbackLeft);
    const top = Math.max(12, Math.min(textRect.top + (textRect.height - height) / 2, window.innerHeight - height - 12));

    notice.style.left = `${left}px`;
    notice.style.top = `${top}px`;

    requestAnimationFrame(() => {
      notice.classList.add("is-visible");
    });

    window.setTimeout(() => {
      if (!notice.isConnected) return;
      notice.classList.remove("is-visible");
      window.setTimeout(() => notice.remove(), 180);
    }, 900);
  }

  function sameId(a, b) {
    return cleanGuid(a).toLowerCase() === cleanGuid(b).toLowerCase();
  }

  function syncAllDateTimeInputs() {
    syncLegacyTimePartsFromDateTime(el.saidaData, el.saidaHora, el.saidaMinuto);
    syncLegacyTimePartsFromDateTime(el.retornoData, el.retornoHora, el.retornoMinuto);
    syncLegacyTimePartsFromDateTime(el.retPrevDateTime, el.retPrevHora, el.retPrevMinuto);
  }

  function syncDateTimeFieldRowWidths() {
    const containers = [...document.querySelectorAll(".form-grid")];
    containers.forEach((container) => {
      const items = [...container.children]
        .filter((node) => node instanceof HTMLElement)
        .filter((node) => !node.hidden && node.offsetParent !== null);

      items.forEach((node) => node.classList.remove("is-row-alone"));
      if (!items.length) return;

      const rows = [];
      items.forEach((node) => {
        const top = node.offsetTop;
        const row = rows.find((entry) => Math.abs(entry.top - top) <= 2);
        if (row) {
          row.items.push(node);
          return;
        }
        rows.push({ top, items: [node] });
      });

      rows.forEach((row) => {
        if (row.items.length !== 1) return;
        const [onlyItem] = row.items;
        if (!onlyItem.classList.contains("datetime-field")) return;
        onlyItem.classList.add("is-row-alone");
      });
    });
  }

  function syncLegacyTimePartsFromDateTime(dateTimeInput, hourInput, minuteInput) {
    const date = parseDateTimeInputValue(dateTimeInput?.value);
    if (!date) {
      if (hourInput) hourInput.value = "";
      if (minuteInput) minuteInput.value = "";
      return;
    }
    if (hourInput) hourInput.value = String(date.getHours()).padStart(2, "0");
    if (minuteInput) minuteInput.value = String(Math.min(55, Math.floor(date.getMinutes() / 5) * 5)).padStart(2, "0");
  }

  function parseDateTimeInputValue(value) {
    const text = String(value || "").trim();
    if (!text || !text.includes("T")) return null;
    const [datePart, timePart = ""] = text.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour = 0, minute = 0] = timePart.split(":").map(Number);
    if (![year, month, day, hour, minute].every(Number.isFinite)) return null;
    const date = new Date(year, month - 1, day, hour, minute, 0, 0);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function datePartFromInputValue(value) {
    const text = String(value || "").trim();
    return text.includes("T") ? text.slice(0, 10) : text;
  }

  function timePartFromInputValue(value) {
    const text = String(value || "").trim();
    if (!text.includes("T")) return text;
    return text.slice(11, 16);
  }

  function dateTimeLocalFromParts(dateValue, hourValue, minuteValue) {
    const datePart = datePartFromInputValue(dateValue);
    if (!datePart || !hourValue || !minuteValue) return "";
    return `${datePart}T${String(hourValue).padStart(2, "0")}:${String(minuteValue).padStart(2, "0")}`;
  }

  function importedTrechoDateTimeLocal(trecho) {
    return dateTimeLocalFromParts(trecho?.dataIso, ...String(trecho?.horario || "").split(":"));
  }

  function importedTrechoReturnDateTimeLocal(trecho) {
    return dateTimeLocalFromParts(
      trecho?.retornoPrevistoDataIso || trecho?.dataIso,
      ...String(trecho?.retornoPrevistoHorario || "").split(":")
    );
  }

  function syncScheduleDateTimeFields(item) {
    if (!item) return;
    item.dataHora = item.dataHora || dateTimeLocalFromParts(item.data, item.hora, item.minuto);
    item.data = datePartFromInputValue(item.dataHora || item.data);
    const [hour = "", minute = ""] = timePartFromInputValue(item.dataHora || "").split(":");
    if (hour) item.hora = hour;
    if (minute) item.minuto = minute;
    item.retPrevDateTime = item.retPrevDateTime || dateTimeLocalFromParts(item.data || datePartFromInputValue(item.dataHora), item.retPrevHora, item.retPrevMinuto);
    const [retHour = "", retMinute = ""] = timePartFromInputValue(item.retPrevDateTime || "").split(":");
    if (retHour) item.retPrevHora = retHour;
    if (retMinute) item.retPrevMinuto = retMinute;
  }

  function isGuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanGuid(value));
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function parseNumber(value) {
    if (value === "" || value === null || value === undefined) return null;
    const raw = String(value)
      .replace(/[^\d,.-]/g, "")
      .trim();
    const lastComma = raw.lastIndexOf(",");
    const lastDot = raw.lastIndexOf(".");
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const hasDecimalSeparator = decimalSeparator === ","
      ? lastComma >= 0
      : lastDot >= 0 && raw.length - lastDot - 1 !== 3;
    const cleaned = hasDecimalSeparator
      ? raw
        .replace(new RegExp(`\\${decimalSeparator === "," ? "." : ","}`, "g"), "")
        .replace(decimalSeparator, ".")
      : raw.replace(/[.,]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function sanitizeCurrencyInput(value) {
    return String(value || "")
      .replace(/[^\d,.-]/g, "")
      .replace(/\.(?=\d{3}(?:\D|$))/g, "")
      .replace(/(,.*),/g, "$1")
      .replace(/(\..*)\./g, "$1");
  }

  function formatCurrencyDisplayValue(value) {
    const parsed = parseNumber(value);
    if (parsed === null) return "";
    return parsed.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function validateEmailControl(input, options = {}) {
    if (!input || !input.value.trim()) {
      clearFieldValidation(input);
      return true;
    }
    if (input.checkValidity()) {
      clearFieldValidation(input);
      return true;
    }
    revealInvalidField(input, "Informe um email valido.", options);
    return false;
  }

  function validatePhoneControl(input, options = {}) {
    if (!input || !input.value.trim()) {
      clearFieldValidation(input);
      return true;
    }
    const previousCountryCode = input === el.bdTelefone ? selectedPhoneCountryCode() : "";
    const parsed = input === el.bdTelefone
      ? parsePhoneNumberForInput(input.value, previousCountryCode, {
        manualCountry: input.dataset.phoneCountryManual === "1"
      })
      : parsePhoneNumber(input.value);
    input.value = parsed.formatted;
    if (input === el.bdTelefone && parsed.countryCode && parsed.countryCode !== previousCountryCode) {
      delete input.dataset.phoneCountryManual;
    }
    syncPhoneCountryFromParsed(parsed, { refreshDisplay: input === el.bdTelefone });
    updatePhoneCountryHint(input, parsed);
    if (parsed.isValid) {
      clearFieldValidation(input);
      return true;
    }
    revealInvalidField(input, parsed.message || "Telefone invalido.", options);
    return false;
  }

  function updatePhoneCountryHint(input, parsed = null) {
    if (!input) return;
    const result = parsed || parsePhoneNumber(input.value, input === el.bdTelefone ? selectedPhoneCountryCode() : "");
    if (!result.digits) {
      delete input.dataset.phoneCountry;
      return;
    }
    input.dataset.phoneCountry = result.countryName || "";
    syncPhoneCountryFromParsed(result, { refreshDisplay: input === el.bdTelefone });
  }

  function toDateInput(date) {
    if (!date || Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function toDateTimeLocalInput(date) {
    if (!date || Number.isNaN(date.getTime())) return "";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(Math.min(55, Math.floor(date.getMinutes() / 5) * 5)).padStart(2, "0");
    return `${toDateInput(date)}T${hours}:${minutes}`;
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function setLoading(value) {
    state.loading = value;
    el.loading.hidden = !value;
    el.saveButton.disabled = value;
  }

  function showSuccess(message) {
    el.successMessage.textContent = message;
    el.success.hidden = false;
  }

  function toast(message, type = "info", timeout = 5000, anchor = null) {
    const item = document.createElement("div");
    item.className = `toast ${type}`;

    const msg = document.createElement("span");
    msg.className = "toast-message";
    msg.textContent = message;

    const close = document.createElement("button");
    close.className = "toast-close";
    close.type = "button";
    close.setAttribute("aria-label", "Fechar notificação");
    close.textContent = "×";
    close?.addEventListener("click", () => item.remove());

    item.append(msg, close);
    if (anchor && Number.isFinite(anchor.clientX) && Number.isFinite(anchor.clientY)) {
      item.classList.add("toast-floating");
      item.style.left = `${Math.max(12, anchor.clientX + 14)}px`;
      item.style.top = `${Math.max(12, anchor.clientY - 18)}px`;
      document.body.appendChild(item);
    } else {
      el.toastStack.appendChild(item);
    }
    window.setTimeout(() => item.remove(), timeout);
  }

  init().catch((error) => {
    console.error(error);
    setLoading(false);
    toast(error.message || "Falha ao iniciar formulário.", "error", 9000);
  });
})();
