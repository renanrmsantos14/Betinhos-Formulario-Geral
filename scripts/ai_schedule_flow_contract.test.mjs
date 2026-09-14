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
assert.match(interpret.actions.Filter_Missing_Passengers.inputs.where, /proposedRegistration/);
assert.ok(interpret.actions.Filter_Missing_Services, "campos obrigatorios dos servicos devem ser validados deterministicamente");
assert.ok(interpret.actions.Update_Session_Error, "falha de parsing deve atualizar a sessao");
for (const actionName of ["Compose_Selected_Response", "Compose_Proposal", "Filter_Missing_Passengers", "Filter_Missing_Services", "Compose_Deterministic_Missing", "Update_Session", "Update_Session_Error"]) {
  assert.deepEqual(interpret.actions[actionName].runtimeConfiguration?.secureData?.properties?.sort(), ["inputs", "outputs"], `${actionName} deve ocultar dados sensiveis`);
}

const scheduleTrigger = schedule.triggers.When_a_session_is_scheduling;
assert.match(scheduleTrigger.inputs.parameters["subscriptionRequest/filterexpression"], /versaoconfirmada eq cr40f_versaoentrada/);
assert.equal(scheduleTrigger.runtimeConfiguration?.concurrency?.runs, 1);
assert.ok(schedule.actions.Validate_Confirmed_Proposal, "confirmacao deve ser revalidada no backend");
assert.match(schedule.actions.Validate_Confirmed_Proposal.inputs, /proposedRegistration/);
assert.match(schedule.actions.For_each_service.foreach, /Validate_Confirmed_Proposal/);
assert.equal(schedule.actions.For_each_service.runtimeConfiguration?.concurrency?.repetitions, 1);
assert.ok(schedule.actions.For_each_service.actions.Find_existing_reservation, "reserva deve ser idempotente");
assert.equal(schedule.actions.For_each_service.actions.Create_or_reuse_reservation.actions.Create_reservation.inputs.parameters["item/cr40f_status"], 202410004);
assert.ok(schedule.actions.For_each_service.actions.Compose_Current_Reservation_Id, "o retry deve recuperar o id da reserva criada ou existente");
assert.ok(schedule.actions.For_each_service.actions.For_each_passenger_relation, "relacoes de passageiros devem ser gravadas");
assert.ok(schedule.actions.For_each_service.actions.For_each_passenger_relation.actions.Find_existing_passenger_relation, "relacoes devem ser consultadas antes da criacao");
assert.ok(schedule.actions.For_each_service.actions.For_each_passenger_relation.actions.Create_passenger_relation_if_missing, "relacoes devem ser idempotentes no retomar");
assert.ok(schedule.actions.Update_Session_PartialOrError, "falha parcial deve preservar IDs");
for (const actionName of ["Compose_Proposal", "Filter_Invalid_Passengers", "Filter_Invalid_Services", "Update_Session_Scheduled", "Update_Session_PartialOrError"]) {
  assert.deepEqual(schedule.actions[actionName].runtimeConfiguration?.secureData?.properties?.sort(), ["inputs", "outputs"], `${actionName} deve ocultar dados sensiveis`);
}

console.log("ai_schedule_flow_contract.test: ok");
