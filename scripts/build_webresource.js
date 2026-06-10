const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const shouldBumpVersion = !process.argv.includes("--no-version");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function inlineScript(source) {
  return String(source).replace(/<\/script/gi, "<\\/script");
}

function readCodeVersion() {
  const version = JSON.parse(read("version.json")).version;
  return String(version || "1.0.0.0");
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(root, relativePath), content, "utf8");
}

function bumpPatchVersion(version) {
  const parts = String(version || "1.0.0").split(".").map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part) || part < 0)) {
    throw new Error(`Versao invalida em version.json: ${version}`);
  }
  parts[2] += 1;
  return parts.join(".");
}

function resolveBuildVersion() {
  const current = readCodeVersion();
  if (!shouldBumpVersion) return current;
  const next = bumpPatchVersion(current);
  write("version.json", `${JSON.stringify({ version: next }, null, 2)}\n`);
  return next;
}

const buildVersion = resolveBuildVersion();
let html = read("index.html");
html = html.replace(
  /(<span id="codeVersionText">)([^<]*)(<\/span>)/u,
  `$1${buildVersion}$3`
);
if (shouldBumpVersion) write("index.html", html);
const css = read("styles.css");
const sheetjs = read("vendor/xlsx.full.min.js");
const core = read("scripts/xlsx_import_core.js");
const app = read("app.js");

const placeholders = {
  css: "<!-- INLINE_STYLES_CSS -->",
  sheetjs: "<!-- INLINE_SHEETJS -->",
  core: "<!-- INLINE_XLSX_IMPORT_CORE -->",
  app: "<!-- INLINE_APP_JS -->"
};

html = html
  .replace(/<link rel="stylesheet" href="styles\.css">\s*/u, placeholders.css)
  .replace(/\s*<script src="vendor\/xlsx\.full\.min\.js"><\/script>/u, `\n  ${placeholders.sheetjs}`)
  .replace(/\s*<script src="scripts\/xlsx_import_core\.js"><\/script>/u, placeholders.core)
  .replace(/\s*<script src="app\.js"><\/script>/u, placeholders.app);

for (const [name, marker] of Object.entries(placeholders)) {
  if (!html.includes(marker)) {
    throw new Error(`Placeholder nao encontrado: ${name}`);
  }
}

html = html
  .replace(placeholders.css, () => `<style>\n${css}\n</style>\n`)
  .replace(placeholders.sheetjs, () => `\n  <script id="xlsxLibrarySource" type="application/x-formulario-vendor">\n${inlineScript(sheetjs)}\n  </script>`)
  .replace(placeholders.core, () => `\n  <script>\n${inlineScript(core)}\n  </script>`)
  .replace(placeholders.app, () => `\n  <script>\n${inlineScript(app)}\n  </script>`);

fs.writeFileSync(path.join(root, "webresource.html"), html, "utf8");
console.log(`webresource.html gerado | versao ${buildVersion}${shouldBumpVersion ? "" : " (--no-version)"}`);
