const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const {
  REQUIRED_XLSX_HEADERS,
  normalizeImportedRows,
  buildImportPrograms,
  IMPORT_REVIEW_STATUSES,
  IMPORT_OPERATIONAL_DECISIONS,
  IMPORT_OPERATIONAL_MODES,
  applyImportOperationalDecision,
  createManualImportTrecho,
  confirmImportedTrechoReview,
  ignoreImportedTrechoReview,
  markImportedTrechoPending,
  markImportedTrechoSaved,
  scoreImportedTrechoDuplicate,
  splitImportedTrecho,
  summarizeImportReviewTrechos
} = require("./xlsx_import_core");

const root = path.resolve(__dirname, "..");
const workbookPath = path.join(root, "Relatorio - 2026-05-15T144227.698.xlsx");

function readZipEntries(filePath) {
  const buffer = fs.readFileSync(filePath);
  const eocdSignature = 0x06054b50;
  let eocdOffset = -1;
  for (let index = buffer.length - 22; index >= 0; index -= 1) {
    if (buffer.readUInt32LE(index) === eocdSignature) {
      eocdOffset = index;
      break;
    }
  }
  assert.ok(eocdOffset >= 0, "XLSX invalido: diretorio ZIP nao encontrado");

  const centralDirSize = buffer.readUInt32LE(eocdOffset + 12);
  const centralDirOffset = buffer.readUInt32LE(eocdOffset + 16);
  const entries = new Map();
  let cursor = centralDirOffset;
  const end = centralDirOffset + centralDirSize;

  while (cursor < end) {
    assert.equal(buffer.readUInt32LE(cursor), 0x02014b50, "Entrada ZIP central invalida");
    const compression = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const fileNameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localHeaderOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString("utf8", cursor + 46, cursor + 46 + fileNameLength);

    const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const data = buffer.subarray(dataStart, dataStart + compressedSize);
    const inflated = compression === 0 ? data : zlib.inflateRawSync(data);
    entries.set(name.replace(/\\/g, "/"), inflated.toString("utf8"));

    cursor += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function columnIndex(cellRef) {
  const letters = /^[A-Z]+/.exec(cellRef)?.[0] || "";
  return [...letters].reduce((total, char) => total * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function readPassengersSheet(filePath) {
  const entries = readZipEntries(filePath);
  const sharedStringsXml = entries.get("xl/sharedStrings.xml") || "";
  const sharedStrings = [...sharedStringsXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) => (
    [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((text) => decodeXml(text[1])).join("")
  ));
  const sheetXml = entries.get("xl/worksheets/sheet1.xml");
  assert.ok(sheetXml, "Aba Passengers nao encontrada em sheet1.xml");

  const rows = [...sheetXml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map((rowMatch) => {
    const cells = [];
    for (const cellMatch of rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const ref = /\br="([^"]+)"/.exec(attrs)?.[1] || "";
      const type = /\bt="([^"]+)"/.exec(attrs)?.[1] || "";
      const raw = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1] || "";
      const value = type === "s" ? sharedStrings[Number(raw)] || "" : decodeXml(raw);
      cells[columnIndex(ref)] = value;
    }
    return cells;
  });

  const headers = rows[0].map((item) => String(item || "").trim());
  return rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = String(cells[index] || "").trim();
    });
    return record;
  });
}

assert.ok(fs.existsSync(workbookPath), "Arquivo XLSX real precisa estar na pasta do projeto");

const rawRows = readPassengersSheet(workbookPath);
const normalized = normalizeImportedRows(rawRows);
const programs = buildImportPrograms(normalized);

assert.equal(rawRows.length, 286, "deve ler 286 linhas de dados do XLSX real");
assert.deepEqual(
  REQUIRED_XLSX_HEADERS.filter((header) => !(header in rawRows[0])),
  [],
  "todos os cabecalhos obrigatorios devem existir"
);
assert.equal(programs.length, 131, "deve agrupar 131 programacoes externas por PG");
assert.ok(
  programs.some((program) => program.trechos.some((trecho) => trecho.solicitanteNome)),
  "trechos devem carregar o solicitante externo para cadastro automatico"
);

const multiSegmentProgram = programs.find((program) => program.programacao === "PG2026/31241");
assert.ok(multiSegmentProgram, "PG2026/31241 deve existir no resumo");
assert.equal(multiSegmentProgram.trechos.length, 1, "PG2026/31241 deve nascer como uma OS unica por PG");
assert.ok(multiSegmentProgram.trechos[0].retornoPrevistoHorario, "PG2026/31241 deve calcular horario previsto de retorno");

const sharedPickupPrograms = buildImportPrograms([
  {
    sourceRow: 2,
    programacao: "PGTEST/1",
    solicitacao: "ST1",
    data: "20/05/2026",
    dataIso: "2026-05-20",
    horario: "08:00",
    origem: "Av. Brigadeiro Faria Lima, 1000",
    origemKey: "av brigadeiro faria lima 1000",
    destino: "Hotel A",
    destinoKey: "hotel a",
    cidadeOrigem: "Sao Paulo",
    cidadeDestino: "Sao Paulo",
    nomePassageiro: "ANA TESTE",
    telefone: "11999990000",
    centroCusto: "CR1",
    motoristaNome: "Carlos",
    prefixoMotorista: "CAR-01",
    tipoTransporteExterno: "Carro executivo",
    tipoServicoSugerido: "Dentro de Sao Paulo",
    tipoVeiculoSugerido: "Executivo",
    valor: 100
  },
  {
    sourceRow: 3,
    programacao: "PGTEST/1",
    solicitacao: "ST2",
    data: "20/05/2026",
    dataIso: "2026-05-20",
    horario: "08:00",
    origem: "Av. Brigadeiro Faria Lima, 1000",
    origemKey: "av brigadeiro faria lima 1000",
    destino: "Hotel B",
    destinoKey: "hotel b",
    cidadeOrigem: "Sao Paulo",
    cidadeDestino: "Sao Paulo",
    nomePassageiro: "BRUNO TESTE",
    telefone: "11988880000",
    centroCusto: "CR2",
    motoristaNome: "Carlos",
    prefixoMotorista: "CAR-01",
    tipoTransporteExterno: "Carro executivo",
    tipoServicoSugerido: "Dentro de Sao Paulo",
    tipoVeiculoSugerido: "Executivo",
    valor: 120
  }
]);
const sharedPickupTrecho = sharedPickupPrograms[0].trechos[0];
assert.equal(sharedPickupPrograms[0].trechos.length, 1, "mesma PG deve virar um unico servico por padrao");
assert.deepEqual(sharedPickupTrecho.passageiros.map((passenger) => passenger.nome), ["ANA TESTE", "BRUNO TESTE"], "ordem dos passageiros deve seguir a ordem da planilha");
assert.deepEqual(sharedPickupTrecho.passageiros.map((passenger) => passenger.destino), ["Hotel A", "Hotel B"], "destino individual deve ficar editavel por passageiro");
assert.equal(sharedPickupTrecho.origem, "08:00 - ANA, BRUNO - Av. Brigadeiro Faria Lima, 1000", "enderecos iguais devem agrupar passageiros no endereco de saida");
assert.equal(sharedPickupTrecho.destino, "08:00 - ANA - Hotel A\n08:00 - BRUNO - Hotel B", "destinos diferentes devem ser consolidados por horario, pax e destino");
assert.equal(sharedPickupTrecho.retornoPrevistoHorario, "", "horarios iguais nao devem preencher retorno previsto");

const waitPrograms = buildImportPrograms([
  {
    sourceRow: 10,
    programacao: "PGWAIT/1",
    solicitacao: "ST10",
    data: "20/05/2026",
    dataIso: "2026-05-20",
    horario: "08:00",
    origem: "Hotel A",
    origemKey: "hotel a",
    destino: "Escritorio A",
    destinoKey: "escritorio a",
    cidadeOrigem: "Sao Paulo",
    cidadeDestino: "Campinas",
    nomePassageiro: "ANA TESTE",
    telefone: "11999990000",
    centroCusto: "CR1",
    tipoServicoSugerido: "Dentro de Sao Paulo",
    tipoVeiculoSugerido: "Executivo",
    valor: 100,
    solicitanteNome: "SOLICITANTE TESTE",
    observacao: "Aguardar no local"
  },
  {
    sourceRow: 11,
    programacao: "PGWAIT/1",
    solicitacao: "ST11",
    data: "20/05/2026",
    dataIso: "2026-05-20",
    horario: "08:00",
    origem: "Hotel A",
    origemKey: "hotel a",
    destino: "Escritorio B",
    destinoKey: "escritorio b",
    cidadeOrigem: "Sao Paulo",
    cidadeDestino: "Campinas",
    nomePassageiro: "BRUNO TESTE",
    telefone: "11988880000",
    centroCusto: "CR2",
    tipoServicoSugerido: "Dentro de Sao Paulo",
    tipoVeiculoSugerido: "Executivo",
    valor: 120,
    solicitanteNome: "SOLICITANTE TESTE"
  },
  {
    sourceRow: 12,
    programacao: "PGWAIT/1",
    solicitacao: "ST12",
    data: "20/05/2026",
    dataIso: "2026-05-20",
    horario: "17:00",
    origem: "Escritorio A",
    origemKey: "escritorio a",
    destino: "Hotel A",
    destinoKey: "hotel a",
    cidadeOrigem: "Campinas",
    cidadeDestino: "Sao Paulo",
    nomePassageiro: "ANA TESTE",
    telefone: "11999990000",
    centroCusto: "CR1",
    tipoServicoSugerido: "Dentro de Sao Paulo",
    tipoVeiculoSugerido: "Executivo",
    valor: 100,
    solicitanteNome: "SOLICITANTE TESTE"
  }
]);
const waitTrecho = waitPrograms[0].trechos[0];
assert.equal(waitPrograms[0].trechos.length, 1, "ida e volta da mesma PG devem virar uma OS de espera por padrao");
assert.equal(waitTrecho.horario, "08:00", "saida deve usar o menor horario da PG");
assert.equal(waitTrecho.retornoPrevistoDataIso, "2026-05-20", "retorno previsto deve usar a data da linha mais tarde");
assert.equal(waitTrecho.retornoPrevistoHorario, "17:00", "retorno previsto deve usar o maior horario da PG");
assert.deepEqual(waitTrecho.passageiros.map((passenger) => passenger.nome), ["ANA TESTE", "BRUNO TESTE"], "mesmo pax em horarios diferentes nao deve duplicar relacionamento");
assert.equal(waitTrecho.origem, "08:00 - ANA, BRUNO - Hotel A\n17:00 - ANA - Escritorio A", "endereco de saida deve listar todas as linhas agrupando endereco igual");
assert.equal(waitTrecho.destino, "08:00 - ANA - Escritorio A\n08:00 - BRUNO - Escritorio B\n17:00 - ANA - Hotel A", "destino deve listar todas as linhas por horario e destino");
assert.equal(waitTrecho.trajetoCidades, "Sao Paulo / Campinas / Sao Paulo", "trajeto deve usar sequencia unica de cidades");
assert.equal(waitTrecho.operationalMode, IMPORT_OPERATIONAL_MODES.SEPARABLE, "PG com dois horarios sem indicacao de espera deve sugerir ida/busca separaveis");
assert.equal(waitTrecho.operationalDecision, IMPORT_OPERATIONAL_DECISIONS.PENDING, "PG separavel deve exigir decisao operacional antes de confirmar");
assert.equal(waitTrecho.operationalSuggestion, "Ida + busca separaveis", "sugestao deve falar a linguagem operacional");
assert.ok(waitTrecho.pendencias.includes("Decidir se motorista fica a disposicao ou separar ida/busca."), "PG separavel deve ficar pendente ate decisao humana");

applyImportOperationalDecision(waitTrecho, IMPORT_OPERATIONAL_DECISIONS.KEEP_WAITING);
assert.equal(waitTrecho.operationalDecision, IMPORT_OPERATIONAL_DECISIONS.KEEP_WAITING, "decisao de manter espera deve ficar registrada");
assert.ok(!waitTrecho.pendencias.includes("Decidir se motorista fica a disposicao ou separar ida/busca."), "manter espera deve liberar a pendencia operacional");

const multiDatePrograms = buildImportPrograms([
  { ...waitPrograms[0].trechos[0].linhasImportadas[0], sourceRow: 20, programacao: "PGDATE/1", data: "20/05/2026", dataIso: "2026-05-20" },
  { ...waitPrograms[0].trechos[0].linhasImportadas[0], sourceRow: 21, programacao: "PGDATE/1", data: "21/05/2026", dataIso: "2026-05-21", horario: "09:00" }
]);
assert.ok(multiDatePrograms[0].trechos[0].pendencias.includes("PG com datas diferentes."), "PG com datas diferentes deve bloquear revisao manual");

const splitClone = splitImportedTrecho(waitPrograms[0], waitTrecho, { key: "PGWAIT/1|split|1" });
assert.equal(waitTrecho.retornoPrevistoHorario, "", "Split deve limpar retorno previsto da OS original");
assert.equal(waitTrecho.operationalDecision, IMPORT_OPERATIONAL_DECISIONS.SPLIT, "Split deve registrar decisao operacional na OS original");
assert.equal(splitClone.key, "PGWAIT/1|split|1", "Split deve criar chave estavel na PG");
assert.equal(splitClone.importOrigin, "split", "Split deve marcar origem tecnica");
assert.equal(splitClone.reviewStatus, IMPORT_REVIEW_STATUSES.PENDING, "Split deve nascer pendente");
assert.deepEqual(splitClone.passageiros.map((passenger) => passenger.nome), ["ANA TESTE", "BRUNO TESTE"], "Split deve copiar pax unicos");
assert.equal(splitClone.dataIso, "2026-05-20", "Split deve pre-preencher data da busca quando houver linha de retorno clara");
assert.equal(splitClone.horario, "17:00", "Split deve pre-preencher horario da busca quando houver linha de retorno clara");
assert.equal(splitClone.origem, "17:00 - ANA - Escritorio A", "Split deve pre-preencher endereco de saida da busca");
assert.equal(splitClone.destino, "17:00 - ANA - Hotel A", "Split deve pre-preencher destino da busca");
assert.equal(splitClone.trajetoCidades, "Campinas / Sao Paulo", "Split deve pre-preencher trajeto da busca");
assert.equal(splitClone.operationalDecision, IMPORT_OPERATIONAL_DECISIONS.SPLIT_DRAFT, "clone deve nascer como rascunho de busca separada");

const manualTrecho = createManualImportTrecho(sharedPickupPrograms[0], { key: "PGTEST/1|manual|1" });
assert.equal(manualTrecho.key, "PGTEST/1|manual|1", "servico manual deve receber chave estavel dentro da PG");
assert.equal(manualTrecho.programacao, "PGTEST/1", "servico manual deve nascer dentro da mesma PG");
assert.equal(manualTrecho.originStatus, "Manual", "servico adicionado pelo usuario deve exibir status Manual");
assert.equal(manualTrecho.importOrigin, "manual", "servico manual deve manter origem tecnica manual");
assert.equal(manualTrecho.reviewStatus, IMPORT_REVIEW_STATUSES.PENDING, "servico manual deve iniciar como rascunho pendente");
assert.deepEqual(manualTrecho.passageiros, [], "servico manual deve nascer sem passageiros preenchidos");
assert.equal(manualTrecho.destino, "", "servico manual deve permitir preenchimento total pelo inspector");

const exactDuplicateScore = scoreImportedTrechoDuplicate(sharedPickupTrecho, {
  recordId: "reserva-exata",
  programacao: "PGTEST/1",
  dataSaida: "2026-05-20T08:00:00",
  trajeto: "Sao Paulo > Sao Paulo",
  enderecoView: "Av. Brigadeiro Faria Lima, 1000",
  destino: "1. ANA - Hotel A;\n2. BRUNO - Hotel B",
  paxView: "ANA TESTE - 11999990000; BRUNO TESTE - 11988880000"
});
assert.equal(exactDuplicateScore.level, "exact", "mesma PG so bloqueia quando o servico tambem bate por horario/trajeto/endereco/pax");
assert.ok(exactDuplicateScore.reasons.includes("mesmo horario"), "duplicidade deve explicar horario");
assert.ok(exactDuplicateScore.reasons.includes("mesmos passageiros"), "duplicidade deve explicar passageiros");

const samePgDifferentServiceScore = scoreImportedTrechoDuplicate(sharedPickupTrecho, {
  recordId: "reserva-outra",
  programacao: "PGTEST/1",
  dataSaida: "2026-05-20T15:30:00",
  trajeto: "Sao Paulo > Campinas",
  enderecoView: "Rua Oscar Freire, 200",
  destino: "Aeroporto de Viracopos",
  paxView: "CARLA TESTE - 11977770000"
});
assert.notEqual(samePgDifferentServiceScore.level, "exact", "mesma PG com outro servico nao pode bloquear");

const possibleDuplicateScore = scoreImportedTrechoDuplicate(sharedPickupTrecho, {
  recordId: "reserva-parecida",
  programacao: "PGTEST/1",
  dataSaida: "2026-05-20T08:10:00",
  trajeto: "Sao Paulo > Sao Paulo",
  enderecoView: "Av Brigadeiro Faria Lima 1000",
  destino: "Hotel A / Hotel B",
  paxView: "ANA TESTE"
});
assert.equal(possibleDuplicateScore.level, "possible", "servico muito parecido deve avisar sem bloquear automaticamente");

const allTrechos = programs.flatMap((program) => program.trechos);
assert.ok(allTrechos.length > 0, "fixture deve gerar trechos importados");
assert.ok(IMPORT_REVIEW_STATUSES, "core deve exportar estados de revisão de importados");
assert.ok(
  allTrechos.every((trecho) => trecho.reviewStatus === IMPORT_REVIEW_STATUSES.PENDING),
  "todo trecho importado deve iniciar como Pendente para revisão humana"
);

const reviewTrechos = [
  {
    key: "ok",
    reviewStatus: IMPORT_REVIEW_STATUSES.PENDING,
    passageiros: []
  },
  {
    key: "bad",
    reviewStatus: IMPORT_REVIEW_STATUSES.PENDING,
    passageiros: []
  },
  {
    key: "ignored",
    reviewStatus: IMPORT_REVIEW_STATUSES.PENDING,
    passageiros: []
  },
  {
    key: "saved",
    reviewStatus: IMPORT_REVIEW_STATUSES.PENDING,
    passageiros: []
  }
];

confirmImportedTrechoReview(reviewTrechos[0], []);
assert.equal(reviewTrechos[0].reviewStatus, IMPORT_REVIEW_STATUSES.CONFIRMED, "confirmar sem pendencia deve marcar Confirmado");

confirmImportedTrechoReview(reviewTrechos[1], ["Destino vazio."]);
assert.equal(reviewTrechos[1].reviewStatus, IMPORT_REVIEW_STATUSES.BLOCKED, "confirmar com pendencia deve marcar Bloqueado");
assert.equal(reviewTrechos[1].reviewBlockReason, "Destino vazio.", "Bloqueado deve guardar o motivo exato");

ignoreImportedTrechoReview(reviewTrechos[2]);
assert.equal(reviewTrechos[2].reviewStatus, IMPORT_REVIEW_STATUSES.IGNORED, "ignorar deve marcar Ignorado");

markImportedTrechoSaved(reviewTrechos[3], "reserva-1");
assert.equal(reviewTrechos[3].reviewStatus, IMPORT_REVIEW_STATUSES.SAVED, "salvar deve marcar Salvo");
assert.equal(reviewTrechos[3].savedRecordId, "reserva-1", "Salvo deve manter o id criado");

let summary = summarizeImportReviewTrechos(reviewTrechos);
assert.equal(summary.canScheduleConfirmed, false, "Agendar confirmados deve bloquear enquanto houver Bloqueado");
assert.deepEqual(summary.saveableTrechos.map((trecho) => trecho.key), ["ok"], "Ignorado nao entra nos trechos para salvar");
assert.equal(summary.counts.ignored, 1, "Ignorado deve aparecer no resumo");
assert.equal(summary.counts.saved, 1, "Salvo deve aparecer no resumo");

markImportedTrechoPending(reviewTrechos[0]);
assert.equal(reviewTrechos[0].reviewStatus, IMPORT_REVIEW_STATUSES.PENDING, "editar trecho confirmado deve voltar para Pendente");

console.log("xlsx_import_parser: ok");
