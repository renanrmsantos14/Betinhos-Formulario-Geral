import assert from "node:assert/strict";
import { handleAiScheduleApi } from "./ai_schedule_local_api.js";

const proposal = {
  intent: "schedule",
  assistantMessage: "Falta confirmar o cliente.",
  question: "Qual é o cliente?",
  confidence: 0.92,
  client: { name: "Tenaris", id: null, proposedRegistration: null },
  requester: { name: "Maria Souza", id: null, proposedRegistration: null },
  passengers: [{ name: "Ana Souza", id: null, proposedRegistration: null }],
  services: [{
    ordinal: 1,
    date: "2026-09-15",
    time: "08:30",
    timezone: "America/Sao_Paulo",
    origin: "São Paulo",
    destination: "GRU",
    serviceType: { label: "Guarulhos", value: 202410000 },
    vehicleType: { label: "Executivo", value: 202410001 },
    observations: ""
  }],
  missingFields: ["client.id"],
  warnings: []
};

const calls = [];
const result = await handleAiScheduleApi({ message: "Agendar amanhã às 08:30 de São Paulo para GRU" }, {
  apiKey: "test-key",
  fetchImpl: async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body), authorization: options.headers.Authorization });
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify(proposal) } }], usage: { total_tokens: 18 } }) };
  }
});
assert.equal(result.status, 200);
assert.equal(result.body.model, "deepseek-v4-flash");
assert.equal(result.body.attempts, 1);
assert.equal(calls.length, 1);
assert.equal(calls[0].url, "https://api.deepseek.com/chat/completions");
assert.equal(calls[0].body.response_format.type, "json_object");
assert.equal(calls[0].body.thinking.type, "disabled");
assert.equal(calls[0].authorization, "Bearer test-key");

const fallbackCalls = [];
const fallbackResult = await handleAiScheduleApi({ message: "Solicitação completa" }, {
  apiKey: "test-key",
  fetchImpl: async (_url, options) => {
    fallbackCalls.push(JSON.parse(options.body).model);
    const lowConfidence = { ...proposal, confidence: 0.2, missingFields: [] };
    const responseProposal = fallbackCalls.length === 1 ? lowConfidence : proposal;
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify(responseProposal) } }] }) };
  }
});
assert.equal(fallbackResult.status, 200);
assert.deepEqual(fallbackCalls, ["deepseek-v4-flash", "deepseek-v4-pro"]);
assert.equal(fallbackResult.body.attempts, 2);

const invalidJsonCalls = [];
const invalidJsonResult = await handleAiScheduleApi({ message: "JSON quebrado na primeira tentativa" }, {
  apiKey: "test-key",
  fetchImpl: async (_url, options) => {
    invalidJsonCalls.push(JSON.parse(options.body).model);
    const content = invalidJsonCalls.length === 1 ? "não é json" : JSON.stringify(proposal);
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content } }] }) };
  }
});
assert.equal(invalidJsonResult.status, 200);
assert.deepEqual(invalidJsonCalls, ["deepseek-v4-flash", "deepseek-v4-pro"]);

const missingKey = await handleAiScheduleApi({ message: "teste" }, { apiKey: "" });
assert.equal(missingKey.status, 503);
assert.match(missingKey.body.error, /DEEPSEEK_API_KEY/);

const tooLong = await handleAiScheduleApi({ message: "x".repeat(12001) }, { apiKey: "test-key" });
assert.equal(tooLong.status, 413);

console.log("ai_schedule_local_api.test: ok");
