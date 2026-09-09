'use strict';

const assert = require('node:assert/strict');
const api = require('./house_governanca_restricoes_v1.js');

(async () => {
  assert.deepEqual(api.rpcAllowlist, ['tata_plus.restricoes_do_cardapio']);
  assert.equal(api.modo, 'read-only');

  const pedido = api.normalizarPedido({
    type: api.requestType,
    versao: 1,
    unidade: 'Itaim',
    semanaId: '2026-S37',
    itens: ['Frango com creme', 'Arroz e Feijão', 'frango com creme'],
  }, 'Itaim', '2026-S37');
  assert.ok(pedido);
  assert.deepEqual(pedido.itens, ['Frango com creme', 'Arroz e Feijão']);
  assert.equal(api.normalizarPedido({ ...pedido, type: 'outro' }, 'Itaim', '2026-S37'), null);

  const chamadas = [];
  const supa = {
    schema(nome) {
      assert.equal(nome, 'tata_plus');
      return new Proxy({
        async rpc(nomeRpc, args) {
          chamadas.push({ nomeRpc, args });
          return {
            data: [
              { nome: 'Pessoa A', unidade: 'Itaim', itens: ['Creme de leite'] },
              { nome: 'Pessoa B', unidade: 'Pinheiros', itens: ['Lombo'] },
            ],
            error: null,
          };
        },
      }, {
        get(target, prop) {
          if (['insert','update','delete','upsert','from'].includes(String(prop))) throw new Error('mutação proibida: ' + String(prop));
          return target[prop];
        },
      });
    },
  };

  const r = await api.carregar({ supa, unidade: 'Itaim', semanaId: '2026-S37', itens: pedido.itens });
  assert.equal(r.ok, true);
  assert.equal(chamadas.length, 1);
  assert.deepEqual(chamadas[0], {
    nomeRpc: 'restricoes_do_cardapio',
    args: { p_itens: ['Frango com creme', 'Arroz e Feijão'] },
  });
  assert.equal(r.snapshot.conflitos.length, 1, 'outra unidade não pode atravessar');
  assert.deepEqual(r.snapshot.conflitos[0], { nome: 'Pessoa A', unidade: 'Itaim', itens: ['Creme de leite'] });
  assert.equal(JSON.stringify(r.snapshot).includes('matricula'), false);
  assert.equal(JSON.stringify(r.snapshot).includes('token'), false);
  assert.equal(JSON.stringify(r.snapshot).includes('tipo'), false, 'não transportar perfil completo da restrição');

  const falha = await api.carregar({
    supa: { schema: () => ({ rpc: async () => ({ data: null, error: new Error('sem acesso') }) }) },
    unidade: 'Itaim', semanaId: '2026-S37', itens: ['Frango'],
  });
  assert.deepEqual(falha, { ok: false, codigo: 'LEITURA_FALHOU', snapshot: null });

  let post = null;
  const iframe = { contentWindow: { postMessage(msg, origin) { post = { msg, origin }; } } };
  assert.equal(api.enviarParaHouse(iframe, r.snapshot), true);
  assert.equal(post.origin, 'https://tata-house.github.io');
  assert.equal(post.msg.type, api.responseType);

  const eventoRuim = { origin: 'https://evil.example', source: iframe.contentWindow, data: { type: api.requestType } };
  const rr = await api.responderPedido(eventoRuim, { iframe, supa, unidade: 'Itaim', semanaId: '2026-S37' });
  assert.deepEqual(rr, { ok: false, codigo: 'ORIGEM_INVALIDA' });

  console.log('RESTRICOES_RPC_ALLOWLIST=PASS');
  console.log('RESTRICOES_NO_MUTATION_PATH=PASS');
  console.log('RESTRICOES_UNIT_ISOLATION=PASS');
  console.log('RESTRICOES_DATA_MINIMIZATION=PASS');
  console.log('RESTRICOES_EXACT_ORIGIN=PASS');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
