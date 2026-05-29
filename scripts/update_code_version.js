const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const versionPath = path.join(root, "version.json");
const indexPath = path.join(root, "index.html");

const PART_INDEX = {
  app: 0,
  build: 1,
  feat: 2,
  fix: 3
};

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function readVersion() {
  const data = JSON.parse(readText(versionPath));
  const parts = String(data.version || "1.0.0.0").split(".").map((part) => Number(part));
  while (parts.length < 4) parts.push(0);
  return parts.slice(0, 4).map((part) => (Number.isFinite(part) && part >= 0 ? part : 0));
}

function resolveKind() {
  const explicit = process.argv.find((arg) => arg.startsWith("--kind="));
  if (explicit) return normalizeKind(explicit.slice("--kind=".length));

  const messagePath = process.argv[2];
  if (!messagePath || !fs.existsSync(messagePath)) return "fix";

  const message = readText(messagePath).trimStart();
  const firstLine = message.split(/\r?\n/u)[0] || "";
  const match = firstLine.match(/^([a-z]+)(?:\([^)]+\))?!?:/iu);
  return normalizeKind(match?.[1] || "fix");
}

function normalizeKind(kind) {
  const normalized = String(kind || "").toLowerCase();
  if (normalized === "app") return "app";
  if (normalized === "build") return "build";
  if (normalized === "feat" || normalized === "feature") return "feat";
  return "fix";
}

function bumpVersion(parts, kind) {
  const index = PART_INDEX[kind];
  parts[index] += 1;
  for (let i = index + 1; i < parts.length; i += 1) {
    parts[i] = 0;
  }
  return parts.join(".");
}

function updateIndex(version) {
  const html = readText(indexPath);
  const updated = html.replace(
    /(<span id="codeVersionText">)([^<]*)(<\/span>)/u,
    `$1${version}$3`
  );

  if (updated === html) {
    throw new Error("codeVersionText nao encontrado em index.html");
  }

  writeText(indexPath, updated);
}

function run() {
  const kind = resolveKind();
  const nextVersion = bumpVersion(readVersion(), kind);
  writeText(versionPath, `${JSON.stringify({ version: nextVersion }, null, 2)}\n`);
  updateIndex(nextVersion);
  execFileSync(process.execPath, [path.join(root, "scripts", "build_webresource.js")], {
    cwd: root,
    stdio: "inherit"
  });
  console.log(`Versao do codigo: ${nextVersion} (${kind})`);
}

run();
