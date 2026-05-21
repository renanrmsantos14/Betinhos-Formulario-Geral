const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

function extractRule(selector, source) {
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

function extractMedia(query, requiredText) {
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
        if (!requiredText || mediaBody.includes(requiredText)) return mediaBody;
        break;
      }
    }
    start = css.indexOf(query, start + query.length);
  }
  throw new Error(`Media query sem trecho esperado: ${query}`);
}

const tabletCss = extractMedia("@media (max-width: 1240px)", ".tabs");
const tabletTabs = extractRule(".tabs", tabletCss);
const tabletTab = extractRule(".tab", tabletCss);
const tabletActiveTab = extractRule(".tab.is-active", tabletCss);
const tabletHoverTab = extractRule(".tab:hover", tabletCss);

assert.match(
  tabletTabs,
  /display:\s*flex;/,
  "tablet deve usar nav tab horizontal"
);
assert.match(
  tabletTabs,
  /justify-content:\s*center;/,
  "tablet deve centralizar a tab bar no shell"
);
assert.match(
  tabletTabs,
  /height:\s*auto;/,
  "tablet deve remover a altura fixa herdada da sidebar desktop"
);
assert.match(
  tabletTabs,
  /background:\s*#ffffff;/,
  "tablet deve usar a mesma superficie limpa das tabs, sem gradiente"
);
assert.match(
  tabletTabs,
  /scrollbar-width:\s*none;/,
  "tablet nao deve parecer carrossel quebrado com scrollbar visivel"
);
assert.doesNotMatch(
  tabletTabs,
  /linear-gradient/,
  "tablet nao deve usar gradiente fora do design system da navegacao"
);

assert.match(
  tabletTab,
  /flex:\s*1\s+1\s+0;/,
  "abas de tablet devem distribuir a largura disponivel"
);
assert.match(
  tabletTab,
  /min-width:\s*0;/,
  "abas de tablet nao devem forcar overflow por largura minima alta"
);
assert.match(
  tabletTab,
  /justify-items:\s*center;/,
  "abas de tablet devem se comportar como tab bar, nao como cards laterais"
);
assert.match(
  tabletTab,
  /text-align:\s*center;/,
  "texto das abas de tablet deve ficar alinhado ao centro"
);

assert.doesNotMatch(
  tabletHoverTab,
  /translateY/,
  "hover de tablet nao deve levantar cards"
);
assert.doesNotMatch(
  tabletActiveTab,
  /linear-gradient/,
  "aba ativa de tablet nao deve usar card com gradiente"
);

console.log("tablet_tabs_layout: ok");
