const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const {
  REQUIRED_XLSX_HEADERS,
  normalizeImportedRows,
  buildImportPrograms
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
assert.equal(multiSegmentProgram.trechos.length, 2, "PG2026/31241 deve manter ida e volta como trechos separados");
assert.equal(
  multiSegmentProgram.trechos.reduce((total, trecho) => total + trecho.passageiros.length, 0),
  6,
  "PG2026/31241 deve preservar todos os passageiros das linhas originais"
);

const staggeredProgram = programs.find((program) => program.programacao === "PG2026/31766");
assert.ok(staggeredProgram, "PG2026/31766 deve existir no resumo");
assert.ok(
  staggeredProgram.trechos.some((trecho) => trecho.passageiros.length === 3 && trecho.horario === "06:00"),
  "PG2026/31766 deve consolidar pickups escalonados pelo destino do trecho"
);

console.log("xlsx_import_parser: ok");
