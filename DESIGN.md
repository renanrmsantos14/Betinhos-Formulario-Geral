# Design

## Theme

Interface clara para equipe operacional usando monitor de escritorio durante o dia, com uso eventual em notebook e tablet. O visual deve ser calmo, limpo e confiavel.

## Color

- Strategy: restrained product palette.
- Canvas: neutral quente levemente azulado.
- Surfaces: camadas brancas/tintadas, sem branco puro.
- Accent: azul Fluent profundo para acao primaria e selecao.
- Secondary states: verde para sucesso, amber para alerta, vermelho para erro.
- Use OKLCH tokens in CSS.

## Typography

- Font stack: `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, system UI.
- Labels: 11px uppercase, peso alto, baixo ruido.
- Inputs: 14px, boa legibilidade.
- Headings: escala contida, sem display font.

## Layout

- App shell com topbar fixa visualmente, navegacao lateral no desktop e tabs horizontais no tablet/mobile.
- Formularios por grupos logicos.
- Grid responsivo: 4 colunas desktop, 2 colunas tablet, 1 coluna mobile.
- Footer de acao sticky apenas onde ha acao secundaria local.

## Components

- Field containers com borda sutil, foco forte e micro elevation.
- Segmented controls para observacoes.
- Switches/toggles com tratamento visual consistente.
- Passenger rows como linhas operacionais, nao cards promocionais.
- Toasts e overlays com motion curto.

## Motion

- 150ms a 260ms.
- Easing principal: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Animar opacity, transform, color, border e shadow.
- Nao animar layout.
- Respeitar `prefers-reduced-motion`.
