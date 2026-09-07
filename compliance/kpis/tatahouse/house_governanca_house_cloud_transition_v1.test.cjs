'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const doc = JSON.parse(fs.readFileSync(path.join(__dirname, 'house_governanca_house_cloud_transition_v1.json'), 'utf8'));

assert.equal(doc.contrato, 'tata-house-governanca-house-cloud-transition');
assert.equal(doc.versao, 1);
assert.equal(doc.status, 'CANDIDATE_IMPLEMENTATION_AUTHORIZED__PRODUCTION_NOT_AUTHORIZED');

assert.equal(doc.fontesVersionadas.vertice.sha, 'efc574cb4f90ab513e210dc524517af10ac162bd');
assert.equal(doc.fontesVersionadas.houseProducao.sha, '6dc04827b195aaca9d4653618e5a40ca64a1a6f4');
assert.equal(doc.fontesVersionadas.lideresProducao.sha, '299bf72f9fbe01cebe49edc2a1e63e279fb34e26');
assert.equal(doc.facts.houseCloudKvTable, 'public.tata_estado');
assert.equal(doc.facts.houseCloudSpace, 'tata-house');
assert.equal(doc.facts.houseCloudMirrorsLocalPrefix, 'cardapio.v1.*');
assert.equal(doc.facts.cloudDownloadMaterializesGenericStateIntoLocalStorage, true);
assert.equal(doc.facts.plannerRecentFrequencyReadsReconciledLocalWeeks, true);
assert.equal(doc.facts.lideresOfficialEvidenceIsAnOverlay, true);
assert.equal(doc.facts.officialFrequencyMergeRule, 'max(local, official)');
assert.equal(doc.facts.newProviderImplementationRequiredNow, false);
assert.equal(doc.facts.houseCloudLiveProjectRef, 'ijnjhxwzazqebogzsxjb');
assert.equal(doc.facts.houseCloudLiveRowsObserved, 51);
assert.equal(doc.facts.houseCloudRealtimePublished, true);

assert.equal(doc.transitionStrategy.agora.providerOperacional, 'HOUSE_CLOUD_RECONCILED_STATE');
assert.equal(doc.transitionStrategy.agora.persistenciaNovaDeGovernanca, 'DISABLED');
assert.equal(doc.transitionStrategy.agora.ddlNovo, 'NOT_REQUIRED');
assert.equal(doc.transitionStrategy.agora.providerParalelo, 'FORBIDDEN');
assert.equal(doc.transitionStrategy.depois.providerOficialCompartilhado, 'LIDERES_TATA_REFEICOES');

assert.equal(doc.classificacao.arquiteturaHouseCloud, 'PROVEN_VERSIONED');
assert.equal(doc.classificacao.houseCloudLiveProjectIdentity, 'PROVEN_LIVE');
assert.equal(doc.classificacao.houseCloudLiveTablesPoliciesData, 'PROVEN_LIVE');
assert.equal(doc.classificacao.houseCloudLiveRealtime, 'PROVEN_LIVE');
assert.equal(doc.classificacao.houseCodeLiveDbContract, 'PROVEN');
assert.equal(doc.classificacao.houseExactDeployedBuildProjectRef, 'UNKNOWN_SECRET_NOT_READABLE');
assert.match(doc.classificacao.lideresLiveAuthenticatedRpc, /^UNKNOWN_/);
assert.equal(doc.classificacao.controlledLideresOverlay, 'PROVEN_CONTROLLED_BROWSER');

assert.equal(doc.securityBoundary.versionedSchemaShowsAnonymousTataEstadoAccess, true);
assert.equal(doc.securityBoundary.livePolicyShowsAnonymousTataEstadoAccess, true);
assert.equal(doc.securityBoundary.strongLiveBackendAuth, 'NOT_PRESENT_FOR_TATA_ESTADO_LIVE');
assert.equal(doc.securityBoundary.sensitiveGovernanceEventsToTataEstado, 'BLOCKED_BY_ARCHITECTURE');
assert.equal(doc.securityBoundary.securityAdvisorNoLintsObserved, true);
assert.equal(doc.securityBoundary.doNotCopySupabaseCredentialsIntoHouseGovernanca, true);

for (const key of ['supabaseMutation', 'ddl', 'merge', 'deploy', 'production']) {
  assert.equal(doc.invariantes[key], false, `${key} deve permanecer false`);
}
for (const key of ['oneHouseProduct', 'preserveLocalFirst', 'preserveReconciliation', 'noSecondIndependentHouseState', 'candidateBranchCreated']) {
  assert.equal(doc.invariantes[key], true, `${key} deve permanecer true`);
}
assert.equal(doc.invariantes.humanAuthorizationRequiredNearEffectBoundary, true);

console.log('HOUSE_CLOUD_TRANSITION=PASS');
console.log('HOUSE_CLOUD_ALREADY_FEEDS_RECONCILED_STATE=PASS');
console.log('HOUSE_CLOUD_LIVE_BACKEND=PASS');
console.log('HOUSE_CLOUD_CODE_DB_CONTRACT=PASS');
console.log('LIDERES_STAYS_OFFICIAL_OVERLAY=PASS');
console.log('HOUSE_CLOUD_STRONG_AUTH_NOT_PRESENT=PASS');
console.log('HOUSE_CLOUD_EFFECT_BOUNDARY_LOCKED=PASS');
