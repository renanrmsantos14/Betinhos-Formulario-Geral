import { getDelegatedAccessToken } from "./outlook_graph.mjs";
import { buildDraftRecords, normalizeExtraction, validateExtraction } from "./ai_schedule_core.mjs";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Configuração obrigatória ausente: ${name}`);
  return value.replace(/\/$/, "");
}

function draftTable() {
  return process.env.AI_DRAFT_TABLE || "";
}

function draftFields() {
  const raw = process.env.AI_DRAFT_FIELDS_JSON;
  if (!raw) throw new Error("AI_DRAFT_FIELDS_JSON ausente. Informe o mapeamento lógico dos campos da tabela de rascunhos.");
  let value;
  try { value = JSON.parse(raw); } catch { throw new Error("AI_DRAFT_FIELDS_JSON inválido."); }
  const requiredFields = ["id", "stableMessageId", "ordinal"];
  for (const field of requiredFields) if (!value[field]) throw new Error(`Campo obrigatório ausente no mapeamento: ${field}`);
  return value;
}

function draftStatusValues() {
  const raw = process.env.AI_DRAFT_STATUS_VALUES_JSON;
  if (!raw) return {};
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : {};
  } catch {
    throw new Error("AI_DRAFT_STATUS_VALUES_JSON inválido.");
  }
}

function assertDraftTable() {
  if (!draftTable()) throw new Error("AI_DRAFT_TABLE ausente. Configure o nome lógico criado na solução do Dataverse.");
  return draftTable();
}

async function dataverseToken() {
  const baseUrl = required("DATAVERSE_URL");
  return getDelegatedAccessToken({ scope: `${baseUrl}/user_impersonation`, cacheKey: "dataverse", tenantEnv: "OUTLOOK_TENANT_ID", clientEnv: "OUTLOOK_CLIENT_ID" });
}

export async function upsertDraft(record) {
  const table = assertDraftTable();
  const fields = draftFields();
  const statusValues = draftStatusValues();
  const baseUrl = required("DATAVERSE_URL");
  const token = await dataverseToken();
  const headers = { authorization: `Bearer ${token}`, "content-type": "application/json", Accept: "application/json" };
  const stableValue = String(record.messageId || "").replace(/'/g, "''");
  const lookupFields = [fields.id || fields.stableMessageId, fields.status].filter(Boolean).join(",");
  const lookupUrl = `${baseUrl}/api/data/v9.2/${table}?$select=${encodeURIComponent(lookupFields)}&$filter=${encodeURIComponent(`${fields.stableMessageId} eq '${stableValue}' and ${fields.ordinal} eq ${Number(record.ordinal) || 0}`)}`;
  const existingResponse = await fetch(lookupUrl, { headers });
  if (!existingResponse.ok) throw new Error(`Dataverse respondeu ${existingResponse.status} na busca de idempotência.`);
  const existing = await existingResponse.json();
  const existingRow = existing.value?.[0];
  const entityId = existingRow?.[fields.id || ""];
  const scheduledValue = Number(statusValues.Agendado ?? statusValues.scheduled);
  if (entityId && Number.isFinite(scheduledValue) && Number(existingRow?.[fields.status]) === scheduledValue) return entityId;
  const payload = {};
  const put = (name, value) => { if (fields[name] && value !== undefined && value !== null) payload[fields[name]] = value; };
  put("stableMessageId", record.messageId);
  put("conversationId", record.conversationId);
  put("subject", record.subject);
  put("sender", record.sender);
  put("receivedAt", record.receivedAt);
  put("body", record.body);
  put("extractionJson", record.extractionJson);
  put("ordinal", record.ordinal);
  put("legType", record.legType);
  put("legJson", record.legJson);
  put("status", statusValues[record.status] ?? record.status);
  put("warnings", record.warnings?.join("\n"));
  put("confidence", record.confidence);
  put("extractorVersion", record.extractorVersion);
  put("hasAttachments", record.hasAttachments);
  put("processedAt", record.processedAt);
  const response = await fetch(entityId ? `${baseUrl}/api/data/v9.2/${table}(${entityId})` : `${baseUrl}/api/data/v9.2/${table}`, {
    method: entityId ? "PATCH" : "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Dataverse respondeu ${response.status}: ${await response.text()}`);
  return entityId || response.headers.get("odata-entityid") || "";
}

export function prepareDrafts(message, extraction) {
  const checked = validateExtraction(normalizeExtraction(extraction));
  return buildDraftRecords({ message, extraction: checked.extraction });
}

if (process.argv[1]?.endsWith("dataverse_ai_drafts.mjs")) {
  const [messageFile, extractionFile] = process.argv.slice(2);
  if (!messageFile || !extractionFile) throw new Error("Uso: node scripts/dataverse_ai_drafts.mjs <message.json> <extraction.json>");
  const [message, extraction] = await Promise.all([import(messageFile, { with: { type: "json" } }), import(extractionFile, { with: { type: "json" } })]);
  console.log(JSON.stringify(prepareDrafts(message.default, extraction.default), null, 2));
}
