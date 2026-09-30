import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const push = await readFile(new URL("./push-dev.ps1", import.meta.url), "utf8");
const flows = await readFile(new URL("./provision-ai-schedule-flows.ps1", import.meta.url), "utf8");
const connector = await readFile(new URL("./provision-deepseek-connector.ps1", import.meta.url), "utf8");
const interpretFlow = await readFile(new URL("../power-platform/flows/ai_schedule_interpret.json", import.meta.url), "utf8");
const schema = await readFile(new URL("./provision-ai-schedule-schema.ps1", import.meta.url), "utf8");

assert.match(packageJson.scripts.push, /-ProvisionPlatform/);
assert.match(push, /Import-EnvFile "\.env\.local"/);
assert.doesNotMatch(push, /\$PSHOME -like "\*codex-runtimes\*"/);
assert.match(push, /provisionamento idempotente do schema Dataverse/);
assert.match(push, /criação\/atualização do Custom Connector DeepSeek/);
assert.match(push, /AI_SCHEDULE_DEEPSEEK_CONNECTOR_ID/);
assert.match(push, /-DeepSeekConnectorId/);
assert.match(push, /provisionamento dos dois flows da agenda IA/);
assert.doesNotMatch(push, /não foram provisionados \(use -ProvisionFlows/);
assert.match(flows, /Ensure-ConnectionReference/);
assert.match(flows, /connectionreferences\?/);
assert.match(connector, /pacOutput/);
assert.match(connector, /connector download/);
assert.match(connector, /connector Betinhos DeepSeek já está atualizado no DEV/);
assert.match(interpretFlow, /"connectionName": "__DEEPSEEK_API_NAME__"/);
assert.doesNotMatch(flows, /shared_betinhosdeepseek/);
assert.doesNotMatch(connector, /"--environment", \$EnvironmentUrl, "--settings-file"/);
assert.match(connector, /"--connector-id", \$ConnectorId, "--api-definition-file"/);
assert.doesNotMatch(connector, /"--connector-id", \$ConnectorId, "--settings-file"/);
assert.match(schema, /DateTimeBehavior = @\{ Value = "UserLocal" \}/);

console.log("push_dev_contract.test: ok");
