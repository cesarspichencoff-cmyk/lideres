'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const api = require('./house_governanca_estoque_v1.js');

function pedido() {
  return { unidade: 'Itaim', semanaId: '2026-S37', itens: ['Arroz', 'Feijão', 'Óleo', 'Sal'] };
}

const minimos = [
  { id: 1, unidade: 'Itaim', departamento: 'Cozinha', produto_nome: 'Arroz', unidade_medida: 'kg' },
  { id: 2, unidade: 'Itaim', departamento: 'Cozinha', produto_nome: 'Feijão', unidade_medida: 'kg' },
  { id: 3, unidade: 'Itaim', departamento: 'Cozinha', produto_nome: 'Óleo', unidade_medida: 'lt' },
  { id: 4, unidade: 'Itaim', departamento: 'Bar', produto_nome: 'Oleo', unidade_medida: 'lt' },
  { id: 5, unidade: 'Pinheiros', departamento: 'Cozinha', produto_nome: 'Arroz', unidade_medida: 'kg' },
];

const contagens = [
  { id: 10, inventario_minimo_id: 1, estoque_atual: 10, data_contagem: '2026-09-01' },
  { id: 11, inventario_minimo_id: 1, estoque_atual: 18, data_contagem: '2026-09-08' },
  { id: 12, inventario_minimo_id: 2, estoque_atual: 9, data_contagem: '2026-09-08' },
  { id: 13, inventario_minimo_id: 3, estoque_atual: 4, data_contagem: '2026-09-08' },
];

(function testSnapshot() {
  const s = api.projetarSnapshot(minimos, contagens, pedido(), '2026-09-09T12:00:00Z');
  assert.ok(s);
  assert.equal(s.contrato, 'tata-house-governanca-estoque-readonly');
  assert.equal(s.modo, 'read-only');
  assert.equal(s.unidade, 'Itaim');
  assert.deepEqual(s.itens.map((x) => [x.item, x.estoqueAtual, x.departamento]), [
    ['Arroz', 18, 'Cozinha'],
    ['Feijão', 9, 'Cozinha'],
  ]);
  assert.deepEqual(s.ambiguos, ['Óleo']);
  assert.deepEqual(s.semContagem, ['Sal']);
})();

(function testLatestTieBreak() {
  const cs = contagens.concat([{ id: 14, inventario_minimo_id: 2, estoque_atual: 7, data_contagem: '2026-09-08' }]);
  const s = api.projetarSnapshot(minimos, cs, pedido(), '2026-09-09T12:00:00Z');
  assert.equal(s.itens.find((x) => x.item === 'Feijão').estoqueAtual, 7);
})();

(function testRequestValidation() {
  const ok = api.normalizarPedido({ type: api.requestType, versao: 1, unidade: 'Itaim', semanaId: '2026-S37', itens: ['Arroz', 'arroz'] }, 'Itaim', '2026-S37');
  assert.deepEqual(ok.itens, ['Arroz']);
  assert.equal(api.normalizarPedido({ type: api.requestType, versao: 1, unidade: 'Pinheiros', semanaId: '2026-S37', itens: ['Arroz'] }, 'Itaim', '2026-S37'), null);
})();

(function testReadOnlySource() {
  const fonte = fs.readFileSync(path.join(__dirname, 'house_governanca_estoque_v1.js'), 'utf8');
  for (const proibido of ['.insert(', '.update(', '.delete(', '.upsert(']) {
    assert.equal(fonte.includes(proibido), false, `mutação proibida encontrada: ${proibido}`);
  }
  assert.deepEqual(api.tableAllowlist, ['public.inventario_minimo', 'public.inventario_contagem']);
})();

console.log('house_governanca_estoque_v1.test=PASS');
