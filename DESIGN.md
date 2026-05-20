# Design System: Tela Formulário Geral

**Project ID:** `local-webresource-tela-formulario-geral`
**Registro:** produto operacional
**Última análise:** 2026-05-20
**Fontes auditadas:** `styles.css`, `index.html`, `app.js`, `PRODUCT.md`, `CONTEXTO_PROJETO.md`, `DESIGN_SYSTEM.html`

## 1. Identidade

Tela operacional interna para agendamento de transporte executivo premium da Betinhos Executive Service.

O produto não é site, landing page, dashboard decorativo nem formulário legado. É uma ferramenta de trabalho para atendimento e operação criarem, editarem e conferirem serviços com velocidade, precisão e baixa margem de erro.

Atmosfera correta:

- Premium discreto.
- Operacional.
- Denso sem parecer apertado.
- Fluent moderno, não Microsoft genérico.
- Seguro, claro e previsível.
- Feito para uso repetido em desktop dentro do Model-driven App.

Decisão visual central:

> A interface deve parecer um cockpit de agendamento executivo: foco em preenchimento, relação passageiro-serviço, validação, retorno e recorrência. Beleza entra como clareza, não como enfeite.

## 2. Princípios

- Fluxo antes de estética.
- Desktop é a experiência principal.
- Mobile precisa funcionar, mas não dita a densidade do desktop.
- Cor serve para ação, foco, estado e risco.
- Superfície branca só quando ajuda leitura.
- Card só quando agrupa função real.
- Motion confirma estado; não compete com o preenchimento.
- Componentes reutilizados vencem ajustes isolados.
- Preservar IDs, `data-*`, handlers e contrato do `app.js`.
- Não mudar comportamento para resolver problema visual.

## 3. Produto E Escopo De UI

Abas principais:

- **Detalhes:** agenda, cliente, rota, passageiros, faturamento, destino e contatos.
- **Cadastrar Passageiro:** criação rápida e manutenção de passageiro existente.
- **Retorno:** serviço de retorno separado.
- **Repetir:** serviços frequentes.

Superfícies globais:

- Topbar sticky.
- Menu lateral expansível.
- Painel de conteúdo.
- Toast stack.
- Overlay de carregamento.
- Overlay de sucesso.
- Picker de passageiro.
- Edição de passageiro.
- Revisão de duplicidade.
- Página de referência visual `DESIGN_SYSTEM.html`.

## 4. Tokens CSS Canônicos

### 4.1 Cores Base

| Token | Nome semântico | Valor | Uso |
|---|---|---:|---|
| `--bg` | Azul gelo de aplicação | `#f3f6fb` | Fundo geral |
| `--bg-2` | Neve operacional | `#f9fbff` | Topo do gradiente de página |
| `--shell` | Marinho de shell | `#0f1725` | Toast neutro, segmento ativo escuro |
| `--shell-2` | Marinho elevado | `#111a2a` | Reserva para camadas escuras |
| `--surface` | Branco de trabalho | `#ffffff` | Painéis, inputs, popups |
| `--surface-soft` | Cinza frio de campo | `#f5f7fa` | Field wrapper e listas |
| `--surface-muted` | Cinza de camada | `#eceff5` | Toggles, segmented, readonly |
| `--surface-active` | Azul de seleção suave | `#eaf2ff` | Aba ativa, seleção e destaque |

### 4.2 Texto

| Token | Nome semântico | Valor | Uso |
|---|---|---:|---|
| `--text` | Azul preto de leitura | `#0f172a` | Títulos e texto principal |
| `--text-soft` | Cinza azulado de label | `#475569` | Labels, metadados e ícones inativos |
| `--muted` | Cinza de apoio | `#64748b` | Descrições, hints e texto auxiliar |

Valores locais relevantes:

- Brand eyebrow: `#7f8ea3`.
- Texto forte secundário: `#111827`.
- Nome de passageiro selecionado: `#052c6f`.
- Placeholder custom select legado: `#00000048`.

### 4.3 Marca E Ação

| Token | Nome semântico | Valor | Uso |
|---|---|---:|---|
| `--accent` | Azul Betinhos Digital | `#2159d2` | Ação primária, foco, seleção |
| `--accent-strong` | Azul Betinhos Forte | `#194ec4` | Hover, estado aberto e seleção forte |
| `--accent-soft` | Azul de apoio leve | `#e6eefb` | Estado ativo discreto |

Valores locais:

- Hover primário: `#2d66e6`.
- Borda de hover primário: `#4a85e7`.
- Marca compacta: `#142e6b`.
- Borda da marca: `#1f3c7f`.
- Opção ativa de dropdown: `#edf4ff`.

### 4.4 Estados

| Token | Nome semântico | Valor | Uso |
|---|---|---:|---|
| `--success` | Verde confirmação | `#168f57` | Toast sucesso e salvamento |
| `--success-soft` | Verde suave | `#e7f6ec` | Background positivo discreto |
| `--danger` | Vermelho bloqueio | `#c12f45` | Toast erro, ação destrutiva |
| `--danger-soft` | Vermelho suave | `#fdecee` | Fundo de erro |
| `--warning` | Amarelo atenção | `#b17a00` | Duplicidade, pendência e campo vazio |
| `--warning-soft` | Amarelo suave | `#fff4cf` | Toast warning e chips de atenção |

Valores locais:

- Erro de campo: `#dc2626`.
- Texto de erro de campo: `#b91c1c`.
- Status ativo/ponto pulsante: `#36b37e`.
- Sucesso alternativo em botão de passageiro: `#0f766e`.
- Warning textual forte: `#8f6317` e `#7c5412`.

### 4.5 Linhas, Raios E Sombras

| Token | Valor | Uso |
|---|---:|---|
| `--line` | `#dfe6f2` | Borda padrão |
| `--line-strong` | `#bfccde` | Hover, separação forte |
| `--radius-xs` | `6px` | Inputs e controles internos |
| `--radius-sm` | `8px` | Campos, botões e itens |
| `--radius-md` | `12px` | Seções e blocos |
| `--radius-lg` | `16px` | Shell, topbar, dialogs |
| `999px` | pílula | Switch, dots e chips |

Sombras:

- `--shadow-shell`: `0 14px 28px rgb(22 35 59 / 0.08)`.
- `--shadow-panel`: `0 8px 24px rgb(22 35 59 / 0.08)`.
- `--shadow-control`: `inset 0 1px 0 rgb(255 255 255 / 0.9), 0 1px 2px rgb(15 23 37 / 0.06)`.
- `--shadow-focus`: `0 0 0 3px rgb(33 89 210 / 0.2)`.
- Preview flutuante de passageiro: `0 18px 42px rgb(15 23 37 / 0.22)`.

Regra:

- Profundidade deve ser sentida, não dramatizada.
- Campos repetidos não recebem sombra pesada.
- Overlays e popups podem elevar mais porque saem do fluxo normal.

### 4.6 Motion

| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrada de superfície e feedback |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Movimento base |
| `--menu-motion` | `cubic-bezier(0.22, 1, 0.36, 1)` | Expansão lateral |
| `--menu-soft` | `cubic-bezier(0.33, 1, 0.68, 1)` | Hover e refinamento do menu |

Durações atuais:

- Topbar: `320ms`.
- Menu: `360ms`.
- Painel ativo: `220ms`.
- Seção: `220ms`.
- Hover/foco: `150ms` a `190ms`.
- Toast: `210ms`.
- Overlay: `180ms`.
- Dialog: `220ms`.
- Passageiro entra: `320ms`.
- Passageiro sai: `220ms`.
- Match item: `220ms`, com delay por índice.

Regra:

- `prefers-reduced-motion: reduce` reduz tudo para `1ms`.
- Não usar bounce, elastic, parallax, orb, glow decorativo ou motion longa.

## 5. Tipografia

Fonte canônica:

```css
"Manrope", "Aptos", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif
```

Escala atual:

| Elemento | Tamanho | Peso | Observação |
|---|---:|---:|---|
| Eyebrow | `10px` | `700` | Marca secundária |
| H1 | `16px` | `760` | Título compacto da topbar |
| H2 | `19px` | `780` | Título de painel |
| H3 | `13px` | `780` | Título de seção |
| Label | `11px` a `12px` | `760` a `820` | Leitura rápida |
| Body auxiliar | `12px` a `13px` | `400` a `760` | Hints, metadados |
| Botão | `12px` a `14px` | `780` a `800` | Comando claro |
| Nome de passageiro | `16px` | `820` | Precisa ser escaneável |

Regras:

- Letter-spacing deve ser `0`, exceto labels técnicos pequenos.
- Não usar fonte display.
- Não usar fonte monoespaçada como acento visual.
- Não usar escala por viewport.
- Texto de botão precisa caber sem clipping.
- Acentos devem ser preservados em todo texto visível.

## 6. Layout

### 6.1 Shell

`.app-shell`:

- Largura total.
- `min-height: 100dvh`.
- Grid desktop: `58px minmax(0, 1fr)`.
- Áreas: topbar, required, tabs, content.
- Gap: `8px`.
- Padding: `10px`.
- Sem `max-width`.

Regra:

- O formulário deve usar todo o espaço do web resource.
- Não centralizar como landing page.
- Não criar faixa hero.

### 6.2 Topbar

`.topbar`:

- Sticky no topo.
- Altura mínima `46px`.
- Padding `6px 9px`.
- Raio `16px`.
- Fundo branco.
- Sombra de shell.
- Mostra marca, status, ID do registro e ação principal.

Marca:

- `.brand-mark`: `30x30px`.
- Fundo `#142e6b`.
- Borda `#1f3c7f`.
- Raio `8px`.

Regra:

- Topbar deve ocupar pouco espaço.
- A ação primária fica visível.
- Status é controle operacional, não decoração.

### 6.3 Navegação

`.tabs`:

- Largura compacta: `58px`.
- Largura expandida: `210px`.
- Rail interno: `44px`.
- Ícone: `22px`.
- Sticky.
- Expande para a direita por hover ou foco.

Tabs:

- `Detalhes`.
- `Cadastrar Passageiro`.
- `Retorno`.
- `Repetir`.

Estados:

- Inativa: texto `#475569`.
- Hover: fundo `#f2f6ff`.
- Ativa: `color-mix(in srgb, var(--surface-active) 68%, #ffffff)`.
- Ícone ativo: fundo `--accent`, texto branco.
- Marcada: dot verde `#36b37e` com pulse.

Regra:

- O menu só cresce para a direita.
- Não animar filhos com jitter.
- Em touch ou largura menor, virar barra horizontal.

### 6.4 Conteúdo

`.content`:

- Área principal com superfície branca.
- Borda `--line`.
- Raio `12px`.
- Sombra `--shadow-panel`.
- Scroll próprio.

`.panel`:

- Só painel ativo aparece.
- Entrada curta: `panel-in 220ms`.

`.panel-stack`:

- Gap `8px`.

### 6.5 Seções

`.form-section` e `.passenger-block`:

- Padding `10px`.
- Gap `10px`.
- Raio `12px`.
- Borda `--line`.
- Fundo `--surface`.
- Sombra `--shadow-control`.

Regra:

- Seção é agrupamento funcional.
- Não duplicar superfície sem necessidade.
- Não colocar card dentro de card por estética.

### 6.6 Grid De Formulário

`.form-grid`:

- Flex wrap.
- Gap `8px`.
- Base de campo: `220px`.
- Campo duplo: `520px` ou largura total.

`.database-passenger-grid`:

- Campo base: `260px`.
- Campo duplo: `520px`.

Regra:

- Usar flex responsivo existente.
- Não voltar para grid rígido se isso quebrar o preenchimento real.
- Campos críticos devem permanecer acima da dobra sempre que possível.

## 7. Componentes

### 7.1 Field

`.field` é o envelope canônico.

Padrão:

- `display: grid`.
- Gap `5px`.
- Altura mínima `66px`.
- Padding `8px`.
- Borda `--line`.
- Raio `8px`.
- Fundo `--surface-soft`.
- Sombra `--shadow-control`.
- Hover reforça borda.
- Focus-within usa `--accent`, fundo branco e `--shadow-focus`.

Estado inválido:

- Borda `#dc2626`.
- Fundo `#fff7f7`.
- Halo vermelho `rgb(220 38 38 / 0.14)`.
- Texto de erro via `data-validation-message`.

Regra:

- Todo input, select e textarea deve viver dentro de `.field`, salvo componente composto.
- Erro fica perto do campo.
- Obrigatório usa `required` e asterisco visual.

### 7.2 Inputs, Textareas E Selects

Controle interno:

- Altura mínima `34px`.
- Raio `6px`.
- Padding `7px 9px`.
- Fundo branco.
- Borda `--line`.
- Sem outline nativo.
- Focus usa `--shadow-focus`.

Readonly:

- Texto `--text-soft`.
- Fundo `--surface-muted`.

Textarea:

- Scrollbar fina.
- Resize controlado conforme componente.

Regra:

- Não inventar casca visual para campo isolado.
- Se o campo é formulário, ele segue o vocabulário de `.field`.

### 7.3 Custom Select

Arquitetura:

- Select nativo fica invisível.
- `.custom-select-trigger` é a interface visível.
- `.custom-select-panel` é fixo no viewport.
- Busca interna usa `.custom-select-search`.
- Opções usam `.custom-select-option`.

Trigger:

- Altura mínima `34px`.
- Borda `--line`.
- Raio `6px`.
- Fundo branco.
- Valor com ellipsis.
- Placeholder atual usa `#00000048`.

Painel:

- `position: fixed`.
- Z-index `2147483647`.
- Altura máxima `min(260px, 42vh)`.
- Raio `8px`.
- Sombra `--shadow-panel`.
- Opção ativa `#edf4ff`.

Regra:

- Todos os selects longos devem ser pesquisáveis.
- Não criar dropdown paralelo fora dessa infraestrutura.
- Manter sincronização com o select nativo.
- Painel precisa escapar de stacking context e overflow.

### 7.4 Select De Status

Uso:

- Controle compacto na topbar.
- Borda mais forte: `2px solid var(--accent)`.
- Hover eleva com sombra azul.
- Aberto reforça foco.

Regra:

- Status é informação operacional crítica.
- Não rebaixar para texto passivo.

### 7.5 Campo De Telefone

`.phone-field` é componente composto.

Estrutura:

- Grid `56px minmax(0, 1fr)`.
- Altura mínima `44px`.
- Raio `10px`.
- País à esquerda.
- Input à direita.
- Label interno `"Telefone"`.

Comportamento documentado pelo `app.js`:

- País padrão: Brasil `+55`.
- Colagem com DDI pode detectar país.
- Troca manual de país preserva intenção do usuário.
- Valor salvo deve ser canônico em estilo internacional.
- Validação brasileira exige DDD e 10 ou 11 dígitos.
- Telefones internacionais aceitam regra geral por DDI.

Dropdown de país:

- Largura mínima preferida: `280px`.
- Busca: `"Buscar país"`.
- Opção mostra bandeira, nome, DDI e check.
- Usa imagem de bandeira com fallback.

Regra:

- Não reintroduzir hint redundante embaixo.
- Não confiar só em emoji para bandeira.
- País manual vence detecção ambígua.

### 7.6 Campo De Moeda

`.currency-field`:

- Prefixo visual `R$`.
- Prefixo posicionado no canto inferior esquerdo.
- Input com `padding-left: 40px`.

Regra:

- Moeda do produto é BRL.
- Não colocar placeholder como substituto do prefixo.

### 7.7 Data E Hora

`.field.compact-time`:

- Campo especial para manter data + hora compactas.
- Altura de controle: `34px`.
- Usa `.inline-time` e `.time-group`.

Regra:

- Não separar data e horário em blocos grandes se isso piorar densidade.
- Evitar layout que empurre campos críticos para baixo.

### 7.8 Observação

`.obs-field`:

- Largura máxima de seletor: `360px`.
- Campo base: `380px`.
- Segmented 4 colunas.
- Segmento ativo usa `--accent` nos campos de observação.
- Textarea min `58px`, max `76px`.

Tipos:

- Motorista.
- Interna.
- Final.
- Preferência do passageiro.

Regra:

- Observação deve parecer campo do formulário, não módulo separado.
- Alternância precisa ser clara e rápida.

### 7.9 Segmented Control

`.segmented`:

- Grid.
- Gap `4px`.
- Padding `4px`.
- Borda `--line`.
- Raio `8px`.
- Fundo `--surface-muted`.

`.seg`:

- Altura mínima `32px`.
- Raio `6px`.
- Texto `--text-soft`.
- Peso `800`.

Ativo global:

- Fundo `--shell`.
- Texto branco.
- Sombra curta.
- TranslateY `-1px`.

Regra:

- Usar para opções mutuamente exclusivas.
- Não usar como botão solto.

### 7.10 Toggle E Switch

`.toggle-field` e `.switch`:

- Altura mínima `78px`.
- Padding `10px`.
- Fundo `--surface-soft`.
- Borda `--line`.
- Raio `8px`.

Input visual:

- Trilho `40x22px`.
- Knob `16px`.
- Ativo: `--accent`.
- Movimento: `translateX(18px)`.

Regra:

- Usar para binários.
- Label sempre visível.

### 7.11 Botões

Primário `.primary-action`:

- Fundo `--accent`.
- Hover `#2d66e6`.
- Borda hover `#4a85e7`.
- Raio `8px`.
- Altura compacta.
- Peso alto.
- Hover sobe discretamente.
- Active remove excesso de sombra.

Secundário `.secondary-action`:

- Fundo branco.
- Texto `--accent`.
- Borda `--line`.
- Raio `8px`.
- Altura mínima `38px`.
- Hover `--surface-muted`.

Texto `.text-action`:

- Igual ao secundário, menor.
- Usar para comando de menor peso.

Ícone `.icon-button`:

- `38x38px`.
- Fundo branco.
- Borda `--line`.
- Cor `--accent`.

Remoção `.remove-row`:

- `32x32px`.
- Sempre no canto superior direito da linha.
- Absoluto: top `10px`, right `10px`.

Regra:

- Ação principal nunca compete com botões auxiliares.
- Destrutivo fica reconhecível, mas não dominante.

### 7.12 Passageiros Selecionados

`passenger-block` é componente crítico.

Estrutura:

- Título.
- Toolbar.
- Lista de linhas.
- Modo endereço por passageiro.
- Modo endereço único.

Toolbar:

- `Endereço único`.
- `Adicionar`.
- Ação pressionada usa `--accent-soft`, `--accent-strong` e halo.

Linha `.passenger-row`:

- Grid com coluna de nome e endereço.
- Padding `10px 52px 10px 10px`.
- Raio `12px`.
- Hover eleva e reforça borda.
- Incompleta usa warning.
- Entrada usa `passenger-enter`.
- Saída usa `passenger-leave`.

Nome:

- Botão com texto forte.
- Cor `#052c6f`.
- Peso `820`.
- Tamanho `16px`.
- Não truncar por padrão.

Preview:

- Preview real é `.passenger-preview-floating`.
- `position: fixed`.
- Z-index máximo.
- Selecionável e copiável.
- Deve permanecer aberto ao mover do gatilho para o popup.

Endereço único:

- Lista fica compacta.
- Textarea compartilhada ocupa área própria.
- No mobile empilha.

Regra:

- Remoção sempre visível, inclusive com 1 passageiro.
- Passageiro incompleto precisa de estado claro.
- Recência local tem prioridade em listas de seleção.

### 7.13 Picker De Passageiro

`.passenger-picker-dialog`:

- Largura modal.
- Fundo `#fbfbfa`.
- Raio `14px`.
- Sombra `0 20px 44px rgb(15 23 37 / 0.14)`.

Busca:

- Campo com ícone de lupa.
- Placeholder: nome, telefone ou email.
- Resultado em listbox.

Item:

- Altura mínima `58px`.
- Fundo `#fbfbfa`.
- Hover vira branco e eleva levemente.
- Ativo usa halo azul.

Regra:

- Picker deve abrir sem focar teclado automaticamente no mobile.
- Busca não pode falhar fechada quando catálogo local ainda não carregou.

### 7.14 Manutenção E Edição De Passageiro

Diretório:

- `.passenger-directory`.
- Altura máxima `min(46vh, 460px)`.
- Fundo `--surface-soft`.
- Itens brancos com sombra de controle.

Edição:

- `.passenger-edit-dialog`: largura `min(920px, 100%)`.
- Altura máxima `min(88vh, 820px)`.
- Campos em uma coluna para cada controle ocupar 100% da largura util do popup.
- Desktop usa linha densa com label a esquerda e controle a direita.
- Mobile empilha label e controle, mantendo o campo em largura total.

Estados:

- `saving`: warning.
- `saved`: success.
- `error`: danger.
- `empty`: chip `"vazio"` e borda warning.

Regra:

- Banco de Dados não é create-only.
- Deve permitir atualizar passageiro existente.
- Edição deve ser explícita: botão de lápis/cadeado controla estado.

### 7.15 Revisão De Duplicidade

`.passenger-match-dialog`:

- Largura `min(640px, calc(100vw - 28px))`.
- Lista com altura máxima `min(44vh, 340px)`.
- Item animado com delay curto.

Match:

- Campo semelhante usa fundo warning suave.
- Razão usa chip pequeno.
- Ações: `Revisar` e `Criar novo`.

Regra:

- Duplicidade provável deve interromper o cadastro.
- Cópia precisa ser direta: `"Passageiro encontrado"`.
- Não esconder motivo técnico do match.

### 7.16 Toast

`.toast-stack`:

- Fixo no canto inferior direito.
- Gap `8px`.
- Z-index `40`.

`.toast`:

- Largura `min(460px, calc(100vw - 32px))`.
- Fundo neutro `--shell`.
- Raio `8px`.
- Sombra de shell.
- Botão de fechar manual.

Tipos:

- `.error`: `--danger`.
- `.success`: `--success`.
- `.warning`: fundo `--warning-soft`, texto `--text`.

Floating toast:

- Z-index máximo.
- Sem botão fechar.
- Pointer-events none.

Regra:

- Auto-dismiss não substitui fechar manual em toast relevante.
- Erro técnico deve ficar tempo suficiente para leitura.

### 7.17 Overlay E Dialog

`.overlay`:

- Fixo.
- Fundo `rgb(15 23 37 / 0.54)`.
- Centralizado.
- Padding `18px`.
- Z-index `60`.

`.dialog`:

- Largura `min(520px, 100%)`.
- Padding `24px`.
- Raio `16px`.
- Fundo `--surface`.
- Sombra de shell.

Regra:

- Modal só quando bloqueia fluxo.
- Preferir edição inline quando não houver risco.
- Em mobile, respeitar altura real do viewport.

## 8. Responsividade

### 8.1 Desktop

Breakpoint dominante: acima de `1240px`.

Comportamento:

- Topbar sticky.
- Menu lateral sticky e expansível.
- Conteúdo com scroll próprio.
- Campos com largura mínima funcional.
- Passageiro pode usar duas áreas quando endereço único estiver ativo.

### 8.2 Tablet E Telas Médias

`@media (max-width: 1240px)`:

- Shell vira uma coluna.
- Menu vira barra horizontal.
- Labels da aba ficam visíveis.
- Passageiro ajusta grid.
- Endereço único mantém duas colunas enquanto couber.

### 8.3 Mobile

`@media (max-width: 760px)`:

- Shell reduz padding.
- Topbar empilha.
- Tabs horizontais.
- Painel reduz padding.
- Fields ocupam largura total.
- Segmented de observação reduz densidade.
- Passageiro empilha nome e endereço.
- Botão remover continua no canto superior direito.
- Picker e edição respeitam viewport.

Regra:

- Não confiar cegamente em `100dvh` no host.
- Testar dentro do contexto real do Model-driven App.
- Evitar foco automático que abra teclado sem intenção.

## 9. Acessibilidade

Obrigatório:

- Foco visível em todo controle.
- `aria-label` em botões de ícone.
- `aria-live` para toasts/status relevantes.
- `aria-modal` em dialogs.
- Select nativo preservado por trás do custom select.
- Labels reais associados a inputs.
- Estados não podem depender só de cor.
- Alvo mínimo prático entre `34px` e `42px`.
- Reduced motion respeitado.

Atenção:

- Dropdown custom precisa navegação por teclado.
- Popup copiável não pode fechar ao cruzar do gatilho para o conteúdo.
- Toast warning com fundo claro precisa contraste suficiente.
- Texto truncado deve preservar informação operacional crítica por tooltip, preview ou painel.

## 10. Conteúdo E Voz

Tom:

- Humano.
- Preciso.
- Seguro.
- Operacional.

Permitido:

- `Agendar serviços`.
- `Selecionar passageiro`.
- `Passageiro encontrado`.
- `Cadastro parecido`.
- `Revisar`.
- `Criar novo`.
- `Endereço único`.

Evitar:

- Linguagem de app de táxi.
- "Excelência em".
- "Solução completa".
- Texto promocional.
- Explicação longa dentro da UI.
- Onboarding visual ocupando área operacional.

Regra:

- UI não deve explicar o produto.
- UI deve permitir executar o trabalho.

## 11. Contrato Técnico

Preservar sempre:

- IDs do HTML.
- `data-tab`.
- `data-panel`.
- `data-obs`.
- `data-ret-obs`.
- `data-select-variant`.
- Handlers de `app.js`.
- Fluxo de abas.
- Mock mode `?mock=1` e `?mockData=1`.
- `Xrm.WebApi` dentro do Model-driven App.
- Selects nativos sincronizados.
- Payload Dataverse.
- Validação de passageiro, telefone, email, retorno e recorrência.

Antes de mudar visual:

1. Procurar seletor e uso no `app.js`.
2. Verificar se o elemento é obrigatório para binding.
3. Confirmar que CSS não depende de DOM removido.
4. Preferir CSS-first quando comportamento estiver correto.
5. Testar fonte, overflow, z-index e mobile.

Proibido:

- Quebrar IDs por refactor visual.
- Remover nó usado por listener sem neutralizar JS.
- Criar outro componente de select.
- Criar popup preso em stacking context.
- Resolver overflow com z-index sem revisar `position`, `overflow` e portal.
- Voltar dropdown nativo onde já existe custom select compartilhado.

## 12. Anti-Patterns

Não fazer:

- Landing page.
- Hero.
- Cards decorativos.
- Dashboard SaaS genérico.
- Grid de cards para explicar recurso.
- Gradiente em texto.
- Glassmorphism decorativo.
- Orbs, blobs ou bokeh.
- Azul espalhado sem função.
- Fonte display.
- Fonte mono como estilo.
- Modal para tudo.
- Animação exagerada em formulário.
- Campo especial com visual fora da família.
- Validação genérica sem campo e motivo.
- Texto sem acento.

## 13. Auditoria Do Estado Atual

### Correto

- Shell já está no caminho de produto operacional.
- Densidade desktop está melhor que formulário legado.
- Tokens principais estão concentrados em `:root`.
- Custom select virou infraestrutura compartilhada.
- Select de país do telefone tem tratamento próprio.
- Passageiro é tratado como bloco crítico, não campo comum.
- Popup de passageiro usa camada fixa copiável.
- Botão de remoção fica absoluto no canto superior direito.
- Banco de Dados já contempla manutenção de passageiro.
- Motion é curta e tem reduced motion.
- Topbar, menu e painel respeitam uso em web resource.

### Frágil

- `DESIGN_SYSTEM.html` ainda é página de referência simples; não substitui teste real.
- CSS usa alguns valores fora de token (`#ffffff`, `#00000048`, `#fbfbfa`, `#052c6f`, `#dc2626`).
- Há comentários de CSS antigo no custom select de status.
- O menu por hover exige fallback cuidadoso em touch.
- O visual depende bastante do azul; novas telas devem segurar a paleta.
- Browser real dentro do Model-driven App continua sendo a validação final.

### Próxima melhoria recomendada

Criar uma segunda camada de tokens:

- `--control-bg`.
- `--control-bg-hover`.
- `--field-error`.
- `--field-error-bg`.
- `--passenger-name`.
- `--picker-bg`.
- `--toast-neutral`.
- `--overlay-bg`.

Isso reduz valores soltos sem mudar visual.

## 14. Checklist Para Nova Tela Ou Componente

Antes de implementar:

- O componente existe no sistema atual?
- Dá para compor com `.field`, `.secondary-action`, `.custom-select` ou `.dialog`?
- O estado precisa de success, danger ou warning?
- Há interação por teclado?
- Há foco visível?
- Há mobile real?
- Há risco de quebrar `app.js`?
- O texto está em pt-BR com acentos?

Durante implementação:

- Usar tokens existentes.
- Preservar DOM funcional.
- Evitar wrapper extra.
- Não empilhar card dentro de card.
- Manter altura estável.
- Evitar shift em hover.
- Testar com conteúdo longo.

Depois:

- Rodar validação de sintaxe.
- Rodar testes locais quando tocar JS.
- Fazer `git diff --check`.
- Validar em browser desktop e mobile.
- Validar dentro do Model-driven App quando houver Dataverse.

## 15. Prompt Base Para Manter O Estilo

Use este direcionamento ao criar uma tela nova:

```text
Crie uma interface operacional premium para a Betinhos Executive Service, em pt-BR, com estética Fluent moderna e densa. Use o design system da Tela Formulário Geral: fundo azul gelo, superfícies brancas, bordas frias, raio entre 6px e 16px, Manrope, azul Betinhos apenas para ação/foco/seleção, estados verde/vermelho/amarelo, motion curta e foco visível. A tela deve parecer ferramenta interna de agendamento executivo, não landing page, não dashboard SaaS e não formulário legado. Preserve IDs, data attributes e contratos JS existentes.
```

## 16. Definição De Pronto Visual

Uma mudança visual só está pronta quando:

- Não quebrou contrato DOM/JS.
- Não criou scroll ou clipping indevido.
- Texto cabe em desktop e mobile.
- Dropdowns e popups aparecem acima de tudo.
- Passageiro continua selecionável, editável e copiável.
- Campos inválidos mostram motivo.
- Ação primária continua óbvia.
- `prefers-reduced-motion` funciona.
- `DESIGN.md` continua alinhado ao `styles.css`.
- `DESIGN_SYSTEM.html` renderiza como referência.
