const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "127.0.0.1";
const liveReloadEnabled = process.argv.includes("--watch") || process.argv.includes("--reload");
const liveReloadPath = "/__dev_reload";
const liveReloadClients = new Set();
let liveReloadTimer = null;

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
]);

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.resolve(root, relativePath);

  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    return null;
  }

  return filePath;
}

function send(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": contentType
  });
  response.end(body);
}

function injectLiveReload(html) {
  if (!liveReloadEnabled) {
    return html;
  }

  const snippet = [
    "<script>",
    "(() => {",
    "  const events = new EventSource('/__dev_reload');",
    "  events.addEventListener('reload', () => location.reload());",
    "})();",
    "</script>"
  ].join("");

  if (html.includes("</body>")) {
    return html.replace("</body>", `${snippet}</body>`);
  }

  return `${html}${snippet}`;
}

function shouldIgnoreWatchPath(changedPath) {
  if (!changedPath) {
    return false;
  }

  const normalized = changedPath.replaceAll("\\", "/");
  return [
    "/.git/",
    "/.chrome-profile-codex/",
    "/.chrome-profile-codex-mobile/",
    "/.edge-profile-codex/",
    "/.playwright-cli/",
    "/.tmp-import-layout-profile/",
    "/graphify-out/"
  ].some((ignoredPart) => normalized.includes(ignoredPart));
}

function notifyLiveReloadClients() {
  for (const client of liveReloadClients) {
    client.write("event: reload\ndata: now\n\n");
  }
}

function scheduleLiveReload() {
  clearTimeout(liveReloadTimer);
  liveReloadTimer = setTimeout(notifyLiveReloadClients, 150);
}

const server = http.createServer((request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    send(response, 405, "Metodo nao permitido");
    return;
  }

  const url = new URL(request.url, `http://${host}:${port}`);
  if (liveReloadEnabled && url.pathname === liveReloadPath) {
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8"
    });
    response.write(": connected\n\n");
    liveReloadClients.add(response);
    request.on("close", () => liveReloadClients.delete(response));
    return;
  }

  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    send(response, 403, "Acesso negado");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      send(response, 404, "Arquivo nao encontrado");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes.get(extension) || "application/octet-stream";

    if (liveReloadEnabled && extension === ".html" && request.method !== "HEAD") {
      fs.readFile(filePath, "utf8", (readError, html) => {
        if (readError) {
          send(response, 500, "Erro ao ler arquivo");
          return;
        }

        const body = injectLiveReload(html);
        response.writeHead(200, {
          "Cache-Control": "no-store",
          "Content-Length": Buffer.byteLength(body),
          "Content-Type": contentType
        });
        response.end(body);
      });
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Length": stat.size,
      "Content-Type": contentType
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    fs.createReadStream(filePath).pipe(response);
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Porta ${port} em uso. Rode com outra porta: set PORT=3001 && npm run dev`);
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Servidor local: http://${host}:${port}`);
  if (liveReloadEnabled) {
    console.log("Live reload: ativo");
  }
});

if (liveReloadEnabled) {
  fs.watch(root, { recursive: true }, (eventType, filename) => {
    const changedPath = filename ? path.resolve(root, filename) : "";
    if (shouldIgnoreWatchPath(changedPath)) {
      return;
    }

    scheduleLiveReload();
  });
}
