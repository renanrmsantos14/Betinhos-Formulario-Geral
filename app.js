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

  const FALLBACK = {
    statusOperacao: [
      { value: 202410000, label: "Pre-reserva" },
      { value: 202410004, label: "Solicitado" },
      { value: 202410001, label: "Confirmado" },
      { value: 202410005, label: "Programado" },
      { value: 202410006, label: "Em Execução" },
    { value: 202410008, label: "Concluído" },
      { value: 100000001, label: "Requer Análise" },
      { value: 202410002, label: "Cancelado" }
    ],
    statusFaturamento: [
      { value: 202410000, label: "Pendente" },
      { value: 202410008, label: "Faturamento Mensal" }
    ],
    tipoServico: [
      { value: 1, label: "Aeroporto ida e volta" },
      { value: 2, label: "Aeroporto só ida" },
      { value: 3, label: "Viagem executiva" },
      { value: 4, label: "Reuniao corporativa" },
      { value: 5, label: "Escala interna" },
      { value: 6, label: "Troca de veículos" },
    ],
    tipoVeiculo: [
      { value: 10, label: "SEDAN" },
      { value: 11, label: "SUV" },
      { value: 12, label: "VAN" },
      { value: 13, label: "LIMOSINE" },
      { value: 14, label: "MINIBUS" }
    ],
    formaPagamento: [
      { value: 20, label: "Conta Betinhos" },
      { value: 21, label: "Cartão corporativo" },
      { value: 22, label: "Faturado" },
      { value: 23, label: "A definir" }
    ],
    bdStatus: [
      { value: 30, label: "Ativo" },
      { value: 31, label: "Inativo" }
    ],
    bdClassificacao: [
      { value: 40, label: "VIP" },
      { value: 41, label: "Regular" },
      { value: 42, label: "Executivo" },
      { value: 43, label: "Executiva" }
    ],
    bdSexo: [
      { value: 50, label: "Masculino" },
      { value: 51, label: "Feminino" },
      { value: 52, label: "Outro" }
    ],
    bdIdioma: [
      { value: 60, label: "Português" },
      { value: 61, label: "Inglês" },
      { value: 62, label: "Espanhol" },
      { value: 63, label: "Italiano" }
    ],
    bdCargo: [
      { value: 70, label: "Executivo" },
      { value: 71, label: "Diretor" },
      { value: 72, label: "Gerente" },
      { value: 73, label: "Coordenador" },
      { value: 74, label: "Assessor" }
    ],
    bdTipoVeiculo: [
      { value: 80, label: "Sedan" },
      { value: 81, label: "SUV" },
      { value: 82, label: "Hatch" },
      { value: 83, label: "Limousine" },
      { value: 84, label: "VAN" }
    ],
    simple: []
  };

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
    passengerListHead: $("passengerListHead"),
    toggleEnderecoPersonalizado: $("toggleEnderecoPersonalizado"),
    addPassenger: $("addPassenger"),
    passengerPickerOverlay: $("passengerPickerOverlay"),
    passengerPickerSearch: $("passengerPickerSearch"),
    passengerPickerResults: $("passengerPickerResults"),
    passengerPickerClose: $("passengerPickerClose"),
    passengerPickerCancel: $("passengerPickerCancel"),
    customAddressWrap: $("customAddressWrap"),
    enderecoPersonalizado: $("enderecoPersonalizado"),
    telefonesPreview: $("telefonesPreview"),
    destino: $("destino"),
    bdStatus: $("bdStatus"),
    bdNome: $("bdNome"),
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
    bdPassengerSearch: $("bdPassengerSearch"),
    bdPassengerDirectory: $("bdPassengerDirectory"),
    bdExistingPassenger: $("bdExistingPassenger"),
    loadPassengerForEdit: $("loadPassengerForEdit"),
    updatePassenger: $("updatePassenger"),
    passengerEditOverlay: $("passengerEditOverlay"),
    passengerEditTitle: $("passengerEditTitle"),
    passengerEditStatus: $("passengerEditStatus"),
    passengerEditFields: $("passengerEditFields"),
    passengerEditToggle: $("passengerEditToggle"),
    passengerEditClose: $("passengerEditClose"),
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
    tabRepeat: $("tabRepeat"),
    riskPanel: $("riskPanel"),
    riskList: $("riskList"),
    saveLogList: $("saveLogList"),
    draftStatus: $("draftStatus"),
    clearDraftButton: $("clearDraftButton"),
    confirmSaveButton: $("confirmSaveButton"),
    cancelReviewButton: $("cancelReviewButton")
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
  let passengerPickerTargetOrder = null;
  let passengerCatalogLoadPromise = null;
  let passengerCatalogLoaded = false;
  let activePassengerEditId = "";
  let passengerEditEnabled = false;
  let passengerEditStatusTimer = null;
  const passengerEditSaveTimers = new Map();

  state.mockMode = QUERY_MOCK_MODE || state.xrm === null;

  init().catch((error) => {
    console.error(error);
    setLoading(false);
    toast(error.message || "Falha ao iniciar formulário.", "error", 9000);
  });

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
    restoreDraftSnapshot();
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
    el.bdPassengerSearch?.addEventListener("input", renderPassengerDirectory);
    el.bdPassengerDirectory?.addEventListener("click", handlePassengerDirectoryAction);
    el.bdExistingPassenger?.addEventListener("change", () => {
      if (el.bdExistingPassenger.value) openPassengerEdit(el.bdExistingPassenger.value);
    });
    el.loadPassengerForEdit?.addEventListener("click", loadPassengerForEdit);
    el.updatePassenger?.addEventListener("click", updatePassenger);
    el.passengerEditToggle?.addEventListener("click", togglePassengerEditMode);
    el.passengerEditClose?.addEventListener("click", closePassengerEditPopup);
    el.passengerEditOverlay?.addEventListener("click", (event) => {
      if (event.target === el.passengerEditOverlay) {
        closePassengerEditPopup();
      }
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
    el.clearDraftButton?.addEventListener("click", () => clearDraftSnapshot(true));
    el.addPassenger?.addEventListener("click", addPassengerRow);
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
    el.passengerPickerSearch?.addEventListener("input", renderPassengerPickerResults);
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
    const appRoot = $("app");
    appRoot?.addEventListener("input", handleOperationalInput);
    appRoot?.addEventListener("change", handleOperationalInput);
  }

  function initializeCustomSelects() {
    document.querySelectorAll("select").forEach((select) => {
      if (select.hidden) return;
      ensureCustomSelect(select);
      refreshCustomSelect(select);
    });
  }

  function ensureCustomSelect(select) {
    if (!select || select.tagName !== "SELECT" || select.hidden || select.dataset.customSelectReady === "1") return;
    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "custom-select-trigger";
    trigger.setAttribute("aria-expanded", "false");

    const triggerText = document.createElement("span");
    triggerText.className = "custom-select-value";

    const triggerCaret = document.createElement("span");
    triggerCaret.className = "custom-select-caret";
    trigger.append(triggerText, triggerCaret);

    const panel = document.createElement("div");
    panel.className = "custom-select-panel";
    if (select.closest(".status-select")) {
      panel.classList.add("is-status");
    }
    panel.setAttribute("role", "listbox");
    panel.dataset.customSelectPanel = "";
    panel.tabIndex = -1;

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "custom-select-search";
    searchInput.placeholder = "Pesquisar";
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

    triggerText.textContent = selectedOption ? selectedOption.textContent.trim() || "Selecione" : "Selecione";
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
      const normalizedOptionText = normalize(optionText);
      if (query && !normalizedOptionText.includes(query)) return;

      const button = document.createElement("button");
      button.type = "button";
      button.role = "option";
      button.className = "custom-select-option";
      button.dataset.value = option.value || "";
      button.textContent = optionText;
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
        triggerText.textContent = optionText.trim() || "Selecione";
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
      window.setTimeout(() => state.searchInput.focus(), 10);
    }
    updateCustomSelectPanelPosition(state);
    activeCustomSelect = state.wrapper;
    state.trigger.setAttribute("aria-expanded", "true");
    state.trigger.focus();
  }

  function updateCustomSelectPanelPosition(state) {
    if (!state || !state.wrapper.classList.contains("is-open")) return;
    const rect = state.trigger.getBoundingClientRect();
    const width = Math.max(140, Math.ceil(rect.width || state.trigger.offsetWidth || 120));
    const maxHeight = Math.min(260, Math.max(120, Math.floor(window.innerHeight * 0.42)));
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const menuHeight = Math.min(maxHeight, Math.max(80, state.panel.scrollHeight || 0));
    const showAbove = spaceBelow < Math.min(maxHeight, 180) && spaceAbove > spaceBelow;
    const top = showAbove
      ? Math.max(8, rect.top - menuHeight - 8)
      : Math.min(window.innerHeight - menuHeight - 8, rect.bottom + 8);

    const safeLeft = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));

    state.panel.style.left = `${safeLeft}px`;
    state.panel.style.top = `${Math.max(8, top)}px`;
    state.panel.style.width = `${Math.max(120, width)}px`;
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
    passengerCatalogLoaded = true;
  }

  async function ensurePassengerCatalogLoaded() {
    if (passengerCatalogLoaded && state.passageiros.length > 0) return;
    if (passengerCatalogLoadPromise) {
      await passengerCatalogLoadPromise;
      return;
    }
    passengerCatalogLoadPromise = loadLookups();
    try {
      await passengerCatalogLoadPromise;
      passengerCatalogLoaded = true;
    } finally {
      passengerCatalogLoadPromise = null;
    }
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
    const [passageiros, clientes, motoristas, ops] = await Promise.all([
      retrieveAll(CONFIG.entities.passageiro, [
        "?$select=",
        [
          f.passageiro.id,
          f.passageiro.nome,
          f.passageiro.telefone,
          f.passageiro.email,
          f.passageiro.enderecoSaida,
          f.passageiro.preferencias,
          f.passageiro.cr,
          f.passageiro.status,
          f.passageiro.classificacao,
          f.passageiro.sexo,
          f.passageiro.idioma,
          f.passageiro.cargo,
          f.passageiro.nascimento,
          f.passageiro.departamento,
          f.passageiro.tipoVeiculo,
          "_cr40f_cliente_value"
        ].join(","),
        "&$orderby=",
        f.passageiro.nome,
        " asc&$top=5000"
      ].join("")),
      retrieveAll(CONFIG.entities.cliente, `?$select=${f.cliente.id},${f.cliente.nome}&$orderby=${f.cliente.nome} asc&$top=5000`),
      retrieveAll(CONFIG.entities.funcionario, `?$select=${f.funcionario.id},${f.funcionario.nome}&$orderby=${f.funcionario.nome} asc&$top=5000`),
      retrieveAll(CONFIG.entities.financeiro, `?$select=${f.financeiro.id},${f.financeiro.label},createdon&$orderby=createdon desc&$top=500`)
    ]);

    state.passageiros = passageiros.map(mapPassageiro);
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
    passengerCatalogLoaded = true;
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
      telefone: record[f.telefone] || "",
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
    el.cotacao.value = r[f.cotacao] ?? "";
    el.cr.value = r[f.cr] || "";
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
    renderLookupSelect(el.bdExistingPassenger, state.passageiros);
    renderLookupSelect(el.motorista, state.motoristas);
    renderLookupSelect(el.op, state.ordensPagamento);
    renderChoiceSelect(el.bdStatus, state.options.bdStatus);
    renderChoiceSelect(el.bdClassificacao, state.options.bdClassificacao);
    renderChoiceSelect(el.bdSexo, state.options.bdSexo);
    renderChoiceSelect(el.bdIdioma, state.options.bdIdioma);
    renderChoiceSelect(el.bdCargo, state.options.bdCargo);
    renderChoiceSelect(el.bdTipoVeiculo, state.options.bdTipoVeiculo);
    renderPassengerDirectory();
    hydrateForm();
    renderScheduleDrafts();
    renderPassengers();
    renderTabBadges();
    renderRiskPanel();
    renderSaveLog();
    renderDraftStatus();
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
      { key: "status", label: "Status", kind: "choice", required: true, stateKey: "status", payloadField: f.status, optionsKey: "bdStatus" },
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

  function renderPassengerDirectory() {
    if (!el.bdPassengerDirectory) return;
    const query = normalize(el.bdPassengerSearch?.value || "");
    const rows = state.passageiros
      .filter((passenger) => {
        if (!query) return true;
        const haystack = normalize([
          passenger.label,
          passenger.telefone,
          passenger.email,
          passenger.clienteLabel,
          passenger.cr,
          passenger.departamento
        ].filter(Boolean).join(" "));
        return haystack.includes(query);
      })
      .slice()
      .sort((a, b) => (a.label || "").localeCompare(b.label || "", "pt-BR"));

    el.bdPassengerDirectory.innerHTML = "";
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "passenger-directory-empty";
      empty.textContent = state.passageiros.length ? "Nenhum passageiro encontrado." : "Nenhum passageiro carregado.";
      el.bdPassengerDirectory.appendChild(empty);
      return;
    }

    rows.forEach((passenger) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "passenger-directory-item";
      button.dataset.passengerId = passenger.id;
      button.setAttribute("role", "option");

      const name = document.createElement("strong");
      name.textContent = passenger.label || "Passageiro sem nome";

      const meta = document.createElement("span");
      meta.textContent = [
        passenger.telefone,
        passenger.email,
        passenger.clienteLabel
      ].filter(Boolean).join(" | ") || "Sem contato cadastrado";

      const extra = document.createElement("small");
      extra.textContent = [
        optionLabel("bdStatus", passenger.status),
        optionLabel("bdClassificacao", passenger.classificacao),
        passenger.cr ? `CR ${passenger.cr}` : ""
      ].filter(Boolean).join(" | ") || "Sem classificação";

      button.append(name, meta, extra);
      el.bdPassengerDirectory.appendChild(button);
    });
  }

  function handlePassengerDirectoryAction(event) {
    const item = event.target.closest("[data-passenger-id]");
    if (!item || !el.bdPassengerDirectory.contains(item)) return;
    openPassengerEdit(item.dataset.passengerId);
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
    setSelectValue(el.bdExistingPassenger, passengerId);
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
      control.readOnly = true;
    }

    const value = getPassengerEditValue(passenger, field);
    control.className = "passenger-edit-control";
    control.dataset.passengerEditControl = field.key;
    control.dataset.savedValue = value;
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
    const delay = event.type === "input" && control.tagName !== "SELECT" ? 550 : 0;
    schedulePassengerEditSave(control.dataset.passengerEditControl, control, delay);
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
    if (field.kind === "text" || field.kind === "textarea") return control.value.trim();
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

    const updatedPassenger = {
      ...state.passageiros[index],
      [field.stateKey]: value
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
    renderLookupSelect(el.bdExistingPassenger, state.passageiros);
    setSelectValue(el.bdExistingPassenger, passengerId);
    renderPassengerDirectory();
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
    if (el.passengerListHead) {
      el.passengerListHead.classList.toggle("is-hidden-address", state.enderecoPersonalizadoAtivo);
    }
    el.customAddressWrap.hidden = !state.enderecoPersonalizadoAtivo;
    if (el.toggleEnderecoPersonalizado) {
      el.toggleEnderecoPersonalizado.textContent = state.enderecoPersonalizadoAtivo ? "Endereços por linha" : "Endereço único";
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

    el.telefonesPreview.value = composePassageirosTelefones();
    if (state.enderecoPersonalizadoAtivo && !el.enderecoPersonalizado.value) {
      el.enderecoPersonalizado.value = composeEnderecoCompleto();
    }
    syncPassengerNameColumnWidth();
    syncReturnDefaults();
  }

  function syncPassengerNameColumnWidth() {
    if (!el.passengerRows) return;
    const labels = [...el.passengerRows.querySelectorAll(".row-label")];
    const targets = [el.passengerRows, el.passengerListHead].filter(Boolean);
    targets.forEach((target) => target.style.removeProperty("--passenger-name-width"));

    if (!labels.length) return;

    const maxWidth = Math.max(...labels.map((label) => Math.ceil(label.getBoundingClientRect().width)));
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

  function handlePassengerRowInput(event) {
    const input = event.target.closest("[data-passenger-field='address']");
    if (!input) return;
    const row = input.closest(".passenger-row");
    if (!row) return;
    const ordem = Number(row.dataset.ordem);
    if (Number.isNaN(ordem)) return;
    setDraftAddress(ordem, input.value);
    el.telefonesPreview.value = composePassageirosTelefones();
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
    if (target === el.bdPassengerSearch) return;
    if (target?.closest?.("#passengerEditOverlay")) return;

    captureObsState();
    renderTabBadges();
    renderRiskPanel();
    markDraftDirty();
  }

  function renderRiskPanel() {
    if (!el.riskList) return;
    const risks = collectOperationalRisks();
    el.riskList.innerHTML = "";

    if (!risks.length) {
      const item = document.createElement("li");
      item.textContent = "Sem risco operacional crítico detectado.";
      el.riskList.appendChild(item);
      return;
    }

    risks.forEach((risk) => {
      const item = document.createElement("li");
      item.textContent = risk;
      el.riskList.appendChild(item);
    });
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
    if (el.repetirServico.checked && (!el.frequenteInicio.value || !el.frequenteFim.value)) risks.push("Serviço frequente ativo sem período completo.");
    if (el.repetirServico.checked && el.frequenteInicio.value && el.frequenteFim.value && new Date(el.frequenteFim.value) < new Date(el.frequenteInicio.value)) risks.push("Período frequente com data final anterior à inicial.");

    return risks;
  }

  function renderSaveLog() {
    if (!el.saveLogList) return;
    el.saveLogList.innerHTML = "";

    if (!state.saveLog.length) {
      const item = document.createElement("li");
      item.textContent = "Nenhum salvamento executado nesta sessão.";
      el.saveLogList.appendChild(item);
      return;
    }

    state.saveLog.forEach((entry) => {
      const item = document.createElement("li");
      item.className = `save-log-entry ${entry.type || "info"}`;

      const title = document.createElement("strong");
      title.textContent = entry.title || "Evento";

      const detail = document.createElement("span");
      detail.textContent = entry.detail || "";

      const time = document.createElement("small");
      time.textContent = entry.at ? formatTime(entry.at) : "";

      item.append(title, detail, time);
      el.saveLogList.appendChild(item);
    });
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

  function restoreDraftSnapshot() {
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
      setFieldValue(el.cotacao, fields.cotacao);
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
    if (!el.draftStatus) return;
    if (forcedText) {
      el.draftStatus.textContent = forcedText;
      return;
    }

    const snapshot = readDraftSnapshot();
    const updatedAt = state.lastDraftSavedAt || snapshot?.updatedAt || "";
    if (!updatedAt) {
      el.draftStatus.textContent = "Sem rascunho salvo.";
      if (el.clearDraftButton) el.clearDraftButton.disabled = true;
      return;
    }

    el.draftStatus.textContent = `Rascunho salvo as ${formatTime(updatedAt)}.`;
    if (el.clearDraftButton) el.clearDraftButton.disabled = false;
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
    const usedIds = new Set(
      state.selectedPassengers
        .map((item) => cleanGuid(item.guid || ""))
        .filter(Boolean)
        .map((id) => id.toLowerCase())
    );
    return state.passageiros
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
    if (!state.passageiros.length) {
      try {
        await ensurePassengerCatalogLoaded();
      } catch (error) {
        console.warn("Falha ao recarregar passageiros", error);
        toast("Não foi possível carregar passageiros agora. Tente novamente.", "error", 2500);
        return;
      }
    }
    const candidates = getAvailablePassengers();
    if (!candidates.length) {
      passengerPickerTargetOrder = null;
      const label = state.passageiros.length
        ? "Sem passageiros disponíveis para adicionar (todos já estão vinculados)."
        : "Nenhum passageiro encontrado no cadastro.";
      toast(label, "error");
      return;
    }
    renderPassengerPickerResults();
    el.passengerPickerOverlay.hidden = false;
    requestAnimationFrame(() => {
      if (el.passengerPickerSearch) el.passengerPickerSearch.focus();
    });
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

  function renderPassengerPickerResults() {
    if (!el.passengerPickerSearch || !el.passengerPickerResults) return;
    const query = el.passengerPickerSearch.value.trim().toLowerCase();
    const base = getAvailablePassengers();
    const list = query
      ? base.filter((pax) => {
        const haystack = [
          pax.label,
          pax.telefone,
          pax.email,
          pax.clienteLabel
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
      : base;
    el.passengerPickerResults.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("p");
      empty.className = "passenger-picker-empty";
      empty.textContent = base.length ? "Nenhum passageiro encontrado." : "Sem passageiros disponíveis.";
      el.passengerPickerResults.appendChild(empty);
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
    const hasCandidates = getAvailablePassengers().length > 0;
    if (!hasCandidates) {
      toast("Sem passageiros disponíveis para adicionar.", "error");
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
    const required = [
      [el.bdStatus.value, "'Status' é obrigatório."],
      [el.bdNome.value.trim(), "'Nome do Passageiro' é obrigatório."],
      [el.bdCliente.value, "'Cliente' é obrigatório."],
      [el.bdIdioma.value, "'Idioma' é obrigatório."],
      [el.bdClassificacao.value, "'Classificação' é obrigatório."]
    ];
    const missing = required.find(([value]) => !value);
    if (missing) {
      toast(missing[1], "error");
      return;
    }

    const exists = state.passageiros.some((item) => item.label.trim().toLowerCase() === el.bdNome.value.trim().toLowerCase());
    if (exists) {
      toast(`Já existe um passageiro com o nome ${el.bdNome.value.trim()}!`, "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        [CONFIG.fields.passageiro.nome]: el.bdNome.value.trim(),
        [CONFIG.fields.passageiro.telefone]: el.bdTelefone.value.trim(),
        [CONFIG.fields.passageiro.enderecoSaida]: el.bdEndereco.value.trim(),
        [CONFIG.fields.passageiro.preferencias]: el.bdPreferencias.value.trim(),
        [CONFIG.fields.passageiro.email]: el.bdEmail.value.trim(),
        [CONFIG.fields.passageiro.cr]: el.bdCr.value.trim(),
        [CONFIG.fields.passageiro.departamento]: el.bdDepartamento.value.trim(),
        [CONFIG.fields.passageiro.cadastro]: new Date().toISOString().slice(0, 10)
      };
      setChoice(payload, CONFIG.fields.passageiro.status, el.bdStatus.value);
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
      renderLookupSelect(el.bdExistingPassenger, state.passageiros);
      renderPassengerDirectory();
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
      input.value = "";
    });
    [el.bdStatus, el.bdClassificacao, el.bdCliente, el.bdSexo, el.bdIdioma, el.bdCargo, el.bdTipoVeiculo, el.bdExistingPassenger].forEach((select) => {
      select.value = "";
    });
    refreshCustomSelect(el.bdExistingPassenger);
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
      status: el.bdStatus.value,
      classificacao: el.bdClassificacao.value,
      sexo: el.bdSexo.value,
      idioma: el.bdIdioma.value,
      cargo: el.bdCargo.value,
      nascimento: el.bdNascimento.value,
      departamento: el.bdDepartamento.value.trim(),
      tipoVeiculo: el.bdTipoVeiculo.value
    };
  }

  function passengerPayloadFromForm(includeCadastro) {
    const payload = {
      [CONFIG.fields.passageiro.nome]: el.bdNome.value.trim(),
      [CONFIG.fields.passageiro.telefone]: el.bdTelefone.value.trim(),
      [CONFIG.fields.passageiro.enderecoSaida]: el.bdEndereco.value.trim(),
      [CONFIG.fields.passageiro.preferencias]: el.bdPreferencias.value.trim(),
      [CONFIG.fields.passageiro.email]: el.bdEmail.value.trim(),
      [CONFIG.fields.passageiro.cr]: el.bdCr.value.trim(),
      [CONFIG.fields.passageiro.departamento]: el.bdDepartamento.value.trim()
    };
    if (includeCadastro) payload[CONFIG.fields.passageiro.cadastro] = new Date().toISOString().slice(0, 10);
    setChoice(payload, CONFIG.fields.passageiro.status, el.bdStatus.value);
    setChoice(payload, CONFIG.fields.passageiro.cargo, el.bdCargo.value);
    setChoice(payload, CONFIG.fields.passageiro.sexo, el.bdSexo.value);
    setChoice(payload, CONFIG.fields.passageiro.idioma, el.bdIdioma.value);
    setChoice(payload, CONFIG.fields.passageiro.classificacao, el.bdClassificacao.value);
    setChoice(payload, CONFIG.fields.passageiro.tipoVeiculo, el.bdTipoVeiculo.value);
    if (el.bdNascimento.value) payload[CONFIG.fields.passageiro.nascimento] = el.bdNascimento.value;
    bindLookup(payload, CONFIG.nav.cliente, CONFIG.entitySets.cliente, el.bdCliente.value);
    return payload;
  }

  function loadPassengerForEdit() {
    const passenger = state.passageiros.find((item) => sameId(item.id, el.bdExistingPassenger.value));
    if (!passenger) {
      toast("Selecione um passageiro para editar.", "error");
      return;
    }
    openPassengerEdit(passenger.id);
  }

  async function updatePassenger() {
    const passengerId = cleanGuid(el.bdExistingPassenger.value);
    const index = state.passageiros.findIndex((item) => sameId(item.id, passengerId));
    if (index < 0) {
      toast("Selecione e carregue um passageiro existente.", "error");
      return;
    }
    openPassengerEdit(passengerId);
    toast("Edição agora salva automaticamente por campo.", "warning", 3500);
    return;
    const required = [
      [el.bdStatus.value, "'Status' é obrigatório."],
      [el.bdNome.value.trim(), "'Nome do Passageiro' é obrigatório."],
      [el.bdCliente.value, "'Cliente' é obrigatório."],
      [el.bdIdioma.value, "'Idioma' é obrigatório."],
      [el.bdClassificacao.value, "'Classificação' é obrigatório."]
    ];
    const missing = required.find(([value]) => !value);
    if (missing) {
      toast(missing[1], "error");
      return;
    }

    setLoading(true);
    try {
      const payload = passengerPayloadFromForm(false);
      if (state.xrm && !state.mockMode) {
        await state.xrm.WebApi.updateRecord(CONFIG.entities.passageiro, passengerId, payload);
      }
      const updatedPassenger = {
        ...state.passageiros[index],
        ...passengerFormState(),
        id: passengerId
      };
      state.passageiros[index] = updatedPassenger;
      state.passageiros.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
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
      renderLookupSelect(el.solicitante, state.passageiros);
      renderLookupSelect(el.bdExistingPassenger, state.passageiros);
      setSelectValue(el.bdExistingPassenger, passengerId);
      renderPassengers();
      renderRiskPanel();
      markDraftDirty();
      toast(`Cadastro atualizado: ${updatedPassenger.label}`, "success");
    } catch (error) {
      console.error(error);
      toast(`Falha ao atualizar passageiro. ${error.message || ""}`, "error", 9000);
    } finally {
      setLoading(false);
      renderRiskPanel();
    }
  }

  async function saveForm() {
    captureObsState();
    const context = buildSaveContext();
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
    if (el.agendarRetorno.checked && !el.retornoData.value) return "'Data de retorno' é obrigatória.";
    if (el.agendarRetorno.checked && !el.retornoEndereco.value.trim()) return "'Endereço de Saída - Retorno' é obrigatório.";
    if (el.agendarRetorno.checked && !el.retornoDestino.value.trim()) return "'Destino - Retorno' é obrigatório.";
    if (el.repetirServico.checked && (!el.frequenteInicio.value || !el.frequenteFim.value)) return "'Data de início e fim - Serviços Frequentes' são obrigatórios.";
    if (el.repetirServico.checked && !el.frequenteTipo.value) return "'Tipo de Serviço Frequente' é obrigatório.";
    if (state.isNew && el.repetirServico.checked && el.agendarRetorno.checked) return "Não é possível usar 'Serviços Frequentes' e 'Agendar Retorno' ao mesmo tempo. Escolha apenas um.";
    if (hasDuplicatePassengers()) return "Erro: passageiro duplicado na lista. Remova as duplicatas.";
    return "";
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
      [f.cr]: el.cr.value.trim()
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
    [
      el.trajeto,
      el.observacao,
      el.cotacao,
      el.cr,
      el.destino,
      el.retornoEndereco,
      el.retornoDestino,
      el.retornoObservacao,
      el.enderecoPersonalizado
    ].forEach((input) => {
      input.value = "";
    });
    [el.tipoServico, el.tipoVeiculo, el.motorista, el.formaPagamento, el.cliente, el.solicitante, el.op].forEach((select) => {
      select.value = "";
    });
    [el.agendarRetorno, el.repetirServico, el.receber].forEach((input) => {
      input.checked = false;
    });
    hydrateForm();
    renderScheduleDrafts();
    renderPassengers();
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

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function parseNumber(value) {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(String(value).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
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
})();
