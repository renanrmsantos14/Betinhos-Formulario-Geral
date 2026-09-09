import { mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import dns from "node:dns";

// Algumas redes Windows anunciam IPv6, mas não roteiam a saída HTTPS do Node.
// O Graph continua acessível por IPv4; priorizar IPv4 evita timeout no device-code.
dns.setDefaultResultOrder("ipv4first");

const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
const AUTH_ROOT = (tenant) => `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0`;
const tokenDirectory = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"), "Betinhos", "formulario-geral");

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Configuração obrigatória ausente: ${name}`);
  return value;
}

async function runPowerShell(args, input = "", environment = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", ...args], {
      windowsHide: true,
      env: { ...process.env, ...environment }
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve({ stdout, stderr }) : reject(Object.assign(new Error(stderr.trim() || `PowerShell terminou com código ${code}`), { code })));
    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

async function protectSecret(value, cacheKey = "outlook") {
  const secretFile = path.join(tokenDirectory, `${cacheKey}-token.xml`);
  await mkdir(path.dirname(secretFile), { recursive: true });
  const script = "$input | ConvertTo-SecureString -AsPlainText -Force | Export-Clixml -LiteralPath $env:BETINHOS_TOKEN_PATH";
  await runPowerShell(["-Command", script], value, { BETINHOS_TOKEN_PATH: secretFile });
}

async function unprotectSecret(cacheKey = "outlook") {
  const secretFile = path.join(tokenDirectory, `${cacheKey}-token.xml`);
  try {
    const script = "$s = Import-Clixml -LiteralPath $env:BETINHOS_TOKEN_PATH; $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s); try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }";
    const result = await runPowerShell(["-Command", script], "", { BETINHOS_TOKEN_PATH: secretFile });
    return result.stdout.trim();
  } catch (error) {
    if (error.code === "ENOENT" || error.code === 1) return "";
    throw error;
  }
}

async function deviceToken(scope, cacheKey, tenantName = "OUTLOOK_TENANT_ID", clientName = "OUTLOOK_CLIENT_ID") {
  const tenant = required(tenantName);
  const clientId = required(clientName);
  const root = AUTH_ROOT(tenant);
  const device = await fetch(`${root}/devicecode`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, scope: `${scope} offline_access` })
  }).then(assertResponse).then((response) => response.json());
  console.log(device.message);
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, (device.interval || 5) * 1000));
    const response = await fetch(`${root}/token`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:device_code", client_id: clientId, device_code: device.device_code })
    });
    const body = await response.json();
    if (response.ok) {
      await protectSecret(body.refresh_token, cacheKey);
      return body.access_token;
    }
    if (body.error !== "authorization_pending") throw new Error(body.error_description || body.error);
  }
}

export async function getDelegatedAccessToken({ scope, cacheKey = "outlook", tenantEnv = "OUTLOOK_TENANT_ID", clientEnv = "OUTLOOK_CLIENT_ID" }) {
  const tenant = required(tenantEnv);
  const clientId = required(clientEnv);
  const refreshToken = await unprotectSecret(cacheKey);
  if (!refreshToken) return deviceToken(scope, cacheKey, tenantEnv, clientEnv);
  const response = await fetch(`${AUTH_ROOT(tenant)}/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", client_id: clientId, refresh_token: refreshToken, scope: `${scope} offline_access` })
  });
  const body = await response.json();
  if (!response.ok) return deviceToken(scope, cacheKey, tenantEnv, clientEnv);
  if (body.refresh_token) await protectSecret(body.refresh_token, cacheKey);
  return body.access_token;
}

function assertResponse(response) {
  if (!response.ok) throw new Error(`Microsoft Graph respondeu ${response.status}`);
  return response;
}

export async function graphRequest(resource, options = {}) {
  const token = await getDelegatedAccessToken({ scope: "Mail.Read", cacheKey: "outlook" });
  const response = await fetch(`${GRAPH_ROOT}${resource}`, { ...options, headers: { authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  return assertResponse(response).then((value) => value.json());
}

export async function listMailFolders() {
  return graphRequest("/me/mailFolders?$select=id,displayName,parentFolderId");
}

export async function listFolderMessages(folderId, top = 25) {
  if (!folderId) throw new Error("OUTLOOK_FOLDER_ID ausente.");
  const safeTop = Math.min(Math.max(Number(top) || 25, 1), 50);
  const resource = `/me/mailFolders/${encodeURIComponent(folderId)}/messages?$top=${safeTop}&$orderby=receivedDateTime%20desc&$select=id,internetMessageId,conversationId,subject,from,sender,receivedDateTime,body,bodyPreview,hasAttachments`;
  return graphRequest(resource, { headers: { Prefer: 'IdType="ImmutableId"' } });
}

export async function sendMail({ to, subject, body }) {
  const recipients = String(to || "").split(/[;,]/).map((address) => address.trim()).filter(Boolean);
  if (!recipients.length) throw new Error("AI_ALERT_EMAIL_TO ausente.");
  const token = await getDelegatedAccessToken({ scope: "Mail.Send", cacheKey: "outlook-mail-send" });
  const response = await fetch(`${GRAPH_ROOT}/me/sendMail`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      message: {
        subject: String(subject || "Alerta de integração Dataverse"),
        body: { contentType: "Text", content: String(body || "") },
        toRecipients: recipients.map((address) => ({ emailAddress: { address } }))
      },
      saveToSentItems: true
    })
  });
  if (!response.ok) throw new Error(`Microsoft Graph respondeu ${response.status} ao enviar alerta.`);
}

if (process.argv[1]?.endsWith("outlook_graph.mjs")) {
  const command = process.argv[2] || "folders";
  const result = command === "messages" ? await listFolderMessages(process.env.OUTLOOK_FOLDER_ID) : await listMailFolders();
  console.log(JSON.stringify(result, null, 2));
}
