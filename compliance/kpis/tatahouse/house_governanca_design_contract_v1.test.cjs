'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'house_governanca_design_contract_v1.json'), 'utf8'));

assert.equal(d.contrato, 'tata-house-governanca-design');
assert.equal(d.versao, 1);
assert.equal(d.principio, 'UMA_MARCA_DUAS_VOZES_COMPLEMENTARES');
assert.equal(d.tipografia.produtoHouse.sans, 'Manrope');
assert.equal(d.tipografia.produtoHouse.display, 'Fraunces');
assert.equal(d.tipografia.operacionalGovernanca.sans, 'DM Sans');
assert.equal(d.tipografia.operacionalGovernanca.mono, 'DM Mono');
assert.equal(d.cores.operacional.carbon, '#35383F');
assert.equal(d.cores.operacional.citric, '#CFFF00');
assert.equal(d.impresso.owner, 'TATÁ House');
assert.ok(d.impresso.preservar.some((x) => /PlaquinhaQR/.test(x)));
assert.ok(d.impresso.preservar.some((x) => /PosterSemana A4/.test(x)));
assert.ok(d.impresso.preservar.some((x) => /TATÁ Plus/.test(x)));
assert.ok(d.impresso.proibido.some((x) => /votação paralelo/i.test(x)));
assert.equal(d.classificacao.fontes, 'PROVEN_VERSIONED');
assert.equal(d.classificacao.direcaoDeDesign, 'INFERENCE_AUTHORED_FROM_PROVEN_SOURCES');
assert.equal(d.classificacao.mudancaGlobalDeFonte, 'NOT_PROPOSED');

console.log('DESIGN_FAMILY_TWO_VOICES=PASS');
console.log('DESIGN_HOUSE_PREMIUM_PRESERVED=PASS');
console.log('DESIGN_LIDERES_OPERATIONAL_PRESERVED=PASS');
console.log('DESIGN_PRINT_QR_PRESERVED=PASS');
