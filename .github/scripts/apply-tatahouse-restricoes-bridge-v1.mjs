import fs from 'node:fs';

const path = 'compliance/kpis/tatahouse/planejador-v2.html';
let s = fs.readFileSync(path, 'utf8');
const reps = [
  [
    '<script src="/compliance/kpis/tatahouse/house_governanca_readonly_v1.js"></script>\n  <script src="/compliance/kpis/tatahouse/house_governanca_planejador_v1.js"></script>',
    '<script src="/compliance/kpis/tatahouse/house_governanca_readonly_v1.js"></script>\n  <script src="/compliance/kpis/tatahouse/house_governanca_restricoes_v1.js"></script>\n  <script src="/compliance/kpis/tatahouse/house_governanca_planejador_v1.js"></script>',
    'script bridge',
  ],
  [
    '      var ro=window.TataHouseGovernancaReadonlyV1;\n      var evidenciaAtual=null;',
    '      var ro=window.TataHouseGovernancaReadonlyV1;\n      var restr=window.TataHouseGovernancaRestricoesV1;\n      var evidenciaAtual=null;\n      var contextoAberto=null;',
    'vars bridge',
  ],
  [
    "      window.addEventListener('message',function(event){\n        if(!ro||event.origin!==ro.houseOrigin||event.source!==iframe.contentWindow)return;\n        var msg=event.data;\n        if(!msg||msg.type!==ro.readyType||msg.versao!==1)return;\n        evidenciaPronta=true;\n        enviarEvidenciaSePronto();\n      });",
    "      window.addEventListener('message',function(event){\n        if(!ro||event.origin!==ro.houseOrigin||event.source!==iframe.contentWindow)return;\n        var msg=event.data;\n        if(!msg||typeof msg!=='object')return;\n        if(restr&&msg.type===restr.requestType){\n          if(contextoAberto&&window.__lideresSupa){\n            restr.responderPedido(event,{\n              iframe:iframe,\n              supa:window.__lideresSupa,\n              unidade:contextoAberto.unidadeFonte,\n              semanaId:contextoAberto.semanaId\n            }).catch(function(){});\n          }\n          return;\n        }\n        if(msg.type!==ro.readyType||msg.versao!==1)return;\n        evidenciaPronta=true;\n        enviarEvidenciaSePronto();\n      });",
    'listener bridge',
  ],
  [
    '          var ctx=contextoAtual();\n          evidenciaAtual=null;',
    '          var ctx=contextoAtual();\n          contextoAberto=ctx;\n          evidenciaAtual=null;',
    'contexto autorizado',
  ],
];
for (const [from, to, label] of reps) {
  if (s.includes(from)) s = s.replace(from, to);
  else if (!s.includes(to)) throw new Error('anchor ausente: ' + label);
}
fs.writeFileSync(path, s);
console.log('LIDERES_RESTRICOES_BRIDGE_PATCH=PASS');
