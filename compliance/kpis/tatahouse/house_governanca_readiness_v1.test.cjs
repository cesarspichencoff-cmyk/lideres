'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = __dirname;
const evaluator = require(path.join(base, 'house_governanca_readiness_v1.js'));
const manifesto = JSON.parse(fs.readFileSync(path.join(base, 'house_governanca_readiness_v1.json'), 'utf8'));
const central = fs.readFileSync(path.join(base, 'central.html'), 'utf8');
const painel = fs.readFileSync(path.join(base, 'prontidao.html'), 'utf8');

function clone(v) { return JSON.parse(JSON.stringify(v)); }
function gate(id) {
  const g = manifesto.gates.find((x) => x.id === id);
  assert.ok(g, `gate ausente: ${id}`);
  return g;
}

const validacao = evaluator.validarManifesto(manifesto);
assert.equal(validacao.valido, true, `manifesto inválido: ${validacao.erros.join(' | ')}`);
const todos = evaluator.avaliarTodos(manifesto);
assert.equal(todos.valido, true);

assert.equal(todos.resultados.pre_supabase_functional.ready, true, 'integração funcional atual deve estar pronta para revisão');
assert.equal(todos.resultados.backend_activation.ready, true, 'QR deve reutilizar backend existente, sem ativação backend nova');
assert.equal(todos.resultados.production_promotion.ready, false, 'produção continua dependente de revisão dos candidatos');
assert.equal(todos.resultados.planner_write_activation.ready, false, 'escrita automática do Planejador continua fora do escopo');

for (const id of [
  'house_production_preserved',
  'lideres_base_fresh',
  'plus_employee_module_reused',
  'employee_governance_separation',
  'read_only_operational_metrics',
  'official_acceptance_priority',
  'real_meal_count_calibration',
  'manager_override_preserved',
  'qr_single_voting_path',
  'no_new_qr_backend',
  'no_plus_code_change',
  'lideres_scope_only_tatahouse',
  'house_candidate_ci',
  'lideres_candidate_ci',
  'no_supabase_mutation',
  'planner_manual_handoff_preserved',
]) {
  assert.equal(gate(id).status, 'PASS', `${id} precisa permanecer PASS`);
}

assert.equal(gate('plus_live_backend_fresh_inspection').status, 'UNKNOWN', 'detalhe live não carregado não pode virar PROVEN');
assert.match(gate('plus_live_backend_fresh_inspection').classificacao || '', /CURRENT_LIVE_NOT_LOADED/);
assert.equal(gate('planner_auto_write_authorization').status, 'REVIEW_REQUIRED');
assert.equal(gate('house_production_review').status, 'REVIEW_REQUIRED');
assert.equal(gate('lideres_production_review').status, 'REVIEW_REQUIRED');

const prodBlockers = new Set(todos.resultados.production_promotion.blockers.map((g) => g.id));
assert.deepEqual(prodBlockers, new Set(['house_production_review', 'lideres_production_review']));
const plannerBlockers = new Set(todos.resultados.planner_write_activation.blockers.map((g) => g.id));
assert.deepEqual(plannerBlockers, new Set(['planner_auto_write_authorization']));

// UNKNOWN nunca satisfaz um requisito, mesmo quando a classificação textual parece forte.
const unknownInjected = clone(manifesto);
unknownInjected.gates.find((g) => g.id === 'qr_single_voting_path').status = 'UNKNOWN';
assert.equal(evaluator.avaliarTarget(unknownInjected, 'pre_supabase_functional').ready, false);

// Gate ausente e status inventado falham fechado.
const missing = clone(manifesto);
missing.gates = missing.gates.filter((g) => g.id !== 'qr_single_voting_path');
assert.equal(evaluator.validarManifesto(missing).valido, false);
assert.equal(evaluator.avaliarTarget(missing, 'pre_supabase_functional').failClosed, true);
const invalid = clone(manifesto);
invalid.gates.find((g) => g.id === 'qr_single_voting_path').status = 'PROBABLY';
assert.equal(evaluator.validarManifesto(invalid).valido, false);

assert.equal(manifesto.fontes.vertice.repo, 'cesarspichencoff-cmyk/vertice-runtime.');
assert.equal(manifesto.fontes.vertice.branch, 'vertice-active');
assert.equal(manifesto.fontes.houseProducao.sha, '7f77fc88a12b11d40a185230f50d34172528082e');
assert.equal(manifesto.fontes.lideresProducao.sha, '42b795f879f11dd2cd290eec8b26993f7da5e9c9');
assert.equal(manifesto.fontes.plusProducao.sha, '3ffb714adccfc81531b5f94af08dc1b3d4653788');
assert.match(manifesto.evidenceHeadNota || '', /mutação Supabase desta fase em zero/i);

assert.match(central, /href="prontidao\.html"[^>]*data-readiness-entry="v1"/i, 'Central deve continuar expondo a prontidão');
assert.match(central, /src="https:\/\/tata-house\.github\.io\/"/i, 'Central deve continuar carregando o House oficial, não uma cópia');
assert.match(painel, /house_governanca_readiness_v1\.js/, 'painel deve usar o avaliador versionado');
assert.match(painel, /house_governanca_readiness_v1\.json/, 'painel deve usar o manifesto versionado');
assert.match(painel, /Somente <strong>PASS<\/strong> satisfaz um requisito\./, 'semântica fail-closed deve continuar visível');

console.log('READINESS_MANIFEST_CURRENT=PASS');
console.log('READINESS_FUNCTIONAL=PASS');
console.log('READINESS_EXISTING_PLUS_BACKEND_REUSED=PASS');
console.log('READINESS_LIVE_UNKNOWN_PRESERVED=PASS');
console.log('READINESS_PRODUCTION_REVIEW_REQUIRED=PASS');
console.log('READINESS_PLANNER_AUTO_WRITE_BLOCKED=PASS');
console.log('READINESS_FAIL_CLOSED=PASS');
console.log('READINESS_CANONICAL_SOURCES=PASS');
