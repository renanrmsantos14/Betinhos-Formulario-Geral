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
        formaPagamento: "cr40f_formadepagamento"
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
        nome: "cr40f_nomecompleto"
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
    }
  };

  const URL_PARAMS = new URLSearchParams(window.location.search);
  const QUERY_MOCK_MODE = (URL_PARAMS.get("mock") === "1" || URL_PARAMS.get("mockData") === "1");
  const MOCK_STORE_KEY = "formulario_geral_mock_db_v1";
  const DRAFT_STORE_KEY = "formulario_geral_draft_v1";
  const PASSENGER_RECENCY_KEY = "formulario_geral_passenger_recency_v1";
  const BRAND_LOGO_WEBRESOURCE = "cr40f_LogoBetinhosB";
  const MIN_PASSENGER_SEARCH_LENGTH = 2;
  const MAX_FREQUENT_SERVICE_DAYS = 90;
  const MAX_FREQUENT_SERVICE_RECORDS = 120;

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
    recordIdBox: $("recordIdBox"),
    recordIdText: $("recordIdText"),
    tabs: [...document.querySelectorAll(".tab")],
    panels: [...document.querySelectorAll(".panel")],
    statusOperacao: $("statusOperacao"),
    statusFaturamento: $("statusFaturamento"),
    saidaData: $("saidaData"),
    saidaHora: $("saidaHora"),
    saidaMinuto: $("saidaMinuto"),
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
    createPassenger: $("createPassenger"),
    agendarRetorno: $("agendarRetorno"),
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
    saveLog: [],
    draftTimer: null,
    draftRestoring: false,
    lastDraftSavedAt: null
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
  let passengerEditEnabled = false;
  let passengerEditStatusTimer = null;
  const passengerEditSaveTimers = new Map();
  let passengerMatchResolve = null;
  let passengerMatchCandidates = [];

  state.mockMode = QUERY_MOCK_MODE || state.xrm === null;

  async function init() {
    state.isNew = !state.recordId;
    setLoading(true);
    applyBrandLogo();
    bindStaticEvents();
    populateTimeSelects();
    loadPassengerSelectionRecency();
    await loadReferenceData();
    await loadCurrentRecord();
    hydrateForm();
    renderAll();
    await restoreDraftSnapshot();
    initializeCustomSelects();
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

  function getRecordIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const direct = params.get("id") || params.get("recordId") || params.get("recordid");
    if (direct) return cleanGuid(direct);
    const data = params.get("data");
    if (!data) return "";
    try {
      const decoded = JSON.parse(decodeURIComponent(data));
      return cleanGuid(decoded.id || decoded.recordId || "");
    } catch (_) {
      return "";
    }
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
    el.closeSuccess?.addEventListener("click", () => {
      el.success.hidden = true;
    });
    el.saveButton?.addEventListener("click", saveForm);
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
    el.saidaData?.addEventListener("change", syncRepeatDefaultDates);
    el.saidaHora?.addEventListener("change", syncReturnDefaults);
    el.saidaMinuto?.addEventListener("change", syncReturnDefaults);
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
    bindInputFormatters();
    const appRoot = $("app");
    appRoot?.addEventListener("input", handleOperationalInput);
    appRoot?.addEventListener("change", handleOperationalInput);
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
    if (select.dataset.selectVariant) {
      wrapper.classList.add(`custom-select--${select.dataset.selectVariant}`);
    }

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "custom-select-trigger";
    trigger.setAttribute("aria-expanded", "false");

    const triggerText = document.createElement("span");
    triggerText.className = "custom-select-value";
    if (select.dataset.selectVariant === "phone-country") {
      triggerText.classList.add("custom-select-value--phone-country");
    }

    const triggerCaret = document.createElement("span");
    triggerCaret.className = "custom-select-caret";
    trigger.append(triggerText, triggerCaret);

    const panel = document.createElement("div");
    panel.className = "custom-select-panel";
    if (select.dataset.selectVariant) {
      panel.classList.add(`custom-select-panel--${select.dataset.selectVariant}`);
    }
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

    const { select: nativeSelect, triggerText, trigger, panel } = state;
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
    trigger.disabled = nativeSelect.disabled;
    renderCustomSelectOptions(select, state.searchInput?.value || "");
    panel.classList.toggle("is-disabled", nativeSelect.disabled);
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

    const options = Array.from(nativeSelect.options || []);
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
      if (nativeSelect.dataset.selectVariant) {
        button.classList.add(`custom-select-option--${nativeSelect.dataset.selectVariant}`);
      }
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
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const safeInset = 8;
    const availableWidth = Math.max(120, viewportWidth - safeInset * 2);
    const minWidth = state.select?.dataset?.selectVariant === "phone-country" ? 280 : 140;
    const desiredWidth = Math.max(minWidth, Math.ceil(rect.width || state.trigger.offsetWidth || 120));
    const width = Math.max(120, Math.min(availableWidth, desiredWidth));
    const maxHeight = Math.min(260, Math.max(120, Math.floor(viewportHeight * 0.42)));
    const spaceBelow = viewportHeight - rect.bottom - safeInset;
    const spaceAbove = rect.top - safeInset;
    const menuHeight = Math.min(maxHeight, Math.max(80, state.panel.scrollHeight || 0));
    const showAbove = spaceBelow < Math.min(maxHeight, 180) && spaceAbove > spaceBelow;
    const top = showAbove
      ? Math.max(safeInset, rect.top - menuHeight - safeInset)
      : Math.min(viewportHeight - menuHeight - safeInset, rect.bottom + safeInset);

    const safeLeft = Math.max(safeInset, Math.min(rect.left, viewportWidth - width - safeInset));

    state.panel.style.left = `${safeLeft}px`;
    state.panel.style.top = `${Math.max(safeInset, top)}px`;
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
    const [clientes, motoristas, ops] = await Promise.all([
      retrieveAll(CONFIG.entities.cliente, `?$select=${f.cliente.id},${f.cliente.nome}&$orderby=${f.cliente.nome} asc&$top=5000`),
      retrieveAll(CONFIG.entities.funcionario, `?$select=${f.funcionario.id},${f.funcionario.nome}&$orderby=${f.funcionario.nome} asc&$top=5000`),
      retrieveAll(CONFIG.entities.financeiro, `?$select=${f.financeiro.id},${f.financeiro.label},createdon&$orderby=createdon desc&$top=500`)
    ]);

    state.passageiros = [];
    state.clientes = clientes.map((r) => ({
      id: r[f.cliente.id],
      label: r[f.cliente.nome] || "(cliente)"
    }));
    state.motoristas = motoristas.map((r) => ({
      id: r[f.funcionario.id],
      label: r[f.funcionario.nome] || "(motorista)"
    }));
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
    if (normalize(search).length < MIN_PASSENGER_SEARCH_LENGTH) return [];

    const f = CONFIG.fields.passageiro;
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

  function getCustomSelectDisplayText(option, select = null) {
    if (!option) return "";
    if (option.dataset?.flag && option.dataset?.name) {
      if (select?.dataset?.selectVariant === "phone-country") {
        return `${option.dataset.flag} +${option.value}`;
      }
      return `${option.dataset.flag} ${option.dataset.name} +${option.value}`;
    }
    return option.textContent.trim();
  }

  function renderCustomSelectOptionContent(button, option) {
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
    state.passageiros = uniquePassengersById(state.passageiros.map(normalizeMockPassengerChoices));
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
        return { reservas: [], relacoes: [] };
      }
      const parsed = JSON.parse(raw);
      return {
        reservas: Array.isArray(parsed?.reservas) ? parsed.reservas : [],
        relacoes: Array.isArray(parsed?.relacoes) ? parsed.relacoes : []
      };
    } catch (error) {
      console.warn("Falha ao ler mock db", error);
      return { reservas: [], relacoes: [] };
    }
  }

  function setMockDb(next) {
    localStorage.setItem(MOCK_STORE_KEY, JSON.stringify(next));
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
    db.relacoes = db.relacoes.filter((item) => !sameId(item.reservaId, reservaId));
    for (const item of passengers) {
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

    state.record = await state.xrm.WebApi.retrieveRecord(CONFIG.entities.reserva, state.recordId, `?$select=${select}`);
    state.relacoes = await retrieveAll(
      CONFIG.entities.servicoPassageiro,
      `?$select=${CONFIG.fields.servicoPassageiro.id},${CONFIG.fields.servicoPassageiro.ordem},${CONFIG.fields.servicoPassageiro.endereco},_cr40f_bancodedados_value&$filter=_cr40f_geral_value eq ${state.recordId}&$orderby=${CONFIG.fields.servicoPassageiro.ordem} asc`
    );
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
    el.saveButtonText.textContent = state.isNew ? "Agendar serviços" : "Salvar edições";
    el.tabBd.hidden = !state.isNew;
    el.tabReturn.hidden = !state.isNew;
    el.tabRepeat.hidden = !state.isNew;
    el.opWrap.hidden = state.isNew;
    el.recordIdBox.hidden = state.isNew;
    el.recordIdText.textContent = r[f.readableId] || "";

    const saida = r[f.dataSaida] ? new Date(r[f.dataSaida]) : null;
    const prevRet = r[f.previsaoRetorno] ? new Date(r[f.previsaoRetorno]) : null;
    setDateTimeFields(saida || new Date(), el.saidaData, el.saidaHora, el.saidaMinuto);
    setTimeFields(prevRet, el.retPrevHora, el.retPrevMinuto, true);

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
    renderChoiceSelect(el.tipoServico, state.options.tipoServico);
    renderChoiceSelect(el.tipoVeiculo, state.options.tipoVeiculo);
    renderChoiceSelect(el.formaPagamento, state.options.formaPagamento);
    renderLookupSelect(el.cliente, state.clientes);
    renderLookupSelect(el.bdCliente, state.clientes);
    renderLookupSelect(el.solicitante, state.passageiros);
    renderLookupSelect(el.motorista, state.motoristas);
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
    const previous = select.value;
    select.innerHTML = '<option value=""></option>';
    rows.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      select.appendChild(option);
    });
    if (previous) select.value = previous;
    if (!select.hidden) {
      ensureCustomSelect(select);
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

  function renderPassengerEditHeader(passenger, preserveStatus = false) {
    if (el.passengerEditTitle) {
      el.passengerEditTitle.textContent = passenger.label || "Passageiro sem nome";
    }
    if (!preserveStatus) {
      setPassengerEditStatus("", "");
    }
  }

  function renderPassengerEditFields(passenger) {
    if (!el.passengerEditFields) return;
    el.passengerEditFields.innerHTML = "";
    const fields = getPassengerEditFields();
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
    if (fieldKey === "cr") control.value = normalizeCodeValue(control.value);
  }

  function schedulePassengerEditSave(fieldKey, control, delay) {
    const existing = passengerEditSaveTimers.get(fieldKey);
    if (existing) window.clearTimeout(existing.timer);
    setPassengerFieldStatus(control, "saving");
    setPassengerEditStatus("Salvando...", "saving");
    const timer = window.setTimeout(() => {
      passengerEditSaveTimers.delete(fieldKey);
      savePassengerEditField(fieldKey, control, activePassengerEditId);
    }, delay);
    passengerEditSaveTimers.set(fieldKey, { timer, fieldKey, control });
  }

  function flushPassengerEditSaves(passengerId) {
    const entries = [...passengerEditSaveTimers.values()];
    passengerEditSaveTimers.clear();
    entries.forEach((entry) => window.clearTimeout(entry.timer));
    entries.forEach((entry) => {
      savePassengerEditField(entry.fieldKey, entry.control, passengerId);
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

  function readPassengerEditControlValue(control, field) {
    if (!control) return "";
    if (field.kind === "text" || field.kind === "textarea") {
      if (field.key === "telefone") return phoneStorageValue(control.value, "");
      if (field.key === "email") return normalizeEmail(control.value);
      if (field.key === "cr") return normalizeCodeValue(control.value);
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
    if (status) row.classList.add(`is-${status}`);
    if (status === "saved") {
      window.setTimeout(() => {
        if (row.isConnected) row.classList.remove("is-saved");
      }, 1200);
    }
  }

  function closePassengerEditPopup() {
    if (activePassengerEditId) {
      flushPassengerEditSaves(activePassengerEditId);
    }
    closeAllCustomSelects();
    if (el.passengerEditOverlay) el.passengerEditOverlay.hidden = true;
    if (el.passengerEditFields) el.passengerEditFields.replaceChildren();
    activePassengerEditId = "";
    passengerEditEnabled = false;
    setPassengerEditStatus("", "");
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
        <label class="field span-2 required">
          <span>Data e horário</span>
          <div class="inline-time">
            <input type="date" data-schedule-field="data">
            <div class="time-group">
              <select data-schedule-field="hora"></select>
              <span class="time-separator">:</span>
              <select data-schedule-field="minuto"></select>
            </div>
          </div>
        </label>
        <label class="field">
          <span>Hr prev retorno</span>
          <div class="inline-time">
            <div class="time-group">
              <select data-schedule-field="retPrevHora"></select>
              <span class="time-separator">:</span>
              <select data-schedule-field="retPrevMinuto"></select>
            </div>
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
    row.querySelector("[data-schedule-title]").textContent = `Agendamento ${index + 2}`;
    setScheduleInput(row, "data", item.data);
    fillScheduleTimeSelect(row, "hora", true, item.hora);
    fillScheduleTimeSelect(row, "minuto", false, item.minuto);
    fillScheduleTimeSelect(row, "retPrevHora", true, item.retPrevHora, true);
    fillScheduleTimeSelect(row, "retPrevMinuto", false, item.retPrevMinuto, true);
    fillScheduleOptions(row, "tipoServico", state.options.tipoServico, item.tipoServico);
    fillScheduleOptions(row, "tipoVeiculo", state.options.tipoVeiculo, item.tipoVeiculo);
    fillScheduleLookup(row, "motorista", state.motoristas, item.motorista);
    setScheduleInput(row, "trajeto", item.trajeto);
    setScheduleInput(row, "destino", item.destino);
    setScheduleInput(row, "obsMotorista", item.obsMotorista);
  }

  function fillScheduleTimeSelect(row, field, isHour, value) {
    const base = isHour
      ? Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
      : ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
    fillScheduleOptions(row, field, base.map((item) => ({ value: item, label: item })), value);
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
      el.toggleEnderecoPersonalizado.setAttribute("aria-pressed", String(state.enderecoPersonalizadoAtivo));
    }
    if (el.addPassenger) {
      el.addPassenger.disabled = !hasCandidates || hasUnfilledPassenger;
      el.addPassenger.title = hasUnfilledPassenger
        ? "Conclua o passageiro pendente antes de adicionar outro."
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
      openPassengerRecord(item.passageiro);
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
    const wrap = event.target.closest(".row-title-wrap");
    if (!wrap || !el.passengerRows.contains(wrap)) return;
    if (event.relatedTarget && wrap.contains(event.relatedTarget)) return;
    clearPassengerPreviewCloseTimer();
    openPassengerPreview(wrap);
  }

  function handlePassengerPreviewLeave(event) {
    const wrap = event.target.closest(".row-title-wrap");
    if (!wrap || !el.passengerRows.contains(wrap)) return;
    if (event.relatedTarget && wrap.contains(event.relatedTarget)) return;
    if (activePassengerPreview?.portal.contains(event.relatedTarget)) return;
    schedulePassengerPreviewClose(wrap);
  }

  function handlePassengerPreviewFocusIn(event) {
    const wrap = event.target.closest(".row-title-wrap");
    if (!wrap || !el.passengerRows.contains(wrap)) return;
    openPassengerPreview(wrap);
  }

  function handlePassengerPreviewFocusOut(event) {
    const wrap = event.target.closest(".row-title-wrap");
    if (!wrap || !el.passengerRows.contains(wrap)) return;
    window.setTimeout(() => {
      if (!wrap.contains(document.activeElement)) {
        closePassengerPreview(wrap);
      }
    }, 0);
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
    const source = wrap.querySelector(".passenger-preview");
    const anchor = wrap.querySelector(".row-title") || wrap;
    if (anchor.disabled) return;
    if (!source || !source.childNodes.length) return;
    const portal = ensurePassengerPreviewPortal();
    closeAllCustomSelects();
    document.body.appendChild(portal);
    portal.replaceChildren(...Array.from(source.childNodes).map((node) => node.cloneNode(true)));
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
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const gap = 8;
    const safeGap = 10;
    const width = Math.min(360, Math.max(280, viewportWidth - safeGap * 2));
    const height = Math.min(portal.scrollHeight || 120, viewportHeight - safeGap * 2);
    const showAbove = rect.bottom + gap + height > viewportHeight && rect.top > viewportHeight - rect.bottom;
    const top = showAbove
      ? Math.max(safeGap, rect.top - height - gap)
      : Math.min(viewportHeight - height - safeGap, rect.bottom + gap);
    const left = Math.max(safeGap, Math.min(rect.left, viewportWidth - width - safeGap));

    portal.style.width = `${width}px`;
    portal.style.left = `${left}px`;
    portal.style.top = `${Math.max(safeGap, top)}px`;
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
      ["Cliente", passenger.clienteLabel],
      ["Tipo de veículo", passenger.tipoVeiculoLabel || previewValue(passenger.tipoVeiculo, "bdTipoVeiculo")],
      ["Cargo", previewValue(passenger.cargo, "bdCargo")],
      ["Idioma", previewValue(passenger.idioma, "bdIdioma")],
      ["Sexo", previewValue(passenger.sexo, "bdSexo")],
      ["Classificação", previewValue(passenger.classificacao, "bdClassificacao")],
      ["Endereço", passenger.endereco],
      ["Telefone", passenger.telefone],
      ["Email", passenger.email],
      ["Preferências", passenger.preferencias]
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

  function openPassengerRecord(passageiro) {
    if (!passageiro) return;
    const passengerId = cleanGuid(passageiro.guid || passageiro.id);
    if (!passengerId) {
      toast("Passageiro sem identificador para abrir registro.", "error");
      return;
    }
    openPassengerEdit(passengerId);
    return;
    if (state.xrm && state.xrm.Navigation && typeof state.xrm.Navigation.openForm === "function") {
      state.xrm.Navigation.openForm({
        entityName: CONFIG.entities.passageiro,
        entityId: passengerId
      }).catch((error) => {
        console.error(error);
        toast("Não foi possível abrir o registro do passageiro.", "error", 7000);
      });
      return;
    }
    if (state.mockMode) {
      toast(`Mock ativo: ${passageiro.label || "Passageiro"}`, "warning", 3000);
      return;
    }
    toast("Abra este formulário dentro do Dataverse para editar o registro.", "warning", 7000);
  }

  function renderTabBadges() {
    el.tabReturn.classList.toggle("is-marked", el.agendarRetorno.checked);
    el.tabRepeat.classList.toggle("is-marked", el.repetirServico.checked);
  }

  function handleOperationalInput(event) {
    if (state.draftRestoring) return;
    const target = event.target;
    if (target?.classList?.contains("custom-select-search")) return;
    if (target === el.passengerPickerSearch) return;
    if (target?.closest?.("#passengerEditOverlay")) return;

    clearFieldValidation(target);
    captureObsState();
    renderTabBadges();
    renderRiskPanel();
    markDraftDirty();
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

  function markDraftDirty() {
    if (state.draftRestoring) return;
    if (state.draftTimer) window.clearTimeout(state.draftTimer);
    renderDraftStatus("Salvando rascunho...");
    state.draftTimer = window.setTimeout(() => {
      state.draftTimer = null;
      saveDraftSnapshot();
    }, 400);
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
      console.warn("Falha ao salvar rascunho local", error);
    renderDraftStatus("Rascunho não salvo.");
    }
  }

  function createDraftSnapshot() {
    return {
      version: 1,
      recordId: state.recordId || "",
      updatedAt: new Date().toISOString(),
      currentTab: state.currentTab,
      obsAtual: state.obsAtual,
      retObsAtual: state.retObsAtual,
      enderecoPersonalizadoAtivo: state.enderecoPersonalizadoAtivo,
      fields: {
        statusOperacao: el.statusOperacao.value,
        statusFaturamento: el.statusFaturamento.value,
        saidaData: el.saidaData.value,
        saidaHora: el.saidaHora.value,
        saidaMinuto: el.saidaMinuto.value,
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
      renderDraftStatus();
      return;
    }
    if ((snapshot.recordId || "") !== (state.recordId || "")) {
      renderDraftStatus();
      return;
    }

    state.draftRestoring = true;
    try {
      await ensurePassengersByIds((snapshot.selectedPassengers || []).map((item) => item.guid));
      const fields = snapshot.fields || {};
      setSelectValue(el.statusOperacao, fields.statusOperacao || "");
      setSelectValue(el.statusFaturamento, fields.statusFaturamento || "");
      setFieldValue(el.saidaData, fields.saidaData);
      setSelectValue(el.saidaHora, fields.saidaHora || "");
      setSelectValue(el.saidaMinuto, fields.saidaMinuto || "");
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
      setFieldValue(el.retornoData, fields.retornoData);
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
      state.enderecoPersonalizadoAtivo = !!snapshot.enderecoPersonalizadoAtivo;
      state.scheduleDrafts = [];
      state.enderecoRascunho = Array.isArray(snapshot.enderecoRascunho) ? snapshot.enderecoRascunho.map((item) => ({ ...item })) : [];
      state.selectedPassengers = restoreDraftPassengers(snapshot.selectedPassengers || []);
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
      console.warn("Falha ao restaurar rascunho local", error);
      renderDraftStatus("Rascunho invalido.");
    } finally {
      state.draftRestoring = false;
    }
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
      console.warn("Falha ao remover rascunho local", error);
    }
    state.lastDraftSavedAt = null;
    renderDraftStatus();
    if (showToast) toast("Rascunho local removido.", "success", 2500);
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
    fillOptions(el.retPrevHora, hours);
    fillOptions(el.retPrevMinuto, minutes);
    fillOptions(el.retornoHora, hoursRequired);
    fillOptions(el.retornoMinuto, minutesRequired);
  }

  function fillOptions(select, values) {
    select.innerHTML = "";
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function setTab(tab) {
    if ((tab === "bd" || tab === "return" || tab === "repeat") && !state.isNew) {
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
  }

  function switchObs(next, isReturn) {
    if (isReturn) {
      state.obsRet[state.retObsAtual] = el.retornoObservacao.value;
      state.retObsAtual = next;
      el.retornoObservacao.value = state.obsRet[next] || "";
      document.querySelectorAll("[data-ret-obs]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.retObs === next);
      });
      return;
    }
    state.obs[state.obsAtual] = el.observacao.value;
    state.obsAtual = next;
    el.observacao.value = next === "passageiro" ? composePreferencias() : state.obs[next] || "";
    document.querySelectorAll("[data-obs]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.obs === next);
    });
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
      data: el.saidaData.value,
      hora: el.saidaHora.value,
      minuto: el.saidaMinuto.value,
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
      state.scheduleDrafts = state.scheduleDrafts.filter((item) => item.key !== key);
      renderScheduleDrafts();
      renderRiskPanel();
      markDraftDirty();
      return;
    }

    if (action === "copy") {
      const current = state.scheduleDrafts.find((item) => item.key === key);
      if (!current) return;
      Object.assign(current, mainScheduleSnapshot(), { key });
      renderScheduleDrafts();
      renderRiskPanel();
      markDraftDirty();
      toast("Dados do principal copiados", "success", 2500);
    }
  }

  function handleScheduleDraftChange(event) {
    const field = event.target.closest("[data-schedule-field]");
    if (!field) return;
    const row = field.closest(".schedule-draft");
    if (!row) return;
    const item = state.scheduleDrafts.find((draft) => draft.key === row.dataset.scheduleKey);
    if (!item) return;
    item[field.dataset.scheduleField] = field.value;
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
    renderPassengerPickerHint("Digite pelo menos 2 caracteres para pesquisar no Banco de Dados.");
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
    if (normalize(query).length < MIN_PASSENGER_SEARCH_LENGTH) {
      renderPassengerPickerHint("Digite pelo menos 2 caracteres para pesquisar no Banco de Dados.");
      return;
    }
    const searchSeq = ++passengerPickerSearchSeq;
    renderPassengerPickerHint("Pesquisando passageiros...");
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
    toast(`${selected.label || "Passageiro"} adicionado.`, "success", 2200);
  }

  function addPassengerRow() {
    const hasUnfilledPassenger = state.selectedPassengers.some((item) => !item.passageiro || !item.guid);
    if (hasUnfilledPassenger) {
      toast("Preencha o passageiro pendente antes de adicionar outro.", "error");
      return;
    }
    openPassengerPicker();
  }

  function removePassengerRow(ordem, row = null) {
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
    if (el.saidaData.value) {
      if (!el.frequenteInicio.value) el.frequenteInicio.value = el.saidaData.value;
      if (!el.frequenteFim.value) el.frequenteFim.value = el.saidaData.value;
      if (!el.retornoData.value) el.retornoData.value = el.saidaData.value;
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
        .filter((term) => normalize(term).length >= MIN_PASSENGER_SEARCH_LENGTH)
    )).slice(0, 5);
  }

  function scorePassengerCandidate(candidate, passenger) {
    const reasons = [];
    let score = 0;
    const candidatePhone = onlyDigits(candidate.telefone);
    const passengerPhone = onlyDigits(passenger.telefone);
    const candidateEmail = normalize(candidate.email);
    const passengerEmail = normalize(passenger.email);
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

    if (similarity >= 0.92) {
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
      reasons: Array.from(new Set(reasons))
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

  function resolvePassengerMatchReview(result) {
    const resolve = passengerMatchResolve;
    passengerMatchResolve = null;
    if (resolve) resolve(result || { action: "cancel" });
    if (el.passengerMatchOverlay) el.passengerMatchOverlay.hidden = true;
  }

  async function saveForm() {
    captureObsState();
    const context = buildSaveContext();
    clearValidationStates();
    const validation = validateContext(context);
    if (validation) {
      toast(validation, "error", 7000);
      focusInvalidField(validation);
      return;
    }

    state.pendingSaveContext = context;
    openReviewBeforeSave(context);
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
        ? `${total} serviço(s) solicitado(s) com sucesso!`
        : `Serviço editado com sucesso! Data: ${formatDateTime(context.dataHoraPrincipal)}   Trajeto: ${context.trajeto}   Tipo do Veículo: ${optionLabel("tipoVeiculo", el.tipoVeiculo.value)}`;
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
    if (state.isNew && el.repetirServico.checked && el.agendarRetorno.checked) return "Não é possível usar 'Serviços Frequentes' e 'Agendar Retorno' ao mesmo tempo. Escolha apenas um.";
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
      [f.receber]: !!el.receber.checked,
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
        const retornoPrev = buildRetornoPrevisto(dataIda);
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

  async function replacePassengerRelations(reservaId, passengers, context, includeAddress, removeExisting) {
    if (!passengers.length) return;
    if (!state.xrm || state.mockMode) {
      replaceMockRelations(reservaId, passengers, includeAddress);
      return;
    }

    if (removeExisting) {
      const existing = await retrieveAll(
        CONFIG.entities.servicoPassageiro,
        `?$select=${CONFIG.fields.servicoPassageiro.id}&$filter=_cr40f_geral_value eq ${reservaId}`
      );
      for (const row of existing) {
        await state.xrm.WebApi.deleteRecord(CONFIG.entities.servicoPassageiro, row[CONFIG.fields.servicoPassageiro.id]);
      }
    }

    for (const item of passengers) {
      const payload = {
        [CONFIG.fields.servicoPassageiro.ordem]: item.ordem
      };
      bindLookup(payload, CONFIG.nav.servicoGeral, CONFIG.entitySets.reserva, reservaId);
      bindLookup(payload, CONFIG.nav.servicoBancoDados, CONFIG.entitySets.passageiro, item.guid);
      if (includeAddress) {
        payload[CONFIG.fields.servicoPassageiro.endereco] = state.enderecoPersonalizadoAtivo ? "" : (item.enderecoSaidaBD || "");
      }
      await state.xrm.WebApi.createRecord(CONFIG.entities.servicoPassageiro, payload);
    }
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
    [el.agendarRetorno, el.repetirServico, el.receber].forEach((input) => {
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
    if (!baseDateTime || !el.retPrevHora.value || !el.retPrevMinuto.value) return null;
    const saidaTime = timeFromParts(el.saidaHora.value, el.saidaMinuto.value);
    const retornoTime = timeFromParts(el.retPrevHora.value, el.retPrevMinuto.value);
    const base = new Date(baseDateTime);
    if (retornoTime.minutesTotal < saidaTime.minutesTotal) base.setDate(base.getDate() + 1);
    return withClock(base, retornoTime.hours, retornoTime.minutes);
  }

  function combineDateTime(dateValue, hourValue, minuteValue) {
    if (!dateValue || hourValue === "" || minuteValue === "") return null;
    const [year, month, day] = dateValue.split("-").map(Number);
    return new Date(year, month - 1, day, Number(hourValue), Number(minuteValue), 0, 0);
  }

  function setDateTimeFields(date, dateInput, hourSelect, minuteSelect) {
    dateInput.value = toDateInput(date);
    setTimeFields(date, hourSelect, minuteSelect, false);
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
      await navigator.clipboard.writeText(text);
      return;
    }
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "readonly");
    input.style.position = "fixed";
    input.style.opacity = "0";
    input.style.pointerEvents = "none";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
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
