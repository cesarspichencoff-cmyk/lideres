'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'house_governanca_design_contract_v1.json'), 'utf8'));

assert.equal(d.contrato, 'tata-house-governanca-design');
assert.equal(d.versao, 2);
assert.equal(d.escopoVisual, 'SOMENTE_IMPRESSO_HOUSE');
assert.equal(d.fontesDeVerdade.lideres.politicaTipografia, 'PRESERVE_AS_IS__NO_CHANGES');
assert.equal(d.fontesDeVerdade.lideres.politicaInterface, 'PRESERVE_AS_IS__NO_VISUAL_RESTYLE');
assert.equal(d.restricoesDeEscopo.alterarFonteLideres, false);
assert.equal(d.restricoesDeEscopo.alterarTipografiaLideres, false);
assert.equal(d.restricoesDeEscopo.alterarDesignSystemLideres, false);
assert.equal(d.restricoesDeEscopo.aplicarPadronizacaoVisualNaTelaDoLideres, false);
assert.equal(d.impressoHouse.owner, 'TATÁ House');
assert.ok(d.impressoHouse.alvos.includes('PosterSemana'));
assert.ok(d.impressoHouse.alvos.includes('PlaquinhaQR'));
assert.ok(d.impressoHouse.preservar.some((x) => /QR gerado localmente/i.test(x)));
assert.ok(d.impressoHouse.preservar.some((x) => /PosterSemana A4/i.test(x)));
assert.ok(d.impressoHouse.preservar.some((x) => /TATÁ Plus/i.test(x)));
assert.ok(d.impressoHouse.proibido.some((x) => /fontes do Líderes/i.test(x)));
assert.ok(d.impressoHouse.proibido.some((x) => /votação paralelo/i.test(x)));
assert.equal(d.classificacao.correcaoEscopoHumana, 'AUTHORIZED_AND_EXPLICIT');
assert.equal(d.classificacao.mudancaFonteLideres, 'PROIBIDA_NESTE_ESCOPO');
assert.equal(d.classificacao.mudancaVisualLideres, 'OUT_OF_SCOPE');
assert.equal(d.classificacao.preservacaoQR, 'REQUIRED');

console.log('DESIGN_SCOPE_PRINT_ONLY=PASS');
console.log('DESIGN_LIDERES_FONTS_FROZEN=PASS');
console.log('DESIGN_LIDERES_UI_PRESERVED=PASS');
console.log('DESIGN_HOUSE_PRINT_QR_PRESERVED=PASS');
