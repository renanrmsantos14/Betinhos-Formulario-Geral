# Agendar por IA

## Entrega local

A aba **Agendar por IA** é separada de **Solicitações IA**. Ela mantém uma conversa por sessão:

1. operador cola a mensagem do cliente;
2. a sessão recebe uma nova versão de entrada;
3. o worker interpreta com DeepSeek e grava proposta estruturada;
4. a tela exibe dados, pendências e alertas;
5. somente `Confirmar e agendar` (ou uma confirmação textual explícita no contexto certo) libera a mutação;
6. o worker grava os IDs criados, parcialidade ou erro idempotente.

O bundle nunca recebe chave DeepSeek. No modo local (`?mock=1`), a interpretação aceita JSON ou linhas estruturadas somente para teste visual e informa que nenhum registro Dataverse é criado.

## Tabela de sessão DEV

Criar uma tabela Dataverse, por exemplo `cr40f_conversaiaagendamento`, com os campos lógicos definidos em `window.__FORMULARIO_IA_CONVERSATION_CONFIG` no `index.html`:

- texto original, mensagens JSON e proposta JSON;
- status, versão de entrada, versão processada e tentativas;
- campos faltantes, alertas, modelo, erro e IDs das reservas criadas;
- expiração para retenção de 90 dias.

Os valores de Choice e o campo primário `cr40f_name` no `index.html` são placeholders de DEV até a solução publicar os valores reais. Ajustar antes do primeiro teste Dataverse.

## Power Automate assíncrono

Criar dois fluxos na solução DEV:

### Interpretar sessão

- gatilho: quando a sessão for criada ou atualizada;
- condição: `inputVersion > processedVersion` e status `WAITING_AI`;
- adquirir lock lógico por `sessionId + inputVersion`;
- chamar Custom Connector DeepSeek, com a conexão guardada na Connection Reference;
- modelo primário: `deepseek-v4-flash`; fallback controlado: `deepseek-v4-pro`;
- exigir saída JSON conforme o contrato da função `validateProposal`;
- validar datas, horários, identidade, serviço e veículo sem inferência silenciosa;
- gravar proposta, `missingFields`, alertas, tokens, modelo e `processedVersion`;
- status final: `WAITING_USER`, `READY` ou `ERROR`.

### Agendar confirmação

- condição: status `SCHEDULING` e `confirmationVersion = inputVersion`;
- validar novamente a proposta e a confirmação;
- para cada serviço, resolver ou propor cadastro de identidades; criação de pessoa exige confirmação humana separada;
- criar reservas e relações em sequência, guardando cada ID imediatamente;
- em falha, manter itens criados, gravar `PARTIAL` e permitir retomada idempotente;
- em sucesso, gravar `SCHEDULED` e IDs das reservas para a tela abrir o voucher existente.

## Segurança e operação

- não colocar segredo em HTML, JavaScript, Dataverse, logs do navegador ou Git;
- limitar texto e tamanho do payload, registrar apenas o necessário e aplicar retenção de 90 dias;
- não chamar DeepSeek diretamente do browser;
- DEV primeiro. Nenhum deploy em PROD ou UAT autenticado foi declarado nesta entrega.

## Pendências externas

Esta entrega não publica tabela, Choice, Custom Connector nem os fluxos no ambiente Power Platform. Após a publicação, atualizar os nomes/valores reais da configuração, testar com mensagens anonimizadas e validar o voucher em DEV antes de autorizar produção.
