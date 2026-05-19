# Design System: Tela Formulário Geral
**Project ID:** local-webresource-tela-formulario-geral  
**Registro:** product  
**Última análise:** 2026-05-19

## 1. Visual Theme & Atmosphere

Interface de produto operacional, não landing page. A tela deve parecer uma ferramenta interna premium para agendamento executivo: limpa, densa, segura e rápida de preencher.

O visual atual usa uma base clara, painéis brancos, navegação lateral compacta e controles com acabamento inspirado no Microsoft Fluent. A estética correta é "Fluent operacional moderno": familiar o bastante para uso diário, mais refinada que formulário legado de intranet.

A sensação física: operador de atendimento ou operação usando a tela dentro do Model-driven App, em desktop ou notebook, durante rotina real de agendamento. O design precisa reduzir dúvida, não impressionar.

Princípios obrigatórios:

- Priorizar fluxo e leitura dos campos.
- Preservar densidade sem apertar áreas críticas.
- Usar cor como estado, foco e ação, não decoração.
- Manter navegação e formulários previsíveis.
- Nunca transformar a tela em dashboard SaaS genérico.
- Nunca criar hero, bloco promocional ou layout de marketing.

## 2. Color Palette & Roles

### Base Neutra

- **Neve Operacional (#f9fbff):** início do fundo principal. Usado no topo do gradiente de página.
- **Azul Gelo de Superfície (#f3f6fb):** fundo geral da aplicação. Mantém leveza sem branco puro dominante.
- **Branco de Trabalho (#ffffff):** superfícies principais, painéis, inputs e menus. Estado atual do CSS usa branco puro; em evolução futura, preferir neutro tintado para reduzir dureza.
- **Cinza Frio de Campo (#f5f7fa):** fundo de campos e áreas editáveis em repouso.
- **Cinza de Camada (#eceff5):** fundo de segmented controls e áreas agrupadas.
- **Azul de Seleção Suave (#eaf2ff):** seleção, aba ativa e estados de foco leve.

### Texto

- **Azul Preto de Leitura (#0f172a):** texto principal, títulos e conteúdo crítico.
- **Grafite Operacional (#111827):** texto forte secundário, IDs e informações de apoio.
- **Cinza Azulado de Label (#475569):** labels, navegação inativa e metadados.
- **Cinza de Apoio (#64748b):** descrições, textos auxiliares e notas.
- **Cinza Frio de Marca (#7f8ea3):** eyebrow da marca.

### Marca e Ação

- **Azul Betinhos Digital (#2159d2):** ação primária, foco, seleção e estado ativo.
- **Azul Betinhos Forte (#194ec4):** variação de ação ativa e texto de seleção.
- **Azul de Hover (#2d66e6):** hover do botão primário.
- **Azul de Borda Viva (#2768d9):** borda do botão primário.
- **Azul Marca Escuro (#142e6b):** brand mark.
- **Azul Marca Profundo (#1f3c7f):** borda do brand mark.

### Estados

- **Verde Confirmação (#168f57):** sucesso, toast positivo e confirmação.
- **Verde Suave (#e7f6ec):** fundo de sucesso discreto.
- **Verde Status Vivo (#36b37e):** ponto pulsante de disponibilidade/estado ativo.
- **Vermelho Bloqueio (#c12f45):** erro, campo obrigatório e toast de falha.
- **Vermelho Suave (#fdecee):** fundo de erro discreto.
- **Amarelo Atenção (#b17a00):** alerta e estados pendentes.
- **Amarelo Suave (#fff4cf):** toast warning e fundo de atenção.

### Linhas e Bordas

- **Linha Fria (#dfe6f2):** borda padrão de painéis, campos e divisores.
- **Linha Forte (#bfccde):** hover, contraste de agrupamento e delimitação secundária.

## 3. Typography Rules

Fonte principal: **Manrope** via Google Fonts, com fallback para **Aptos**, **Segoe UI**, system-ui, -apple-system, Helvetica Neue e Arial.

Uso correto:

- **H1:** 21px, peso 760, linha curta, sem quebra em desktop.
- **H2:** 24px, peso 780, usado como título da seção ativa.
- **H3:** 14px, peso 780, usado em grupos de formulário.
- **Labels:** 11px, peso 800, tracking leve de 0.055em.
- **Botões:** 12px a 14px, peso alto entre 760 e 800.
- **Textos de apoio:** 12px a 13px, cor suavizada, line-height entre 1.35 e 1.45.

Regras:

- Uma única família tipográfica é correta para este produto.
- Não usar fonte monoespaçada como acento visual.
- Não usar display font.
- Não usar escala fluida por viewport.
- Não usar letter-spacing negativo.
- Textos de label podem ser compactos, mas devem continuar legíveis.

## 4. Component Stylings

### Shell

A aplicação usa shell de produto com largura de 100%, sem `max-width` no formulário. O layout deve ocupar todo o espaço disponível do web resource, com padding compacto e grid desktop em duas áreas: menu lateral compacto e conteúdo principal.

O topo fica sticky, compacto, com altura mínima aproximada de 46px, borda fria fina, sombra suave e fundo branco. A marca aparece como bloco quadrado compacto de 30px, azul profundo, canto de 8px e letra/imagem centralizada.

### Navegação

Menu lateral compacto com largura de 58px. Expande para 210px em hover ou foco. Em telas menores que 1240px, vira barra horizontal.

Cada aba usa ícone linear, label oculto no estado compacto e item ativo com fundo azul claro. O menu deve continuar funcional sem depender de animação.

Abas atuais:

- Detalhes.
- Cadastrar Passageiro.
- Retorno.
- Repetir.

### Painéis

Conteúdo principal fica em superfície branca com borda fria, raio de 16px e sombra suave. Painéis inativos ficam ocultos; painel ativo entra com fade e deslocamento curto.

Seções internas usam raio de 12px, padding de 16px, borda fria e sombra interna leve. Isso é aceitável porque são agrupamentos funcionais de formulário, não cards decorativos.

### Formulários

Grid base de 12 colunas. Campos padrão ocupam 3 colunas no desktop e 6 colunas em telas médias. No mobile, tudo vira uma coluna.

Campo padrão:

- Altura mínima de 66px.
- Padding de 8px.
- Fundo cinza frio.
- Borda de 1px.
- Raio de 8px.
- Foco com borda azul e halo de 3px.
- Hover só reforça borda, sem espetáculo.

Inputs, selects e textareas:

- Altura mínima de 34px.
- Raio de 6px.
- Padding lateral de 10px.
- Fundo branco.
- Borda fria.
- Sem outline nativo.

Campos obrigatórios usam asterisco vermelho no label. Erros devem ser diretos e perto do campo afetado.

### Custom Selects

Selects nativos ficam invisíveis e sincronizados. A interface visível usa `.custom-select-trigger`, painel flutuante, busca interna e opção ativa.

Regras:

- Todos os selects devem manter busca quando a lista for longa.
- O trigger precisa ter o mesmo vocabulário visual dos inputs.
- Painel aberto deve ter sombra de painel, borda fria e opção ativa azul suave.
- Não criar dropdown isolado fora da infraestrutura compartilhada.

### Botões

Botão primário:

- Azul Betinhos Digital (#2159d2).
- Borda azul viva (#2768d9).
- Raio de 8px.
- Altura mínima de 34px.
- Peso 790.
- Hover com azul mais vivo e elevação curta.
- Active com scale leve.

Botão secundário:

- Fundo branco.
- Texto azul.
- Borda fria.
- Raio de 8px.
- Hover com fundo cinza de camada e deslocamento de -1px.

Botões destrutivos ou de remoção devem ser compactos, reconhecíveis e nunca competir com a ação primária de agendamento.

### Segmented Controls

Usados para alternar tipo de observação. O container usa fundo cinza de camada, padding de 4px e quatro colunas no desktop. No mobile, duas colunas.

Segmento ativo usa fundo escuro (#0f1725), texto branco e sombra curta. Isto cria contraste claro sem adicionar outra cor ao sistema.

### Toggles

Switches usam trilho de 40x22px, pílula cinza em repouso e azul em ativo. O knob tem 16px e movimento curto.

### Passageiros

Bloco de passageiros é superfície funcional crítica. Deve ter título, toolbar compacta, cabeçalho de lista e rows com comportamento de foco claro.

Regras:

- Manter ação de adicionar visível.
- Manter alternância de endereço único clara.
- Passageiro incompleto deve receber estado visual de atenção.
- Preview de passageiro deve ser informativo, não decorativo.
- Em endereço compartilhado, layout divide lista e textarea em duas áreas no desktop; no mobile empilha.

### Toasts

Toasts ficam no canto inferior direito, largura máxima de 460px, fundo escuro para neutro, vermelho para erro, verde para sucesso e amarelo suave para warning.

Toast deve ter botão de fechar manual quando persistente ou relevante. Auto-dismiss não substitui dismiss manual.

### Dialogs e Overlays

Overlay usa fundo escuro translúcido. Dialog usa largura máxima de 520px, raio de 16px, superfície branca e sombra de shell.

Usar modal só quando a ação realmente bloquear o fluxo. Preferir edição inline quando possível.

## 5. Layout Principles

### Desktop

Desktop é a experiência principal. A tela usa topbar sticky, navegação lateral sticky e conteúdo amplo. O layout correto é de ferramenta operacional, não página institucional.

Prioridades:

- Topbar sempre mostra marca, status, ID e ação principal.
- Menu lateral não pode roubar espaço do formulário.
- Conteúdo deve manter leitura em blocos claros.
- Seções críticas ficam acima da dobra: agenda, rota, tipo de serviço, veículo, motorista e passageiros.

### Tablet e telas médias

Abaixo de 1240px, o menu vira barra horizontal. Campos passam para metade da largura. Passageiros preservam estrutura, mas reduzem a complexidade da lista.

### Mobile

Abaixo de 760px:

- Shell usa padding de 8px.
- Topbar empilha.
- Ação primária ocupa largura total.
- Tabs ficam horizontais e roláveis.
- Painel reduz padding para 14px.
- Grid vira uma coluna.
- Segmented control vira 2x2.
- Dialogs respeitam altura real do viewport.

Mobile deve ser usável, mas não deve ditar a densidade desktop.

## 6. Motion & Interaction

Motion atual é curta e funcional:

- Superfícies entram em 320ms a 400ms.
- Painel ativo entra em 220ms.
- Hover e foco variam entre 150ms e 190ms.
- Toast entra em 210ms.
- Dialog entra em 220ms.
- Passageiro novo entra em 320ms, com delay curto por índice.

Curvas:

- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`.
- `--ease-standard: cubic-bezier(0.2, 0, 0, 1)`.
- `--menu-motion: cubic-bezier(0.22, 1, 0.36, 1)`.
- `--menu-soft: cubic-bezier(0.33, 1, 0.68, 1)`.

Regras:

- Motion deve indicar foco, troca de aba, entrada de row, toast e modal.
- Não animar por vaidade.
- Respeitar `prefers-reduced-motion`.
- Não usar bounce, elastic ou animação longa.

## 7. Elevation & Geometry

Raios:

- **6px:** inputs e controles pequenos.
- **8px:** botões, campos e itens de lista.
- **12px:** blocos de formulário e brand mark.
- **16px:** topbar, menu, conteúdo e dialogs.
- **999px:** pills, toggles e indicadores circulares.

Sombras:

- **Shell:** `0 14px 28px rgb(22 35 59 / 0.08)`.
- **Painel:** `0 8px 24px rgb(22 35 59 / 0.08)`.
- **Controle:** sombra interna clara + sombra curta de repouso.
- **Foco:** halo azul de 3px com 20% de opacidade.

A profundidade deve ser percebida, não dramática. Evitar sombras pesadas em campos repetidos.

## 8. Accessibility Rules

- Foco visível obrigatório em botões, inputs, selects customizados e itens de lista.
- Estados não podem depender só de cor.
- Alvos interativos devem manter altura prática de 34px a 42px.
- Reduzir motion quando o usuário solicitar.
- Labels devem continuar associados aos campos reais.
- Select customizado deve preservar o select nativo sincronizado para contrato e acessibilidade.
- Toasts importantes precisam ser legíveis e fecháveis.

## 9. Anti-Patterns Proibidos

- Landing page.
- Hero.
- Card decorativo sem função.
- Grid de cards iguais para explicar recursos.
- Gradiente em texto.
- Glassmorphism decorativo.
- Azul usado como decoração espalhada.
- Fonte display.
- Fonte monoespaçada como estilo.
- Modal como primeira solução.
- Recriar componentes padrão com comportamento estranho.
- Quebrar IDs, `data-*`, handlers ou contrato do `app.js` por causa visual.

## 10. Current Design Audit

### O que está certo

- Shell já parece ferramenta operacional.
- Hierarquia principal está clara: topbar, tabs, painel, seções, campos.
- Cor de marca está contida em ações e foco.
- Custom select virou infraestrutura compartilhada.
- Layout tem breakpoints reais para desktop, tablet e mobile.
- Motion é curta e respeita redução de movimento.
- Produto preserva a lógica de quatro áreas: Detalhes, Banco de Dados, Retorno e Repetir.

### O que ainda merece correção futura

- O CSS ainda usa `#ffffff` e `#000000`; para acabamento premium, trocar por neutros tintados.
- Há risco de excesso de cards funcionais se novas seções repetirem o padrão sem necessidade.
- Menu expansível por hover pode ser menos previsível em touch; manter fallback horizontal nos breakpoints.
- A identidade visual depende muito do azul; novas telas devem introduzir cor apenas por estado ou dado operacional.
- Validação visual precisa ser feita em browser real antes de considerar o design fechado.

## 11. Implementation Contract

Este design system é documentação do estado atual e direção futura. Ele não autoriza quebrar o contrato técnico.

Preservar sempre:

- IDs existentes do HTML.
- `data-tab`, `data-panel`, `data-*` usados pelo JavaScript.
- Handlers do `app.js`.
- Fluxo de abas.
- Estrutura funcional do formulário.
- Mock mode e comportamento fora do Model-driven App.

Mudança visual deve ser CSS-first quando o comportamento já estiver correto.
