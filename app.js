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

  const FALLBACK = {
    statusOperacao: [
      { value: 202410000, label: "Pre-reserva" },
      { value: 202410004, label: "Solicitado" },
      { value: 202410001, label: "Confirmado" },
      { value: 202410005, label: "Programado" },
      { value: 202410006, label: "Em Execucao" },
    { value: 202410008, label: "Concluído" },
      { value: 100000001, label: "Requer Analise" },
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
      { value: 6, label: "Troca de veiculos" }
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
      { value: 21, label: "Cartao corporativo" },
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
      { value: 60, label: "Portugues" },
      { value: 61, label: "Ingles" },
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
    toggleEnderecoPersonalizado: $("toggleEnderecoPersonalizado"),
    addPassenger: $("addPassenger"),
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
    selectedPassengers: [],
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
    passengerRowSeq: 0
  };
  const customSelectRoots = new WeakMap();
  let activeCustomSelect = null;
  let customSelectSeq = 0;

  state.mockMode = QUERY_MOCK_MODE || state.xrm === null;

  init().catch((error) => {
    console.error(error);
    setLoading(false);
    toast(error.message || "Falha ao iniciar formulário.", "error", 9000);
  });

  async function init() {
    state.isNew = !state.recordId;
    setLoading(true);
    bindStaticEvents();
    populateTimeSelects();
    await loadReferenceData();
    await loadCurrentRecord();
    hydrateForm();
    renderAll();
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

  function cleanGuid(value) {
    return String(value || "").replace(/[{}]/g, "").trim();
  }

  function bindStaticEvents() {
    el.tabs.forEach((button) => {
      button.addEventListener("click", () => setTab(button.dataset.tab));
    });
    el.closeSuccess.addEventListener("click", () => {
      el.success.hidden = true;
    });
    el.saveButton.addEventListener("click", saveForm);
    el.createPassenger.addEventListener("click", createPassenger);
    el.addPassenger.addEventListener("click", addPassengerRow);
    el.passengerRows.addEventListener("click", handlePassengerRowAction);
    el.passengerRows.addEventListener("change", handlePassengerRowChange);
    el.passengerRows.addEventListener("input", handlePassengerRowInput);
    el.toggleEnderecoPersonalizado.addEventListener("click", toggleEnderecoPersonalizado);
    el.cliente.addEventListener("change", () => {
      applyStatusFaturamentoDefault();
      renderStatusFaturamento();
    });
    el.destino.addEventListener("input", syncReturnDefaults);
    el.enderecoPersonalizado.addEventListener("input", () => {
      state.customAddressText = el.enderecoPersonalizado.value;
    });
    el.agendarRetorno.addEventListener("change", () => {
      syncReturnDefaults();
      renderTabBadges();
    });
    el.repetirServico.addEventListener("change", renderTabBadges);
    el.saidaData.addEventListener("change", syncRepeatDefaultDates);
    el.saidaHora.addEventListener("change", syncReturnDefaults);
    el.saidaMinuto.addEventListener("change", syncReturnDefaults);
    document.querySelectorAll("[data-obs]").forEach((button) => {
      button.addEventListener("click", () => switchObs(button.dataset.obs, false));
    });
    document.querySelectorAll("[data-ret-obs]").forEach((button) => {
      button.addEventListener("click", () => switchObs(button.dataset.retObs, true));
    });
    document.addEventListener("click", handleGlobalCustomSelectClick);
    document.addEventListener("keydown", handleGlobalCustomSelectKeydown);
    document.addEventListener("scroll", handleGlobalCustomSelectScroll, { capture: true });
    window.addEventListener("resize", repositionOpenCustomSelectPanels);
  }

  function initializeCustomSelects() {
    document.querySelectorAll("select").forEach((select) => {
      ensureCustomSelect(select);
      refreshCustomSelect(select);
    });
  }

  function ensureCustomSelect(select) {
    if (!select || select.tagName !== "SELECT" || select.dataset.customSelectReady === "1") return;
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
    select.addEventListener("change", onNativeChange);

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (select.disabled) return;
      toggleCustomSelect(select);
    });

    trigger.addEventListener("keydown", (event) => {
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

    searchInput.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    searchInput.addEventListener("input", () => {
      renderCustomSelectOptions(select, state.searchInput.value);
    });

    searchInput.addEventListener("keydown", (event) => {
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

      button.addEventListener("click", (event) => {
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
        tipoVeiculo: "Sedan"
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
        tipoVeiculo: "SUV"
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
        tipoVeiculo: "VAN"
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
      state.selectedPassengers = [emptyPassenger(1)];
      state.enderecoRascunho = [{ ordem: 1, endereco: "" }];
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
      : [emptyPassenger(1)];
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
    renderLookupSelect(el.motorista, state.motoristas);
    renderLookupSelect(el.op, state.ordensPagamento);
    renderChoiceSelect(el.bdStatus, state.options.bdStatus);
    renderChoiceSelect(el.bdClassificacao, state.options.bdClassificacao);
    renderChoiceSelect(el.bdSexo, state.options.bdSexo);
    renderChoiceSelect(el.bdIdioma, state.options.bdIdioma);
    renderChoiceSelect(el.bdCargo, state.options.bdCargo);
    renderChoiceSelect(el.bdTipoVeiculo, state.options.bdTipoVeiculo);
    hydrateForm();
    renderPassengers();
    renderTabBadges();
  }

  function renderStatusFaturamento() {
    const current = el.statusFaturamento.value;
    renderChoiceSelect(el.statusFaturamento, state.options.statusFaturamento);
    setSelectValue(el.statusFaturamento, current || el.statusFaturamento.dataset.defaultValue || findOptionValue("statusFaturamento", "Pendente"));
  }

  function renderChoiceSelect(select, options) {
    const previous = select.value;
    select.innerHTML = '<option value=""></option>';
    options.forEach((item) => {
      const option = document.createElement("option");
      option.value = String(item.value);
      option.textContent = item.label;
      select.appendChild(option);
    });
    if (previous) select.value = previous;
    ensureCustomSelect(select);
    refreshCustomSelect(select);
  }

  function renderLookupSelect(select, rows) {
    const previous = select.value;
    select.innerHTML = '<option value=""></option>';
    rows.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      select.appendChild(option);
    });
    if (previous) select.value = previous;
    ensureCustomSelect(select);
    refreshCustomSelect(select);
  }

  function renderPassengers() {
    el.customAddressWrap.hidden = !state.enderecoPersonalizadoAtivo;
    el.toggleEnderecoPersonalizado.textContent = state.enderecoPersonalizadoAtivo ? "Linha" : "Adr";
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
        animatePassengerRowRemoval(row);
      }
    });

    keepRows.forEach((row, index) => {
      row.style.setProperty("--row-index", String(index));
      el.passengerRows.appendChild(row);
    });

    el.telefonesPreview.value = composePassageirosTelefones();
    if (state.enderecoPersonalizadoAtivo && !el.enderecoPersonalizado.value) {
      el.enderecoPersonalizado.value = composeEnderecoCompleto();
    }
    syncReturnDefaults();
  }

  function buildPassengerRow(item) {
    const row = document.createElement("div");
    row.className = "passenger-row";
    row.dataset.rowKey = item.rowKey;
    row.dataset.ordem = String(item.ordem);

    const label = document.createElement("div");
    label.className = "row-label";

    const paxField = document.createElement("label");
    paxField.className = "field";
    paxField.innerHTML = "<span>Nome</span>";
    const paxSelect = document.createElement("select");
    paxSelect.className = "passenger-select";
    paxSelect.dataset.passengerField = "select";
    ensureCustomSelect(paxSelect);

    const addressField = document.createElement("label");
    addressField.className = "field address-cell";
    addressField.innerHTML = "<span>Ed de Saida 1</span>";
    const addressInput = document.createElement("input");
    addressInput.type = "text";
    addressInput.placeholder = "Endereço de saída";
    addressInput.className = "passenger-address";
    addressInput.dataset.passengerField = "address";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-row";
    remove.textContent = "x";
    remove.title = "Remover passageiro";

    paxField.appendChild(paxSelect);
    addressField.appendChild(addressInput);
    row.append(label, paxField, addressField, remove);
    return row;
  }

  function hydratePassengerRow(row, item, index = 0) {
    const label = row.querySelector(".row-label");
    const select = row.querySelector(".passenger-select");
    const addressInput = row.querySelector(".passenger-address");
    const addressLabel = addressInput.closest("label");
    const remove = row.querySelector(".remove-row");

    row.dataset.rowKey = item.rowKey;
    row.dataset.ordem = String(item.ordem);
    row.style.setProperty("--row-index", String(index));
    label.textContent = `Passageiro ${item.ordem}`;
    fillPassengerOptions(select, item.guid || "");
    refreshCustomSelect(select);
    addressLabel.querySelector("span").textContent = `Ed de Saida ${item.ordem}`;
    addressInput.value = getDraftAddress(item.ordem) || item.enderecoEditado || "";
    addressInput.disabled = state.enderecoPersonalizadoAtivo;
    addressInput.hidden = state.enderecoPersonalizadoAtivo;
    remove.hidden = state.selectedPassengers.length <= 1;
    row.classList.remove("is-leave");
    row.classList.remove("is-enter");
  }

  function fillPassengerOptions(select, selectedValue) {
    select.innerHTML = "<option value=\"\"></option>";
    state.passageiros.forEach((pax) => {
      const option = document.createElement("option");
      option.value = pax.id;
      option.textContent = pax.label;
      select.appendChild(option);
    });
    select.value = selectedValue || "";
    ensureCustomSelect(select);
    refreshCustomSelect(select);
  }

  function animatePassengerRowRemoval(row) {
    if (!row.isConnected) return;
    row.classList.remove("is-enter");
    row.classList.add("is-leave");
    row.addEventListener(
      "animationend",
      () => {
        if (row.isConnected) {
          row.remove();
        }
      },
      { once: true }
    );
    window.setTimeout(() => {
      if (row.isConnected) {
        row.remove();
      }
    }, 280);
  }

  function handlePassengerRowAction(event) {
    const remove = event.target.closest(".remove-row");
    if (!remove) return;
    const row = remove.closest(".passenger-row");
    if (!row) return;
    const ordem = Number(row.dataset.ordem);
    if (Number.isNaN(ordem)) return;
    removePassengerRow(ordem);
  }

  function handlePassengerRowChange(event) {
    const select = event.target.closest("[data-passenger-field='select']");
    if (!select) return;
    const row = select.closest(".passenger-row");
    if (!row) return;
    const ordem = Number(row.dataset.ordem);
    if (Number.isNaN(ordem)) return;
    selectPassenger(ordem, select.value);
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

  function renderTabBadges() {
    el.tabReturn.classList.toggle("is-marked", el.agendarRetorno.checked);
    el.tabRepeat.classList.toggle("is-marked", el.repetirServico.checked);
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
    el.tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.tab === tab));
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

  function sortPassengers() {
    state.selectedPassengers.sort((a, b) => a.ordem - b.ordem);
  }

  function addPassengerRow() {
    if (state.selectedPassengers.some((item) => !item.guid)) {
      toast("Termine de preencher os passageiros em aberto antes de adicionar um novo.", "error");
      return;
    }
    const nextOrder = Math.max(0, ...state.selectedPassengers.map((item) => item.ordem)) + 1;
    state.selectedPassengers.push(emptyPassenger(nextOrder));
    state.enderecoRascunho.push({ ordem: nextOrder, endereco: "" });
    renderPassengers();
  }

  function removePassengerRow(ordem) {
    state.selectedPassengers = state.selectedPassengers.filter((item) => item.ordem !== ordem);
    state.enderecoRascunho = state.enderecoRascunho.filter((item) => item.ordem !== ordem);
    reindexPassengers();
    renderPassengers();
    applyPassengerDefaults(false);
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

  function selectPassenger(ordem, passengerId) {
    const selected = state.passageiros.find((item) => sameId(item.id, passengerId)) || null;
    const item = state.selectedPassengers.find((row) => row.ordem === ordem);
    if (!item) return;
    const duplicate = selected && state.selectedPassengers.some((row) => row.ordem !== ordem && sameId(row.guid, selected.id));
    if (duplicate) {
      toast("Erro: passageiro duplicado na lista. Remova as duplicatas.", "error");
      renderPassengers();
      return;
    }
    item.passageiro = selected;
    item.guid = selected?.id || "";
    item.telefone = selected?.telefone || "";
    item.enderecoEditado = selected?.endereco || "";
    setDraftAddress(ordem, selected?.endereco || "");
    if (!el.cliente.value && selected?.clienteId) el.cliente.value = selected.clienteId;
    applyPassengerDefaults(true);
    renderPassengers();
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
      toast(`Ja existe um passageiro com o nome ${el.bdNome.value.trim()}!`, "error");
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
      if (state.xrm) {
        created = await state.xrm.WebApi.createRecord(CONFIG.entities.passageiro, payload);
      } else {
        created = { id: `local-${Date.now()}` };
      }

      const newPassenger = {
        id: cleanGuid(created.id),
        label: el.bdNome.value.trim(),
        telefone: el.bdTelefone.value.trim(),
        email: el.bdEmail.value.trim(),
        endereco: el.bdEndereco.value.trim(),
        preferencias: el.bdPreferencias.value.trim(),
        cr: el.bdCr.value.trim(),
        clienteId: el.bdCliente.value,
        tipoVeiculo: el.bdTipoVeiculo.value
      };
      state.passageiros.push(newPassenger);
      state.passageiros.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
      clearPassengerCreateForm();
      renderLookupSelect(el.solicitante, state.passageiros);
      renderPassengers();
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
    [el.bdStatus, el.bdClassificacao, el.bdCliente, el.bdSexo, el.bdIdioma, el.bdCargo, el.bdTipoVeiculo].forEach((select) => {
      select.value = "";
    });
  }

  async function saveForm() {
    captureObsState();
    const context = buildSaveContext();
    const validation = validateContext(context);
    if (validation) {
      toast(validation, "error", 7000);
      return;
    }

    setLoading(true);
    try {
      const results = [];

      if (state.isNew) {
        const principal = await saveReserva(buildReservaPayload(context, "principal", context.dataHoraPrincipal));
        results.push({ tipo: "Principal", data: context.dataHoraPrincipal, result: principal });
        await replacePassengerRelations(principal.id, context.colOrdemPassageiros, context, true);

        if (el.repetirServico.checked) {
          const frequent = await createFrequentServices(context);
          results.push(...frequent);
        }

        if (el.agendarRetorno.checked) {
          const retorno = await saveReserva(buildReservaPayload(context, "retorno", context.dataHoraRetorno));
          results.push({ tipo: "Retorno", data: context.dataHoraRetorno, result: retorno });
          await replacePassengerRelations(retorno.id, context.colOrdemPassageiros, context, false);
        }
      } else {
        if (el.agendarRetorno.checked || el.repetirServico.checked) {
      throw new Error("Agendamento de retorno e serviços frequentes só na criação.");
        }
        const updated = await saveReserva(buildReservaPayload(context, "edicao", context.dataHoraPrincipal), state.recordId);
        await replacePassengerRelations(state.recordId, context.colOrdemPassageiros, context, true, true);
        results.push({ tipo: "Edicao", data: context.dataHoraPrincipal, result: updated });
      }

      const total = results.length;
      const message = state.isNew
        ? `${total} serviço(s) solicitado(s) com sucesso!`
        : `Serviço editado com sucesso! Data: ${formatDateTime(context.dataHoraPrincipal)}   Trajeto: ${context.trajeto}   Tipo do Veículo: ${optionLabel("tipoVeiculo", el.tipoVeiculo.value)}`;
      showSuccess(message);
      resetAfterSuccess();
    } catch (error) {
      console.error(error);
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
      colOrdemPassageiros
    };
  }

  function validateContext(context) {
    const statusLabel = optionLabel("statusOperacao", el.statusOperacao.value);
    const isTroca = statusLabel === "Troca de Veiculos" || statusLabel === "Troca de Veículos";
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

  function buildReservaPayload(context, kind, dataHora) {
    const f = CONFIG.fields.reserva;
    const isReturn = kind === "retorno" || kind === "frequenteRetorno";
    const payload = {
      [f.enderecoView]: isReturn ? el.retornoEndereco.value.trim() : context.enderecoCompleto,
      [f.destino]: isReturn ? el.retornoDestino.value.trim() : el.destino.value.trim(),
      [f.dataSaida]: dataHora.toISOString(),
      [f.obsOperacao]: isReturn ? state.obsRet.motorista : state.obs.motorista,
      [f.obsInterna]: isReturn ? state.obsRet.interna : state.obs.interna,
      [f.obsFinal]: isReturn ? state.obsRet.final : state.obs.final,
      [f.perfilPassageiro]: context.preferencias,
      [f.email]: context.emailPassageiro || "",
      [f.trajeto]: isReturn ? invertTrajeto(context.trajeto) : context.trajeto,
      [f.paxView]: context.passageirosTelefones,
      [f.cotacao]: parseNumber(el.cotacao.value),
      [f.receber]: !!el.receber.checked,
      [f.cr]: el.cr.value.trim()
    };

    if (!isReturn && context.retornoPrevisto) payload[f.previsaoRetorno] = context.retornoPrevisto.toISOString();
    if (!isReturn) payload[f.enderecoPersonalizado] = state.enderecoPersonalizadoAtivo ? el.enderecoPersonalizado.value.trim() : null;
    if (isReturn) payload["cr40f_enderecodesaida1"] = el.retornoEndereco.value.trim();

    setChoice(payload, f.status, el.statusOperacao.value);
    setChoice(payload, f.statusFaturamento, el.statusFaturamento.value);
    setChoice(payload, f.tipoServico, el.tipoServico.value);
    setChoice(payload, f.tipoVeiculo, el.tipoVeiculo.value);
    setChoice(payload, f.formaPagamento, el.formaPagamento.value);

    bindLookup(payload, CONFIG.nav.cliente, CONFIG.entitySets.cliente, el.cliente.value);
    bindLookup(payload, CONFIG.nav.solicitante, CONFIG.entitySets.passageiro, el.solicitante.value);
    bindLookup(payload, CONFIG.nav.motorista, CONFIG.entitySets.funcionario, el.motorista.value);
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
    state.selectedPassengers = [emptyPassenger(1)];
    state.enderecoRascunho = [{ ordem: 1, endereco: "" }];
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
    const stringValue = value === null || value === undefined ? "" : String(value);
    if (stringValue && [...select.options].some((option) => option.value === stringValue)) {
      select.value = stringValue;
      refreshCustomSelect(select);
      return;
    }
    select.value = fallback && [...select.options].some((option) => option.value === String(fallback)) ? String(fallback) : "";
    refreshCustomSelect(select);
  }

  function findOptionValue(key, label) {
    const wanted = normalize(label);
    return state.options[key].find((item) => normalize(item.label) === wanted)?.value || "";
  }

  function optionLabel(key, value) {
    return state.options[key].find((item) => String(item.value) === String(value))?.label || "";
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

  function toast(message, type = "info", timeout = 5000) {
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    el.toastStack.appendChild(item);
    window.setTimeout(() => item.remove(), timeout);
  }
})();
