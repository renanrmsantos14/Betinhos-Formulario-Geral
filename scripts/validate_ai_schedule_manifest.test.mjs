import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateManifest } from "./validate_ai_schedule_manifest.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs", "power-platform", "ai_schedule_solution_manifest.json"), "utf8"));

const unresolved = validateManifest(manifest);
assert.equal(unresolved.ok, false);
assert.ok(unresolved.errors.some((error) => error.includes("PREENCHER_SOLUCAO_DEV")));

const resolved = {
  solution: { name: "BetinhosDEV", publisher: "BetinhosPublisher", environment: "DEV" },
  sessionTable: {
    logicalName: "cr40f_conversaiaagendamento", entitySetName: "cr40f_conversaiaagendamentos", primaryNameAttribute: "cr40f_name",
    columns: [{ logicalName: "cr40f_status", type: "Choice" }, { logicalName: "cr40f_versaoentrada", type: "WholeNumber" }]
  },
  reservationTable: {
    logicalName: "cr40f_reservadeveiculos",
    requiredAdditions: [
      { logicalName: "cr40f_conversaoiaagendamento", type: "Lookup", target: "cr40f_conversaiaagendamento" },
      { logicalName: "cr40f_iaordinalservico", type: "WholeNumber" }
    ],
    alternateKey: { name: "cr40f_ak_conversaia_ordinal", columns: ["cr40f_conversaoiaagendamento", "cr40f_iaordinalservico"], status: "published" }
  },
  connector: { name: "Betinhos DeepSeek", connectionReference: "cr40f_deepseek_connection" }
};
const metadata = {
  tables: [
    { logicalName: resolved.sessionTable.logicalName, entitySetName: resolved.sessionTable.entitySetName, primaryNameAttribute: resolved.sessionTable.primaryNameAttribute, attributes: [{ logicalName: "cr40f_status", type: "Picklist" }, { logicalName: "cr40f_versaoentrada", type: "Integer" }] },
    { logicalName: resolved.reservationTable.logicalName, attributes: [{ logicalName: "cr40f_conversaoiaagendamento", type: "Lookup", targets: ["cr40f_conversaiaagendamento"] }, { logicalName: "cr40f_iaordinalservico", type: "Integer" }] }
  ]
};
assert.deepEqual(validateManifest(resolved, metadata), { ok: true, errors: [] });

console.log("validate_ai_schedule_manifest.test: ok");
