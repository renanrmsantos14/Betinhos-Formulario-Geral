import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const push = await readFile(new URL("./push-dev.ps1", import.meta.url), "utf8");

assert.match(packageJson.scripts.push, /-ProvisionPlatform/);
assert.match(push, /Import-EnvFile "\.env\.local"/);
assert.match(push, /provisionamento idempotente do schema Dataverse/);
assert.match(push, /criação\/atualização do Custom Connector DeepSeek/);
assert.match(push, /provisionamento dos dois flows da agenda IA/);
assert.doesNotMatch(push, /não foram provisionados \(use -ProvisionFlows/);

console.log("push_dev_contract.test: ok");
