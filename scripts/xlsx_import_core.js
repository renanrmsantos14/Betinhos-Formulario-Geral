(function attachXlsxImportCore(root, factory) {
  const core = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = core;
  }
  root.XlsxImportCore = core;
})(typeof globalThis !== "undefined" ? globalThis : window, function createXlsxImportCore() {
  "use strict";

  const REQUIRED_XLSX_HEADERS = [
    "Data da Viagem (inicial)",
    "Número solicitação",
    "Número Programação",
    "Status",
    "Tipo Serviço",
    "Tipo Transporte",
    "Horário Passageiro",
    "Nome Passageiro",
    "Tel Res.",
    "Tel Cel.",
    "Centro Custo Passageiro",
    "Programador",
    "Gestor/Aprovador",
    "Solicitante",
    "Origem",
    "Cidade Origem",
    "Destino",
    "Cidade Destino",
    "Horário Vôo/Casv",
    "Número Vôo",
    "Terminal",
    "Cia. Aérea",
    "Valor Bruto da Viagem",
    "Custo total da viagem",
    "Outros/VALOR DA VIAGEM",
    "Empresa",
    "Nome motorista",
    "Viagem compartilhada",
    "Observação",
    "Observação faturamento"
  ];

  function normalizeImportedRows(rows) {
    return (rows || [])
      .map((row, index) => normalizeImportedRow(row, index + 2))
      .filter((row) => row.programacao || row.nomePassageiro || row.origem || row.destino);
  }

  function normalizeImportedRow(row, sourceRow) {
    const data = cell(row, "Data da Viagem (inicial)");
    const horario = normalizeTime(cell(row, "Horário Passageiro"));
    const origem = cell(row, "Origem");
    const destino = cell(row, "Destino");
    return {
      sourceRow,
      data,
      dataIso: parseBrazilianDate(data),
      horario,
      programacao: cell(row, "Número Programação"),
      solicitacao: cell(row, "Número solicitação"),
      statusExterno: cell(row, "Status"),
      unidadeAtendimento: cell(row, "Unidade de Atendimento"),
      tipoServicoExterno: cell(row, "Tipo Serviço"),
      tipoTransporteExterno: cell(row, "Tipo Transporte"),
      nomePassageiro: normalizePersonName(cell(row, "Nome Passageiro")),
      documento: firstFilled(row, ["CPF", "Passaporte", "RG", "CNH"]),
      telefone: normalizePhone(firstFilled(row, ["Tel Cel.", "Tel Res."])),
      telefoneResidencial: normalizePhone(cell(row, "Tel Res.")),
      telefoneCelular: normalizePhone(cell(row, "Tel Cel.")),
      centroCusto: normalizeCode(cell(row, "Centro Custo Passageiro")),
      debitarEm: normalizeCode(cell(row, "Debitar em")),
      oiPep: normalizeCode(cell(row, "OI/PEP")),
      programador: cell(row, "Programador"),
      gestor: cell(row, "Gestor/Aprovador"),
      solicitanteNome: normalizePersonName(cell(row, "Solicitante")),
      origem,
      origemKey: normalizeAddress(origem),
      cidadeOrigem: cell(row, "Cidade Origem"),
      destino,
      destinoKey: normalizeAddress(destino),
      cidadeDestino: cell(row, "Cidade Destino"),
      vooHorario: normalizeTime(cell(row, "Horário Vôo/Casv")),
      vooNumero: cell(row, "Número Vôo"),
      terminal: cell(row, "Terminal"),
      ciaAerea: cell(row, "Cia. Aérea"),
      valor: parseMoney(firstFilled(row, [
        "Outros/VALOR DA VIAGEM",
        "Valor Bruto da Viagem",
        "Custo total da viagem",
        "Custo Passageiro"
      ])),
      empresa: cell(row, "Empresa"),
      motoristaNome: cell(row, "Nome motorista"),
      motoristaTelefone: normalizePhone(cell(row, "Tel. Motor.")),
      prefixoMotorista: cell(row, "Prefixo Motor."),
      compartilhada: normalizeYesNo(cell(row, "Viagem compartilhada")),
      observacao: cell(row, "Observação"),
      observacaoFaturamento: cell(row, "Observação faturamento"),
      tipoServicoSugerido: inferServiceType(cell(row, "Tipo Serviço"), destino, cell(row, "Cidade Destino")),
      tipoVeiculoSugerido: inferVehicleType(cell(row, "Tipo Transporte"))
    };
  }

  function buildImportPrograms(rows) {
    const programs = new Map();
    (rows || []).forEach((row) => {
      if (!row.programacao) return;
      if (!programs.has(row.programacao)) {
        programs.set(row.programacao, {
          programacao: row.programacao,
          solicitacoes: new Set(),
          statusExternos: new Set(),
          trechosMap: new Map(),
          sourceRows: []
        });
      }
      const program = programs.get(row.programacao);
      if (row.solicitacao) program.solicitacoes.add(row.solicitacao);
      if (row.statusExterno) program.statusExternos.add(row.statusExterno);
      program.sourceRows.push(row.sourceRow);

      const trechoKey = [
        row.dataIso || row.data,
        row.destinoKey || normalizeAddress(row.destino),
        row.tipoServicoSugerido || "",
        row.tipoVeiculoSugerido || ""
      ].join("|");
      if (!program.trechosMap.has(trechoKey)) {
        program.trechosMap.set(trechoKey, createTrecho(row));
      }
      mergeRowIntoTrecho(program.trechosMap.get(trechoKey), row);
    });

    return [...programs.values()].map((program) => {
      const trechos = [...program.trechosMap.values()]
        .map(finalizeTrecho)
        .sort(compareTrechos);
      return {
        programacao: program.programacao,
        solicitacoes: [...program.solicitacoes],
        statusExternos: [...program.statusExternos],
        sourceRows: program.sourceRows.sort((a, b) => a - b),
        trechos,
        pendencias: collectProgramIssues(trechos)
      };
    }).sort((a, b) => compareProgramCodes(a.programacao, b.programacao));
  }

  function createTrecho(row) {
    return {
      key: "",
      programacao: row.programacao,
      solicitacoes: new Set(),
      sourceRows: [],
      data: row.data,
      dataIso: row.dataIso,
      horario: row.horario,
      origem: row.origem,
      destino: row.destino,
      cidadeOrigem: row.cidadeOrigem,
      cidadeDestino: row.cidadeDestino,
      solicitanteNome: row.solicitanteNome,
      tipoServicoSugerido: row.tipoServicoSugerido,
      tipoVeiculoSugerido: row.tipoVeiculoSugerido,
      valor: row.valor,
      motoristaNome: row.motoristaNome,
      passageiros: [],
      observacoes: [],
      pendencias: []
    };
  }

  function mergeRowIntoTrecho(trecho, row) {
    trecho.key = buildTrechoRuntimeKey(row);
    trecho.sourceRows.push(row.sourceRow);
    if (row.solicitacao) trecho.solicitacoes.add(row.solicitacao);
    trecho.horario = earliestTime(trecho.horario, row.horario);
    if (!trecho.origem) trecho.origem = row.origem;
    if (!trecho.destino) trecho.destino = row.destino;
    if (!trecho.cidadeOrigem) trecho.cidadeOrigem = row.cidadeOrigem;
    if (!trecho.cidadeDestino) trecho.cidadeDestino = row.cidadeDestino;
    if (!trecho.solicitanteNome && row.solicitanteNome) trecho.solicitanteNome = row.solicitanteNome;
    if (!trecho.tipoServicoSugerido) trecho.tipoServicoSugerido = row.tipoServicoSugerido;
    if (!trecho.tipoVeiculoSugerido) trecho.tipoVeiculoSugerido = row.tipoVeiculoSugerido;
    if (Number.isFinite(row.valor) && (!Number.isFinite(trecho.valor) || row.valor > trecho.valor)) {
      trecho.valor = row.valor;
    }
    if (!trecho.motoristaNome && row.motoristaNome) trecho.motoristaNome = row.motoristaNome;
    trecho.passageiros.push({
      sourceRow: row.sourceRow,
      nome: row.nomePassageiro,
      telefone: row.telefone,
      documento: row.documento,
      centroCusto: row.centroCusto,
      solicitanteNome: row.solicitanteNome,
      origem: row.origem,
      horario: row.horario,
      passageiroId: "",
      passageiroLabel: "",
      matchStatus: "pending",
      matchCandidates: []
    });
    buildOperationalNotes(row).forEach((note) => {
      if (!trecho.observacoes.includes(note)) trecho.observacoes.push(note);
    });
  }

  function finalizeTrecho(trecho) {
    const passageiros = dedupePassengers(trecho.passageiros);
    const solicitanteNome = trecho.solicitanteNome || passageiros.find((passenger) => passenger.solicitanteNome)?.solicitanteNome || "";
    const pendencias = [...trecho.pendencias];
    if (!trecho.dataIso) pendencias.push("Data inválida.");
    if (!trecho.horario) pendencias.push("Horário vazio.");
    if (!trecho.destino) pendencias.push("Destino vazio.");
    if (!passageiros.length) pendencias.push("Nenhum passageiro detectado.");
    if (!trecho.tipoServicoSugerido) pendencias.push("Tipo de serviço não mapeado.");
    if (!trecho.tipoVeiculoSugerido) pendencias.push("Tipo de veículo não mapeado.");

    return {
      ...trecho,
      key: [
        trecho.programacao,
        trecho.dataIso || trecho.data,
        trecho.horario || "",
        normalizeAddress(trecho.destino)
      ].join("|"),
      solicitacoes: [...trecho.solicitacoes],
      sourceRows: trecho.sourceRows.sort((a, b) => a - b),
      solicitanteNome,
      passageiros,
      observacaoOperacional: trecho.observacoes.join("\n"),
      pendencias: Array.from(new Set(pendencias))
    };
  }

  function buildTrechoRuntimeKey(row) {
    return [
      row.programacao,
      row.dataIso || row.data,
      row.destinoKey || normalizeAddress(row.destino)
    ].join("|");
  }

  function dedupePassengers(rows) {
    const seen = new Set();
    const output = [];
    rows.forEach((passenger) => {
      const key = [
        normalizeText(passenger.nome),
        normalizePhone(passenger.telefone),
        normalizeAddress(passenger.origem),
        passenger.horario
      ].join("|");
      if (seen.has(key)) return;
      seen.add(key);
      output.push(passenger);
    });
    return output;
  }

  function collectProgramIssues(trechos) {
    return Array.from(new Set((trechos || []).flatMap((trecho) => trecho.pendencias || [])));
  }

  function buildOperationalNotes(row) {
    const notes = [
      `Importado de ${row.programacao}${row.solicitacao ? ` / ${row.solicitacao}` : ""}.`,
      row.statusExterno ? `Status externo: ${row.statusExterno}.` : "",
      row.programador ? `Programador: ${row.programador}.` : "",
      row.gestor ? `Gestor/Aprovador: ${row.gestor}.` : "",
      row.solicitanteNome ? `Solicitante externo: ${row.solicitanteNome}.` : "",
      row.vooNumero ? `Voo: ${row.vooNumero}${row.vooHorario ? ` às ${row.vooHorario}` : ""}.` : "",
      row.terminal ? `Terminal: ${row.terminal}.` : "",
      row.ciaAerea ? `Cia. aérea: ${row.ciaAerea}.` : "",
      row.observacao ? `Observação externa: ${row.observacao}` : "",
      row.observacaoFaturamento ? `Observação faturamento: ${row.observacaoFaturamento}` : ""
    ];
    return notes.filter(Boolean);
  }

  function validateImportHeaders(headers) {
    const available = new Set((headers || []).map((item) => String(item || "").trim()));
    return REQUIRED_XLSX_HEADERS.filter((header) => !available.has(header));
  }

  function cell(row, header) {
    return String(row?.[header] ?? "").trim();
  }

  function firstFilled(row, headers) {
    for (const header of headers) {
      const value = cell(row, header);
      if (value) return value;
    }
    return "";
  }

  function normalizeCode(value) {
    return String(value || "").trim().toUpperCase();
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeAddress(value) {
    return normalizeText(value)
      .replace(/\b(ap|apto|apartamento|hotel|porta|portaria|terminal)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizePersonName(value) {
    return String(value || "")
      .replace(/^cliente:\s*/i, "")
      .replace(/^passageiros?:\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function normalizeTime(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const decimal = Number(raw);
    if (Number.isFinite(decimal) && decimal > 0 && decimal < 1) {
      const totalMinutes = Math.round(decimal * 24 * 60);
      return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
    }
    const match = /^(\d{1,2}):?(\d{2})?$/.exec(raw);
    if (!match) return raw;
    return `${String(Number(match[1])).padStart(2, "0")}:${String(Number(match[2] || 0)).padStart(2, "0")}`;
  }

  function parseBrazilianDate(value) {
    const raw = String(value || "").trim();
    const serial = Number(raw);
    if (Number.isFinite(serial) && serial > 20000) {
      const epoch = Date.UTC(1899, 11, 30);
      const date = new Date(epoch + serial * 86400000);
      return date.toISOString().slice(0, 10);
    }
    const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(raw);
    if (!match) return "";
    const day = String(Number(match[1])).padStart(2, "0");
    const month = String(Number(match[2])).padStart(2, "0");
    return `${match[3]}-${month}-${day}`;
  }

  function parseMoney(value) {
    const raw = String(value || "").trim();
    if (!raw) return null;
    const normalized = raw.includes(",")
      ? raw.replace(/\./g, "").replace(",", ".")
      : raw;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function normalizeYesNo(value) {
    const text = normalizeText(value);
    if (text === "sim") return true;
    if (text === "nao" || text === "não") return false;
    return null;
  }

  function inferVehicleType(tipoTransporte) {
    const text = normalizeText(tipoTransporte);
    if (!text) return "";
    if (text.includes("van")) return "Van";
    if (text.includes("blind")) return "Blindado";
    if (text.includes("executivo")) return "Executivo";
    if (text.includes("carro")) return "Executivo";
    return "";
  }

  function inferServiceType(tipoServico, destino, cidadeDestino) {
    const text = normalizeText([tipoServico, destino, cidadeDestino].filter(Boolean).join(" "));
    if (!text) return "";
    if (text.includes("guarulhos") || text.includes("helio smidt")) return "Guarulhos";
    if (text.includes("congonhas")) return "Congonhas";
    if (text.includes("campinas")) return "Campinas";
    if (text.includes("sao paulo") || text.includes("pinheiros")) return "Dentro de Sao Paulo";
    if (text.includes("sao jose dos campos") || text.includes("sjc")) return "Sao Jose dos Campos";
    if (text.includes("aeroporto")) return "Guarulhos";
    if (text.includes("outras cidades") || text.includes("botucatu")) return "Outras Cidades";
    return "";
  }

  function earliestTime(current, next) {
    if (!current) return next || "";
    if (!next) return current;
    return timeToMinutes(next) < timeToMinutes(current) ? next : current;
  }

  function timeToMinutes(value) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || ""));
    if (!match) return Number.MAX_SAFE_INTEGER;
    return Number(match[1]) * 60 + Number(match[2]);
  }

  function compareTrechos(a, b) {
    return `${a.dataIso || ""} ${a.horario || ""} ${a.destino || ""}`.localeCompare(
      `${b.dataIso || ""} ${b.horario || ""} ${b.destino || ""}`,
      "pt-BR"
    );
  }

  function compareProgramCodes(a, b) {
    const aNumber = Number(/\d+$/.exec(a)?.[0] || 0);
    const bNumber = Number(/\d+$/.exec(b)?.[0] || 0);
    if (aNumber !== bNumber) return aNumber - bNumber;
    return String(a).localeCompare(String(b), "pt-BR");
  }

  return {
    REQUIRED_XLSX_HEADERS,
    buildImportPrograms,
    inferServiceType,
    inferVehicleType,
    normalizeAddress,
    normalizeImportedRows,
    normalizeText,
    parseBrazilianDate,
    validateImportHeaders
  };
});
