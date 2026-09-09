# Agendamento IA local — DEV

## Fluxo

O Codex Desktop executa a cada 15 minutos um prompt que chama `node scripts/ai_schedule_worker.mjs pull`. A pasta do Outlook deve ser preenchida manualmente. O resultado contém apenas assunto, remetente, recebimento, corpo normalizado e o sinalizador de anexos; anexos não são lidos.

O Codex interpreta cada corpo e grava um JSON de extração. Para persistir os trechos, execute `node scripts/ai_schedule_worker.mjs process <mensagem.json> <extracao.json>`. O upsert consulta primeiro a chave `(identificador estável da mensagem, ordinal)` e depois cria ou atualiza o rascunho, portanto repetir a execução é idempotente.

## Variáveis locais (nunca versionar valores)

```powershell
$env:OUTLOOK_TENANT_ID = "<tenant>"
$env:OUTLOOK_CLIENT_ID = "<app-registration-com-device-code>"
$env:OUTLOOK_FOLDER_ID = "<folder-id>"
$env:DATAVERSE_URL = "https://<org>.crm.dynamics.com"
$env:AI_DRAFT_TABLE = "<nome-logico-gerado-pelo-publisher>"
$env:AI_DRAFT_FIELDS_JSON = '{"id":"<pk>","stableMessageId":"<campo>","conversationId":"<campo>","subject":"<campo>","sender":"<campo>","receivedAt":"<campo>","body":"<campo>","extractionJson":"<campo>","ordinal":"<campo>","legType":"<campo>","legJson":"<campo>","status":"<campo>","warnings":"<campo>","confidence":"<campo>","extractorVersion":"<campo>","hasAttachments":"<campo>","processedAt":"<campo>"}'
```

O primeiro uso abre o device-code do Entra ID. O refresh token é salvo em `%LOCALAPPDATA%\Betinhos\formulario-geral\*-token.xml` com DPAPI do Windows. Escopo Outlook: `Mail.Read`; escopo Dataverse: `user_impersonation`. Nenhum token é escrito em Git, prompt, log ou URL.

## Contrato da extração

```json
{
  "isServiceRequest": true,
  "client": "nome exibido",
  "clientId": "guid confirmado no Dataverse",
  "requester": "nome exibido",
  "requesterId": "guid confirmado no Dataverse",
  "passengers": [{"id":"guid confirmado", "name":"Nome"}],
  "legs": [{"ordinal":1,"type":"ida","date":"2026-09-12","time":"10:00","origin":"...","destination":"...","notes":"..."}],
  "vehicleType": "Executivo",
  "observations": "...",
  "warnings": [],
  "confidence": 0.92,
  "extractorVersion": "1.0.0"
}
```

Datas relativas devem ser resolvidas pelo recebimento em `America/Sao_Paulo` somente quando exatas. Horário ou data vagos permanecem bloqueados. A IA não cria cliente, solicitante ou passageiro e não calcula preço.

## Configuração da aba

Antes de carregar o Web Resource, a solução deve fornecer a configuração abaixo (por exemplo, no wrapper que hospeda o recurso). Os nomes são os nomes lógicos reais da tabela criada na solução; não invente prefixo.

```html
<script>
window.__FORMULARIO_IA_DRAFT_CONFIG = {
  entity: "<nome-logico-da-tabela>",
  fields: { id: "<pk>", stableMessageId: "<campo>", conversationId: "<campo>", subject: "<campo>", sender: "<campo>", receivedAt: "<campo>", body: "<campo>", extractionJson: "<campo>", ordinal: "<campo>", legType: "<campo>", legJson: "<campo>", status: "<campo>", warnings: "<campo>", confidence: "<campo>", extractorVersion: "<campo>", hasAttachments: "<campo>", processedAt: "<campo>" },
  statusValues: { scheduled: "Agendado", discarded: "Descartado" }
};
</script>
```

A aba consulta somente rascunhos. `Aprovar e agendar` exige cliente, solicitante e todos os passageiros com GUID confirmado, preenche o formulário e chama o fluxo existente (`validateContext`, `buildReservaPayload`, `saveReserva` e relações `cr40f_servicosporpassageiro`). O registro oficial é criado com status `Solicitado` (`202410004`). Correções posteriores só atualizam rascunhos não agendados; rascunhos agendados ficam para correção manual.

## Retenção e implantação

Criar na mesma solução/publisher do Web Resource: chave alternativa composta por identificador estável + ordinal, campos de auditoria, lookups confirmados e vínculo com a reserva. Um job diário deve limpar somente o corpo original após 90 dias. Validar primeiro em DEV com e-mails controlados; PROD exige autorização separada e UAT autenticado.
