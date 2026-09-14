import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "scripts", "ai_schedule_conversation.js"), "utf8");
const context = { globalThis: {}, console };
vm.runInNewContext(source, context);
const core = context.globalThis.AIScheduleConversationCore;

assert.ok(core, "core de conversa deve exportar API global");
assert.equal(core.normalizeDate("14/09/2026"), "2026-09-14");
assert.equal(core.normalizeTime("8h30"), "08:30");

const incomplete = core.validateProposal({
  client: { id: "client-1", name: "Cliente" },
  requester: { id: "requester-1", name: "Solicitante" },
  passengers: [{ id: "passenger-1", name: "Passageiro" }],
  services: [{ origin: "São Paulo", destination: "GRU" }]
});
assert.equal(incomplete.ready, false);
assert.ok(incomplete.missing.includes("services[0].date"));
assert.ok(incomplete.missing.includes("services[0].serviceType"));

const complete = core.validateProposal({
  client: { id: "client-1", name: "Cliente" },
  requester: { id: "requester-1", name: "Solicitante" },
  passengers: [{ id: "passenger-1", name: "Passageiro" }],
  services: [{
    date: "2026-09-14", time: "08:30", serviceType: { value: 202410000, name: "Guarulhos" },
    vehicleType: { value: 202410001, name: "Executivo" }, origin: "São Paulo", destination: "GRU"
  }]
});
assert.equal(complete.ready, true);
assert.equal(core.nextStatus(complete), core.STATUS.READY);
assert.equal(core.isExplicitConfirmation("Pode ser!", { awaitingConfirmation: true, version: 2 }), true);
assert.equal(core.isExplicitConfirmation("Pode ser!", { awaitingConfirmation: false, version: 2 }), false);
assert.equal(core.isExplicitConfirmation("confirmo", { awaitingConfirmation: true, version: 2, confirmedVersion: 2 }), false);
assert.equal(core.dedupeKey("abc", 3), "abc:3");

const session = core.normalizeSession({ id: "s1", inputVersion: 3, proposal: complete.normalized });
assert.equal(session.ready, true);
assert.equal(session.inputVersion, 3);

console.log("ai_schedule_conversation.test: ok");
