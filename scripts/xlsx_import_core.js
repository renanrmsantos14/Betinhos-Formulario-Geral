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

  const IMPORT_REVIEW_STATUSES = Object.freeze({
    PENDING: "pending",
    CONFIRMED: "confirmed",
    BLOCKED: "blocked",
    IGNORED: "ignored",
    SAVED: "saved"
  });

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

      const trechoKey = buildOperationalTrechoKey(row);
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
      destinos: [],
      cidadeOrigem: row.cidadeOrigem,
      cidadeDestino: row.cidadeDestino,
      solicitanteNome: row.solicitanteNome,
      tipoServicoSugerido: row.tipoServicoSugerido,
      tipoVeiculoSugerido: row.tipoVeiculoSugerido,
      valor: row.valor,
      motoristaNome: row.motoristaNome,
      passageiros: [],
      observacoes: [],
      pendencias: [],
      reviewStatus: IMPORT_REVIEW_STATUSES.PENDING,
      reviewBlockReason: ""
    };
  }

  function mergeRowIntoTrecho(trecho, row) {
    trecho.key = buildTrechoRuntimeKey(row);
    trecho.sourceRows.push(row.sourceRow);
    if (row.solicitacao) trecho.solicitacoes.add(row.solicitacao);
    trecho.horario = earliestTime(trecho.horario, row.horario);
    if (!trecho.origem) trecho.origem = row.origem;
    if (!trecho.destino) trecho.destino = row.destino;
    if (row.destino && !trecho.destinos.some((item) => normalizeAddress(item) === row.destinoKey)) {
      trecho.destinos.push(row.destino);
    }
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
      destino: row.destino,
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
    const destino = composeTrechoDestino(trecho.destinos, passageiros) || trecho.destino;
    const pendencias = [...trecho.pendencias];
    if (!trecho.dataIso) pendencias.push("Data inválida.");
    if (!trecho.horario) pendencias.push("Horário vazio.");
    if (!destino) pendencias.push("Destino vazio.");
    if (!passageiros.length) pendencias.push("Nenhum passageiro detectado.");
    if (!trecho.tipoServicoSugerido) pendencias.push("Tipo de serviço não mapeado.");
    if (!trecho.tipoVeiculoSugerido) pendencias.push("Tipo de veículo não mapeado.");

    return {
      ...trecho,
      key: [
        trecho.programacao,
        trecho.dataIso || trecho.data,
        trecho.horario || "",
        normalizeAddress(trecho.origem),
        normalizeAddress(destino)
      ].join("|"),
      solicitacoes: [...trecho.solicitacoes],
      sourceRows: trecho.sourceRows.sort((a, b) => a - b),
      solicitanteNome,
      destino,
      destinos: Array.from(new Set(trecho.destinos || [])),
      passageiros,
      observacaoOperacional: trecho.observacoes.join("\n"),
      pendencias: Array.from(new Set(pendencias)),
      reviewStatus: normalizeImportReviewStatus(trecho.reviewStatus),
      reviewBlockReason: trecho.reviewBlockReason || ""
    };
  }

  function normalizeImportReviewStatus(status) {
    return Object.values(IMPORT_REVIEW_STATUSES).includes(status)
      ? status
      : IMPORT_REVIEW_STATUSES.PENDING;
  }

  function markImportedTrechoPending(trecho) {
    if (!trecho) return null;
    trecho.reviewStatus = IMPORT_REVIEW_STATUSES.PENDING;
    trecho.reviewBlockReason = "";
    return trecho;
  }

  function confirmImportedTrechoReview(trecho, issues = []) {
    if (!trecho) return null;
    const exactIssues = Array.from(new Set((issues || []).filter(Boolean)));
    if (exactIssues.length) {
      trecho.reviewStatus = IMPORT_REVIEW_STATUSES.BLOCKED;
      trecho.reviewBlockReason = exactIssues[0];
      return trecho;
    }
    trecho.reviewStatus = IMPORT_REVIEW_STATUSES.CONFIRMED;
    trecho.reviewBlockReason = "";
    return trecho;
  }

  function ignoreImportedTrechoReview(trecho) {
    if (!trecho) return null;
    trecho.reviewStatus = IMPORT_REVIEW_STATUSES.IGNORED;
    trecho.reviewBlockReason = "";
    return trecho;
  }

  function markImportedTrechoSaved(trecho, recordId = "") {
    if (!trecho) return null;
    trecho.reviewStatus = IMPORT_REVIEW_STATUSES.SAVED;
    trecho.reviewBlockReason = "";
    if (recordId) trecho.savedRecordId = recordId;
    return trecho;
  }

  function createManualImportTrecho(program, options = {}) {
    const programacao = String(options.programacao || program?.programacao || "").trim();
    const key = options.key || `${programacao}|manual|${nextManualImportSequence(program)}`;
    return {
      key,
      programacao,
      solicitacoes: [],
      sourceRows: [],
      data: "",
      dataIso: "",
      horario: "",
      origem: "",
      destino: "",
      destinos: [],
      cidadeOrigem: "",
      cidadeDestino: "",
      solicitanteNome: "",
      tipoServicoSugerido: "",
      tipoVeiculoSugerido: "",
      tipoServicoValue: "",
      tipoVeiculoValue: "",
      valor: null,
      motoristaNome: "",
      passageiros: [],
      observacoes: [],
      observacaoOperacional: "",
      pendencias: [],
      reviewStatus: IMPORT_REVIEW_STATUSES.PENDING,
      reviewBlockReason: "",
      savedRecordId: "",
      duplicatedRecordIds: [],
      importOrigin: "manual",
      originStatus: "Manual"
    };
  }

  function scoreImportedTrechoDuplicate(trecho, existing = {}) {
    const reasons = [];
    let score = 0;
    const programacao = normalizeText(trecho?.programacao);
    const existingProgramacao = normalizeText(existing.programacao || existing.idExterno || existing.cr40f_idexterno);
    if (programacao && existingProgramacao && programacao === existingProgramacao) {
      score += 10;
      reasons.push("mesma PG");
    }

    const importedDate = trecho?.dataIso || parseBrazilianDate(trecho?.data);
    const importedMinutes = timeToMinutes(trecho?.horario);
    const existingDateTime = existingDateTimeParts(existing.dataSaida || existing.cr40f_dataehorriodesada || existing.data || "");
    if (importedDate && existingDateTime.date && importedDate === existingDateTime.date) {
      if (Number.isFinite(importedMinutes) && Number.isFinite(existingDateTime.minutes)) {
        const delta = Math.abs(importedMinutes - existingDateTime.minutes);
        if (delta === 0) {
          score += 24;
          reasons.push("mesmo horario");
        } else if (delta <= 15) {
          score += 14;
          reasons.push("horario proximo");
        }
      }
    }

    const destinoScore = textMatchScore(trecho?.destino, existing.destino || existing.cr40f_destino);
    if (destinoScore >= 0.9) {
      score += 16;
      reasons.push("mesmo destino");
    } else if (destinoScore >= 0.58) {
      score += 9;
      reasons.push("destino parecido");
    }

    const trajetoScore = textMatchScore(importedTrechoRouteText(trecho), existing.trajeto || existing.cr40f_trajeto);
    if (trajetoScore >= 0.8) {
      score += 14;
      reasons.push("trajeto parecido");
    }

    const pickupScore = textMatchScore(importedTrechoPickupText(trecho), existing.enderecoView || existing.cr40f_endereodesada);
    if (pickupScore >= 0.8) {
      score += 14;
      reasons.push("mesmo endereco de saida");
    } else if (pickupScore >= 0.58) {
      score += 8;
      reasons.push("endereco de saida parecido");
    }

    const passengers = passengerMatchScore(trecho?.passageiros || [], existing.paxView || existing.cr40f_passageirosetelefonedecontato || "");
    if (passengers >= 0.9) {
      score += 22;
      reasons.push("mesmos passageiros");
    } else if (passengers >= 0.45) {
      score += 12;
      reasons.push("passageiros parecidos");
    }

    const level = score >= 78 ? "exact" : score >= 48 ? "possible" : "";
    return {
      recordId: existing.recordId || existing.id || existing.cr40f_reservadeveculosid || "",
      score,
      level,
      reasons
    };
  }

  function existingDateTimeParts(value) {
    const raw = String(value || "").trim();
    if (!raw) return { date: "", minutes: Number.NaN };
    const isoMatch = /^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{1,2}):(\d{2}))?/.exec(raw);
    if (isoMatch) {
      return {
        date: isoMatch[1],
        minutes: isoMatch[2] ? Number(isoMatch[2]) * 60 + Number(isoMatch[3]) : Number.NaN
      };
    }
    return {
      date: parseBrazilianDate(raw),
      minutes: timeToMinutes(raw)
    };
  }

  function importedTrechoRouteText(trecho) {
    return [
      trecho?.cidadeOrigem,
      trecho?.cidadeDestino,
      trecho?.origem,
      trecho?.destino
    ].filter(Boolean).join(" ");
  }

  function importedTrechoPickupText(trecho) {
    return [
      trecho?.origem,
      ...(trecho?.passageiros || []).map((passenger) => passenger.origem)
    ].filter(Boolean).join(" ");
  }

  function textMatchScore(left, right) {
    const a = normalizeAddress(left);
    const b = normalizeAddress(right);
    if (!a || !b) return 0;
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return 0.92;
    const aTokens = new Set(a.split(" ").filter((token) => token.length > 2));
    const bTokens = new Set(b.split(" ").filter((token) => token.length > 2));
    if (!aTokens.size || !bTokens.size) return 0;
    let common = 0;
    aTokens.forEach((token) => {
      if (bTokens.has(token)) common += 1;
    });
    return (common * 2) / (aTokens.size + bTokens.size);
  }

  function passengerMatchScore(passengers, existingPaxText) {
    const existingText = normalizeText(existingPaxText);
    if (!existingText) return 0;
    const normalizedPassengers = (passengers || [])
      .map((passenger) => ({
        name: normalizeText(passenger?.nome),
        phone: normalizePhone(passenger?.telefone)
      }))
      .filter((passenger) => passenger.name || passenger.phone);
    if (!normalizedPassengers.length) return 0;
    let matched = 0;
    normalizedPassengers.forEach((passenger) => {
      const nameTokens = passenger.name.split(" ").filter((token) => token.length > 2);
      const firstLast = [nameTokens[0], nameTokens[nameTokens.length - 1]].filter(Boolean);
      const nameMatches = passenger.name && (
        existingText.includes(passenger.name)
        || (firstLast.length >= 2 && firstLast.every((token) => existingText.includes(token)))
      );
      const phoneMatches = passenger.phone && normalizePhone(existingPaxText).includes(passenger.phone);
      if (nameMatches || phoneMatches) matched += 1;
    });
    return matched / normalizedPassengers.length;
  }

  function nextManualImportSequence(program) {
    const keys = new Set((program?.trechos || []).map((trecho) => String(trecho?.key || "")));
    let sequence = 1;
    while (keys.has(`${program?.programacao || ""}|manual|${sequence}`)) {
      sequence += 1;
    }
    return sequence;
  }

  function summarizeImportReviewTrechos(trechos) {
    const counts = {
      pending: 0,
      confirmed: 0,
      blocked: 0,
      ignored: 0,
      saved: 0
    };
    const saveableTrechos = [];
    (trechos || []).forEach((trecho) => {
      const status = normalizeImportReviewStatus(trecho?.reviewStatus);
      counts[status] += 1;
      if (status === IMPORT_REVIEW_STATUSES.CONFIRMED) saveableTrechos.push(trecho);
    });
    const canScheduleConfirmed = saveableTrechos.length > 0 && counts.pending === 0 && counts.blocked === 0;
    return {
      counts,
      saveableTrechos,
      canScheduleConfirmed,
      blockedReason: canScheduleConfirmed ? "" : importScheduleBlockedReason(counts)
    };
  }

  function importScheduleBlockedReason(counts) {
    if (counts.pending) return `${counts.pending} trecho(s) pendente(s) de revisão.`;
    if (counts.blocked) return `${counts.blocked} trecho(s) bloqueado(s).`;
    return "Nenhum trecho confirmado para agendar.";
  }

  function buildTrechoRuntimeKey(row) {
    return [
      row.programacao,
      row.dataIso || row.data,
      row.horario || "",
      row.origemKey || normalizeAddress(row.origem),
      normalizeText([row.prefixoMotorista, row.motoristaNome, row.tipoTransporteExterno].filter(Boolean).join(" "))
    ].join("|");
  }

  function buildOperationalTrechoKey(row) {
    return [
      row.dataIso || row.data,
      row.horario || "",
      row.origemKey || normalizeAddress(row.origem),
      normalizeText([row.prefixoMotorista, row.motoristaNome, row.tipoTransporteExterno].filter(Boolean).join(" ")),
      row.tipoServicoSugerido || "",
      row.tipoVeiculoSugerido || ""
    ].join("|");
  }

  function composeTrechoDestino(destinos, passageiros) {
    const uniqueDestinos = [];
    (destinos || []).forEach((destino) => {
      const key = normalizeAddress(destino);
      if (key && !uniqueDestinos.some((item) => normalizeAddress(item) === key)) {
        uniqueDestinos.push(destino);
      }
    });
    if (uniqueDestinos.length <= 1) return uniqueDestinos[0] || "";
    return (passageiros || [])
      .map((passenger, index) => {
        const destino = passenger.destino || uniqueDestinos[index] || "";
        const nome = firstName(passenger.nome) || `Passageiro ${index + 1}`;
        return `${index + 1}. ${nome} - ${destino || "destino nao informado"}`;
      })
      .join(";\n");
  }

  function firstName(value) {
    return String(value || "").trim().split(/\s+/)[0] || "";
  }

  function dedupePassengers(rows) {
    const seen = new Set();
    const output = [];
    rows.forEach((passenger) => {
      const key = [
        normalizeText(passenger.nome),
        normalizePhone(passenger.telefone),
        normalizeAddress(passenger.origem),
        normalizeAddress(passenger.destino),
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
    IMPORT_REVIEW_STATUSES,
    buildImportPrograms,
    createManualImportTrecho,
    confirmImportedTrechoReview,
    ignoreImportedTrechoReview,
    inferServiceType,
    inferVehicleType,
    markImportedTrechoPending,
    markImportedTrechoSaved,
    normalizeAddress,
    normalizeImportedRows,
    normalizeText,
    parseBrazilianDate,
    scoreImportedTrechoDuplicate,
    summarizeImportReviewTrechos,
    validateImportHeaders
  };
});
