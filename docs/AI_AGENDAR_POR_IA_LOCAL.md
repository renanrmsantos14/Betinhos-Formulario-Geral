# DeepSeek no localhost

O servidor local possui um proxy `POST /api/ai-schedule`. O navegador nunca recebe a chave: o proxy lê `DEEPSEEK_API_KEY` do processo Node ou de `.env.local`, chama a API compatível OpenAI do DeepSeek e devolve a proposta JSON para a validação da aba **Agendar por IA**.

## Configuração

1. Copie `.env.example` para `.env.local`.
2. Preencha `DEEPSEEK_API_KEY` com a chave da conta DeepSeek. Não commite esse arquivo.
3. Rode `npm start`.
4. Abra `http://127.0.0.1:4000/` sem `?mock=1` e use a aba **Agendar por IA**.

O modelo primário é `deepseek-v4-flash`; resposta vazia, JSON inválido, erro transitório ou baixa confiança em uma proposta aparentemente completa usam uma única tentativa com `deepseek-v4-pro`. O proxy envia JSON Mode, desativa thinking e limita a entrada a 12.000 caracteres.

Esta etapa liga a interpretação ao DeepSeek. A confirmação no localhost continua sem criar reserva: a gravação real depende da sessão Dataverse e dos fluxos Power Automate DEV descritos em `docs/power-platform/AI_AGENDAR_POR_IA_DEV_FLOW_CONTRACT.md`.
