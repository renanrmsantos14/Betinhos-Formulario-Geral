import { readFile } from "node:fs/promises";
import path from "node:path";
import { getDelegatedAccessToken } from "./outlook_graph.mjs";

const args = process.argv.slice(2);
const option = (name, fallback = "") => {
  const index = args.indexOf(name);
  return index >= 0 ? String(args[index + 1] || fallback) : fallback;
};

const environmentUrl = option("--environment", "https://org23b93544.crm2.dynamics.com").replace(/\/$/, "");
const webResourceName = option("--webresource", "new_formulario_geral.html");
const entityLogicalName = option("--entity", "cr40f_solicitacaoiaagendamento");
const filePath = path.resolve(option("--file", "webresource.html"));
const apiBaseUrl = `${environmentUrl}/api/data/v9.2`;

function escapeOData(value) {
  return String(value).replace(/'/g, "''");
}

async function fetchWithRetry(url, options, attempts = 4) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  throw lastError;
}

const token = await getDelegatedAccessToken({
  scope: `${environmentUrl}/user_impersonation`,
  cacheKey: "dataverse-deploy-dev"
});

const headers = {
  authorization: `Bearer ${token}`,
  accept: "application/json",
  "content-type": "application/json",
  "OData-MaxVersion": "4.0",
  "OData-Version": "4.0"
};

async function request(resource, options = {}) {
  const response = await fetchWithRetry(`${apiBaseUrl}${resource}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const text = await response.text();
  let body = null;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  if (!response.ok) {
    const detail = typeof body === "string" ? body : body?.error?.message;
    throw new Error(`Dataverse respondeu ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  return body;
}

console.log(`[deploy-webresource] validate entity ${entityLogicalName}`);
const entity = await request(`/EntityDefinitions(LogicalName='${escapeOData(entityLogicalName)}')?$select=MetadataId,LogicalName`);
if (!entity?.LogicalName) throw new Error(`Entidade Dataverse nao encontrada: ${entityLogicalName}`);

console.log(`[deploy-webresource] lookup ${webResourceName}`);
const lookup = await request(`/webresourceset?$select=webresourceid,name&$filter=name eq '${escapeOData(webResourceName)}'`);
if (!lookup?.value?.length) throw new Error(`WebResource nao encontrado: ${webResourceName}`);
if (lookup.value.length > 1) throw new Error(`Mais de um WebResource encontrado: ${webResourceName}`);

const webResourceId = lookup.value[0].webresourceid;
const html = await readFile(filePath, "utf8");
const content = Buffer.from(html, "utf8").toString("base64");

console.log(`[deploy-webresource] patch ${webResourceId}`);
await request(`/webresourceset(${webResourceId})`, {
  method: "PATCH",
  body: JSON.stringify({ content })
});

const escapedWebResourceId = String(webResourceId).replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character]));
const escapedEntityName = String(entityLogicalName).replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character]));
const parameterXml = `<importexportxml><entities><entity>${escapedEntityName}</entity></entities><webresources><webresource>${escapedWebResourceId}</webresource></webresources></importexportxml>`;

console.log(`[deploy-webresource] publish ${webResourceName} + ${entityLogicalName}`);
await request("/PublishXml", {
  method: "POST",
  body: JSON.stringify({ ParameterXml: parameterXml })
});

console.log(`[deploy-webresource] ok ${webResourceName}`);
