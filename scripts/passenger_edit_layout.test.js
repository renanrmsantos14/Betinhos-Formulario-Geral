const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

function extractRule(selector, source = css) {
  const start = source.indexOf(`${selector} {`);
  assert.ok(start >= 0, `Regra nao encontrada: ${selector}`);
  const braceStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(braceStart + 1, index);
  }
  throw new Error(`Regra incompleta: ${selector}`);
}

function extractMedia(query) {
  let start = css.indexOf(query);
  assert.ok(start >= 0, `Media query nao encontrada: ${query}`);
  while (start >= 0) {
    const braceStart = css.indexOf("{", start);
    let depth = 0;
    for (let index = braceStart; index < css.length; index += 1) {
      const char = css[index];
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
      if (depth === 0) {
        const mediaBody = css.slice(braceStart + 1, index);
        if (mediaBody.includes(".passenger-edit-fields")) return mediaBody;
        break;
      }
    }
    start = css.indexOf(query, start + query.length);
  }
  throw new Error(`Media query sem passenger-edit-fields: ${query}`);
}

const baseFields = extractRule(".passenger-edit-fields");
assert.match(
  baseFields,
  /grid-template-columns:\s*minmax\(0,\s*1fr\);/,
  "campos de editar pax devem ocupar 100% do popup no layout base"
);
assert.doesNotMatch(
  baseFields,
  /repeat\(\s*2\s*,/,
  "editar pax nao deve usar duas colunas"
);

const mobileCss = extractMedia("@media (max-width: 760px)");
const mobileFields = extractRule(".passenger-edit-fields", mobileCss);
assert.match(
  mobileFields,
  /grid-template-columns:\s*minmax\(0,\s*1fr\);/,
  "campos de editar pax devem continuar em 100% no mobile"
);
assert.match(
  mobileFields,
  /max-height:\s*calc\(100svh - 150px\);/,
  "lista de campos deve rolar dentro do popup no mobile"
);

console.log("passenger_edit_layout: ok");
