'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const doc = JSON.parse(fs.readFileSync(path.join(__dirname, 'house_governanca_house_cloud_live_evidence_v1.json'), 'utf8'));

assert.equal(doc.contrato, 'tata-house-governanca-house-cloud-live-evidence');
assert.equal(doc.versao, 1);
assert.match(doc.classificacaoGlobal, /^HOUSE_CLOUD_BACKEND_LIVE_PROVEN/);
assert.equal(doc.fontesCanonicas.vertice.sha, 'efc574cb4f90ab513e210dc524517af10ac162bd');
assert.equal(doc.fontesCanonicas.houseProducao.sha, '6dc04827b195aaca9d4653618e5a40ca64a1a6f4');
assert.equal(doc.fontesCanonicas.lideresMainObservado.sha, '299bf72f9fbe01cebe49edc2a1e63e279fb34e26');

assert.equal(doc.supabaseHouse.projectRef, 'ijnjhxwzazqebogzsxjb');
assert.equal(doc.supabaseHouse.projectName, 'tata-house');
assert.equal(doc.supabaseHouse.region, 'sa-east-1');
assert.equal(doc.supabaseHouse.status, 'ACTIVE_HEALTHY');
assert.equal(doc.supabaseHouse.mutationPerformed, false);
assert.equal(doc.supabaseHouse.ddlPerformed, false);

assert.equal(doc.tataEstado.table, 'public.tata_estado');
assert.equal(doc.tataEstado.rlsEnabled, true);
assert.equal(doc.tataEstado.rowsObserved, 51);
assert.equal(doc.tataEstado.spaceObserved, 'tata-house');
assert.deepEqual(doc.tataEstado.primaryKey, ['espaco', 'chave']);
assert.equal(doc.tataEstado.columns.valor, 'jsonb');

assert.equal(doc.realtime.publication, 'supabase_realtime');
assert.equal(doc.realtime.table, 'tata_estado');
assert.equal(doc.realtime.published, true);
assert.equal(doc.realtime.frontendExpectedFilter, 'espaco=eq.tata-house');

assert.equal(doc.rls.policy, 'tata_estado_rw');
assert.deepEqual(doc.rls.roles, ['anon', 'authenticated']);
assert.equal(doc.rls.command, 'ALL');
assert.equal(doc.rls.anonymousReadWritePresent, true);
assert.equal(doc.rls.strongTeamBackendAuthPresent, false);

for (const privilege of ['SELECT', 'INSERT', 'UPDATE', 'DELETE']) {
  assert.ok(doc.tableGrantsObserved.anon.includes(privilege), `anon grant ausente: ${privilege}`);
}
assert.equal(doc.advisors.securityLintsObserved, 0);

for (const key of [
  'localFallbackPreserved',
  'bootCloudReconciliationPreserved',
  'offlineOutboxPreserved',
  'threeWayWeekMergePreserved',
  'largeStateCasPreserved',
  'realtimeFilterMatchesLivePublication'
]) {
  assert.equal(doc.compatibilidadeCodigo[key], true, `${key} deve permanecer true`);
}
assert.equal(doc.compatibilidadeCodigo.classification, 'PROVEN');

assert.equal(doc.limitesDaProva.exactSupabaseProjectRefEmbeddedInCurrentlyServedHouseBuild, 'UNKNOWN_SECRET_NOT_READABLE');
assert.equal(doc.limitesDaProva.lideresAuthenticatedTataPlusLiveRpc, 'UNKNOWN_NOT_PROVEN_LIVE');
assert.equal(doc.limitesDaProva.houseCloudBackend, 'PROVEN_LIVE');
assert.equal(doc.limitesDaProva.houseCodeToLiveDatabaseContract, 'PROVEN');
assert.equal(doc.limitesDaProva.productionPromotionAuthorized, false);
assert.equal(doc.limitesDaProva.supabaseGovernancePersistenceAuthorized, false);

assert.equal(doc.conclusao.newHouseBackendRequired, false);
assert.equal(doc.conclusao.parallelProviderRequired, false);
assert.equal(doc.conclusao.newDdlRequiredForCurrentGate, false);
assert.equal(doc.conclusao.houseCloudIsOperationalBase, true);
assert.equal(doc.conclusao.lideresRemainsComplementaryOfficialEvidence, true);
assert.equal(doc.conclusao.sensitiveGovernanceWritesToHouseCloud, 'BLOCKED');

console.log('HOUSE_CLOUD_LIVE_EVIDENCE=PASS');
console.log('HOUSE_CLOUD_SCHEMA_DATA_RLS_REALTIME=PASS');
console.log('HOUSE_CLOUD_CODE_DB_COMPATIBILITY=PASS');
console.log('HOUSE_CLOUD_NO_MUTATION=PASS');
console.log('HOUSE_CLOUD_STRONG_AUTH_LIMIT_EXPLICIT=PASS');
console.log('HOUSE_CLOUD_PRODUCTION_EFFECT_BOUNDARY_LOCKED=PASS');
