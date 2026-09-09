'use strict';

const fs = require('node:fs');
const path = require('node:path');

const manifestPath = path.join(process.cwd(), 'compliance/kpis/tatahouse/house_governanca_readiness_v1.json');
const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const HOUSE_CLEAN = '659b6b6ea66a5a531ea3460059c989109c69d002';
const HOUSE_PRICE_PRODUCT = 'e9dc5895a72389300c14a52a514118e3b14c4bd0';
const HOUSE_PRICE_TESTED = '68befe6969a20f39decbf338fa6c97f869bd23fc';
const LIDERES_SOURCE = 'f93cf3efdff0385bc99f0db2cb59c87e84f84388';

if (m.fontes?.houseFeature?.sha === HOUSE_CLEAN && m.evidenceRefresh?.id === '2026-09-09-house-final') {
  console.log('HOUSE_READINESS_REFRESH=IDEMPOTENT');
  process.exit(0);
}

m.evidenciaEm = new Date().toISOString();
m.evidenceHead = LIDERES_SOURCE;
m.evidenceHeadNota = 'Refresh de prontidão executado sobre o candidato Líderes f93cf3e… sem promover produção. O candidato House final limpo é 659b6b6e…; o refinamento impresso/QR foi revalidado no run 34335347051, eventos de demanda fail-closed no run 34336407542 e risco de preço sem dupla penalização no run 34337333229. O backend live do TATÁ Plus continua não carregado nesta sessão; detalhes live permanecem UNKNOWN. Nenhuma mutação Supabase foi executada nesta fase.';

m.fontes.houseFeature = {
  repo: 'cesarspichencoff-cmyk/tata-house.github.io',
  branch: 'feat/house-plus-intelligence-v2',
  sha: HOUSE_CLEAN,
  productCommit: HOUSE_PRICE_PRODUCT,
  testedSha: HOUSE_PRICE_TESTED,
  testRun: '34337333229',
  provas: {
    impressoQr: '34335347051',
    eventosDemanda: '34336407542',
    riscoPreco: '34337333229'
  }
};
m.fontes.lideresFeature.sha = LIDERES_SOURCE;
m.fontes.lideresFeature.refreshBaseSha = process.env.GITHUB_SHA || LIDERES_SOURCE;
m.fontes.lideresFeature.refreshRun = process.env.GITHUB_RUN_ID || 'LOCAL_UNKNOWN';

m.evidenceRefresh = {
  id: '2026-09-09-house-final',
  classificacao: 'PROVEN_CANDIDATE__PRODUCTION_UNCHANGED',
  houseCleanHead: HOUSE_CLEAN,
  housePriceProductCommit: HOUSE_PRICE_PRODUCT,
  houseMaterializedVerificationSha: HOUSE_PRICE_TESTED,
  runs: ['34335347051', '34336407542', '34337333229'],
  productionCrossed: false
};

function gate(id) {
  const g = m.gates.find((x) => x.id === id);
  if (!g) throw new Error(`gate ausente: ${id}`);
  return g;
}
function setGate(id, patch) { Object.assign(gate(id), patch); }
function upsertGate(value) {
  const i = m.gates.findIndex((g) => g.id === value.id);
  if (i >= 0) m.gates[i] = { ...m.gates[i], ...value };
  else m.gates.push(value);
}
function requireGate(target, id) {
  const arr = m.targets[target].requiredGates;
  if (!arr.includes(id)) arr.push(id);
}

setGate('house_production_preserved', {
  status: 'PASS',
  classificacao: 'PROVEN',
  resumo: 'O House em produção permanece no SHA 7f77fc88…; todas as novas melhorias permanecem isoladas no candidato limpo.',
  evidencia: `House produção 7f77fc88a12b11d40a185230f50d34172528082e · candidato final limpo ${HOUSE_CLEAN}`
});
for (const id of ['official_acceptance_priority', 'real_meal_count_calibration', 'manager_override_preserved', 'qr_single_voting_path']) {
  const g = gate(id);
  g.evidencia = `${g.evidencia.split('·')[0].trim()} · House full regression 34337333229`;
}
setGate('house_candidate_ci', {
  status: 'PASS',
  classificacao: 'PROVEN',
  resumo: 'Candidato House final passou revalidação materializada com Node 22.13.0: npm ci, typecheck, lint, testes, build e contrato de risco de preço; a árvore limpa posterior removeu somente artefatos temporários de CI.',
  evidencia: `GitHub Actions 34337333229 · materialized verification SHA ${HOUSE_PRICE_TESTED} · product commit ${HOUSE_PRICE_PRODUCT} · clean head ${HOUSE_CLEAN}`
});
setGate('house_production_review', {
  status: 'REVIEW_REQUIRED',
  classificacao: 'PROVEN_CANDIDATE__NOT_PROMOTED',
  resumo: 'O candidato House com inteligência, eventos, risco de preço e refinamento do impresso está comprovado, mas esta nova fase ainda não foi mergeada/deployada em produção.'
});

upsertGate({
  id: 'print_qr_regression',
  status: 'PASS',
  classificacao: 'PROVEN_CANDIDATE',
  resumo: 'PosterSemana/impresso House foi refinado sem alterar tipografia ou design system do Líderes; QR e impressão permaneceram funcionais.',
  evidencia: 'House run 34335347051 · prova materializada de impressão/QR e regressão completa'
});
upsertGate({
  id: 'demand_events_fail_closed',
  status: 'PASS',
  classificacao: 'PROVEN_CANDIDATE',
  resumo: 'Eventos positivos ajustam somente baseline automático; ajuste humano prevalece; fator 0/fechado e ambiguidade exigem decisão humana.',
  evidencia: 'House run 34336407542 · idempotência + typecheck + lint + testes + build + contrato de eventos'
});
upsertGate({
  id: 'price_risk_no_double_penalty',
  status: 'PASS',
  classificacao: 'PROVEN_CANDIDATE',
  resumo: 'Alta anormal de preço é exibida como risco informativo usando o radar existente e não altera o custo por uma segunda penalização.',
  evidencia: 'House run 34337333229 · materialized tree check + typecheck + lint + testes + build + price risk contract'
});
upsertGate({
  id: 'inventory_readonly_mapping',
  status: 'DEFERRED',
  classificacao: 'KNOWN_SOURCE__LIVE_MAPPING_NOT_PROVEN',
  resumo: 'A fonte oficial de estoque/reposição do Líderes foi identificada, mas o de-para live House → unidade/departamento ainda não está PROVEN; nenhuma leitura/escrita paralela foi ativada.',
  evidencia: 'inventario_contagem/abastecimento identificados no Líderes; ativação deliberadamente mantida fora deste candidato'
});

for (const target of ['pre_supabase_functional', 'production_promotion']) {
  requireGate(target, 'print_qr_regression');
  requireGate(target, 'demand_events_fail_closed');
  requireGate(target, 'price_risk_no_double_penalty');
}

fs.writeFileSync(manifestPath, JSON.stringify(m, null, 2) + '\n');
console.log('HOUSE_READINESS_REFRESH=APPLIED');
