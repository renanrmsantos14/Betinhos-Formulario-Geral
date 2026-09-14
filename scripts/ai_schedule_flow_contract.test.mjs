import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async (file) => JSON.parse(await readFile(new URL(`../power-platform/flows/${file}`, import.meta.url), "utf8"));
const interpret = await read("ai_schedule_interpret.json");
const schedule = await read("ai_schedule_schedule.json");

const interpretTrigger = interpret.triggers.When_a_session_is_waiting_ai;
assert.match(interpretTrigger.inputs.parameters["subscriptionRequest/filterexpression"], /versaoentrada gt cr40f_versaoprocessada/);
assert.equal(interpretTrigger.runtimeConfiguration?.concurrency?.runs, 1);
assert.match(interpret.actions.Compose_Input.inputs, /cr40f_mensagensjson/);
assert.deepEqual(interpret.actions.Call_DeepSeek.runtimeConfiguration.secureData.properties.sort(), ["inputs", "outputs"]);
assert.ok(interpret.actions.Call_DeepSeek_Fallback, "fallback DeepSeek deve existir");
assert.ok(interpret.actions.Parse_Primary, "resposta primaria deve ser validada antes do fallback");
assert.ok(interpret.actions.Use_Fallback_On_Low_Confidence?.actions?.Call_DeepSeek_Fallback_Low_Confidence, "baixa confianca com campos completos deve usar fallback");
assert.ok(interpret.actions.Filter_Missing_Passengers, "IDs de passageiros devem ser validados deterministicamente");
assert.ok(interpret.actions.Filter_Missing_Services, "campos obrigatorios dos servicos devem ser validados deterministicamente");
assert.ok(interpret.actions.Update_Session_Error, "falha de parsing deve atualizar a sessao");

const scheduleTrigger = schedule.triggers.When_a_session_is_scheduling;
assert.match(scheduleTrigger.inputs.parameters["subscriptionRequest/filterexpression"], /versaoconfirmada eq cr40f_versaoentrada/);
assert.equal(scheduleTrigger.runtimeConfiguration?.concurrency?.runs, 1);
assert.ok(schedule.actions.Validate_Confirmed_Proposal, "confirmacao deve ser revalidada no backend");
assert.match(schedule.actions.For_each_service.foreach, /Validate_Confirmed_Proposal/);
assert.ok(schedule.actions.For_each_service.actions.Find_existing_reservation, "reserva deve ser idempotente");
assert.ok(schedule.actions.For_each_service.actions.Create_or_reuse_reservation.actions.For_each_passenger_relation, "relacoes de passageiros devem ser gravadas");
assert.ok(schedule.actions.Update_Session_PartialOrError, "falha parcial deve preservar IDs");

console.log("ai_schedule_flow_contract.test: ok");
