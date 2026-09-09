import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { listFolderMessages, sendMail } from "./outlook_graph.mjs";
import { buildDraftRecords, normalizeEmailBody, readJsonFile } from "./ai_schedule_core.mjs";
import { draftTargets, prepareDrafts, upsertDraft } from "./dataverse_ai_drafts.mjs";

const localRoot = path.resolve(process.env.AI_LOCAL_DATA_DIR || "data/local/ai-scheduling");

function stableMessageId(message) {
  return String(message?.id || message?.internetMessageId || "").trim();
}

export async function pullMessages() {
  const result = await listFolderMessages(process.env.OUTLOOK_FOLDER_ID, process.env.AI_MESSAGE_TOP || 25);
  const messages = (result.value || []).map((message) => ({
    ...message,
    id: stableMessageId(message),
    body: { contentType: "text", content: normalizeEmailBody(message.body?.content || message.bodyPreview || "") }
  }));
  await mkdir(localRoot, { recursive: true });
  await Promise.all(messages.filter((message) => message.id).map((message) => writeFile(path.join(localRoot, `${encodeURIComponent(message.id)}.json`), JSON.stringify(message, null, 2), "utf8")));
  return messages;
}

export async function processMessage(messageFile, extractionFile) {
  const [message, extraction] = await Promise.all([readJsonFile(messageFile), readJsonFile(extractionFile)]);
  const drafts = prepareDrafts(message, extraction);
  const targets = draftTargets();
  const ids = [];
  const errors = [];
  for (const draft of drafts) {
    for (const target of targets) {
      try {
        ids.push({ environment: target.name, id: await upsertDraft(draft, target) });
      } catch (error) {
        errors.push({ environment: target.name, message: safeErrorMessage(error) });
      }
    }
  }
  if (errors.length) await notifyTargetErrors(message, errors);
  return { messageId: stableMessageId(message), drafts: drafts.length, ids, errors };
}

function safeErrorMessage(error) {
  return String(error?.message || error || "Erro desconhecido")
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/(token|secret|password|sig)=([^&\s]+)/gi, "$1=[redacted]")
    .slice(0, 500);
}

async function notifyTargetErrors(message, errors) {
  const recipient = process.env.AI_ALERT_EMAIL_TO;
  if (!recipient) return;
  const subject = `Alerta agendamento IA — falha Dataverse (${errors.map((item) => item.environment).join(", ")})`;
  const lines = [
    "A automação de agendamento IA encontrou falha ao gravar rascunhos.",
    `Mensagem: ${stableMessageId(message) || "sem identificador"}`,
    `Assunto: ${String(message?.subject || "sem assunto").slice(0, 200)}`,
    "",
    ...errors.map((item) => `Ambiente ${item.environment}: ${item.message}`),
    "",
    "O processamento dos demais ambientes não foi interrompido."
  ];
  try {
    await sendMail({ to: recipient, subject, body: lines.join("\n") });
  } catch (error) {
    console.error(`Falha ao enviar alerta de ambiente: ${safeErrorMessage(error)}`);
  }
}

if (process.argv[1]?.endsWith("ai_schedule_worker.mjs")) {
  const command = process.argv[2] || "pull";
  if (command === "pull") console.log(JSON.stringify(await pullMessages(), null, 2));
  else if (command === "process") console.log(JSON.stringify(await processMessage(process.argv[3], process.argv[4]), null, 2));
  else if (command === "preview") {
    const [messageFile, extractionFile] = process.argv.slice(3);
    const message = await readJsonFile(messageFile);
    const extraction = await readJsonFile(extractionFile);
    console.log(JSON.stringify(buildDraftRecords({ message, extraction }), null, 2));
  } else throw new Error("Uso: pull | process <message.json> <extraction.json> | preview <message.json> <extraction.json>");
}
