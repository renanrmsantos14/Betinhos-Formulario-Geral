# Contexto do Projeto - Tela Formulario Geral

## Objetivo

Recriar em HTML, CSS e JavaScript o formulario de agendamento de servicos que hoje existe em um Power Apps Canvas App.

O novo formulario sera publicado como web resource e usado dentro de um Model-driven App, substituindo a Custom Page atual.

## Contexto atual

- Usuario principal: equipe interna Betinhos Executive Service.
- Aplicacao host: Model-driven App.
- Tela atual: Canvas App usado como Custom Page.
- Finalidade: agendamento de servicos.
- Plataforma de dados esperada: Dataverse.
- Idioma: pt-BR.
- Moeda: BRL.
- Fuso horario: America/Sao_Paulo.

## Direcao tecnica

- Entregar uma tela standalone em HTML/CSS/JS.
- Usar `Xrm.WebApi` quando estiver dentro do Model-driven App.
- Preservar o funcionamento real do Canvas App antes de redesenhar.
- Mapear regras, campos, validacoes, automacoes e estados antes de implementar.
- Evitar dependencia de framework se o formulario puder ser mantido com vanilla JS.
- Tratar o web resource como produto operacional, nao como landing page.

## Contratos que precisam ser levantados

### Dados

- Tabelas Dataverse usadas pelo formulario.
- Campos obrigatorios.
- Campos calculados ou preenchidos automaticamente.
- Lookups.
- Choices/optionsets.
- Relacionamentos.
- Regras de duplicidade.
- Status do agendamento.

### Fluxo do formulario

- Sequencia de preenchimento.
- Campos condicionais.
- Validacoes por etapa.
- Regras para salvar rascunho.
- Regras para finalizar/enviar.
- Mensagens de erro.
- Permissoes por perfil.

### Integracoes

- Power Automate acionado pelo formulario.
- Parametros enviados para fluxos.
- Retorno esperado dos fluxos.
- Emails, notificacoes ou atualizacoes em outras tabelas.
- Dependencias com SharePoint, Outlook, Teams, RD Station ou outros servicos.

### UI e UX

- Layout atual do Canvas App.
- Campos visiveis por perfil.
- Comportamento desktop.
- Comportamento mobile/tablet, se existir.
- Popups, paineis laterais, etapas, abas ou componentes reutilizados.
- Identidade visual desejada para a nova tela.

## Regras de implementacao

- Nao inventar schema.
- Nao inferir regra de negocio sem confirmar no Canvas App, Dataverse ou fluxo.
- Se faltar dado, registrar como pendencia.
- Se houver divergencia entre Canvas App e Dataverse, Dataverse vence para schema.
- Se houver divergencia entre comportamento esperado e codigo atual, registrar antes de alterar.

## Entregaveis previstos

1. Auditoria do formulario atual.
2. Mapa de dados e regras.
3. Especificacao funcional do novo web resource.
4. Implementacao HTML/CSS/JS.
5. Checklist de publicacao no Dataverse.
6. Teste dentro do Model-driven App.

## Pendencias imediatas

- Exportar ou copiar as formulas principais do Canvas App.
- Listar as telas e componentes usados no formulario.
- Identificar as tabelas Dataverse envolvidas.
- Identificar os fluxos Power Automate chamados.
- Definir se o novo web resource precisa editar registro existente, criar novo registro, ou ambos.

