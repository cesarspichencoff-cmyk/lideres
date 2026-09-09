from pathlib import Path

p = Path('compliance/kpis/tatahouse/planejador-v2.html')
s = p.read_text()

def once(old: str, new: str) -> None:
    global s
    n = s.count(old)
    assert n == 1, f'esperado 1 match, veio {n}: {old[:80]}'
    s = s.replace(old, new, 1)

once(
    '  <script src="/compliance/kpis/tatahouse/house_governanca_restricoes_v1.js"></script>\n  <script src="/compliance/kpis/tatahouse/house_governanca_planejador_v1.js"></script>',
    '  <script src="/compliance/kpis/tatahouse/house_governanca_restricoes_v1.js"></script>\n  <script src="/compliance/kpis/tatahouse/house_governanca_estoque_v1.js"></script>\n  <script src="/compliance/kpis/tatahouse/house_governanca_planejador_v1.js"></script>',
)
once(
    '      var restr=window.TataHouseGovernancaRestricoesV1;\n      var evidenciaAtual=null;',
    '      var restr=window.TataHouseGovernancaRestricoesV1;\n      var est=window.TataHouseGovernancaEstoqueV1;\n      var evidenciaAtual=null;',
)
old = '''        if(restr&&msg.type===restr.requestType){
          if(contextoAberto&&window.__lideresSupa){
            restr.responderPedido(event,{
              iframe:iframe,
              supa:window.__lideresSupa,
              unidade:contextoAberto.unidadeFonte,
              semanaId:contextoAberto.semanaId
            }).catch(function(){});
          }
          return;
        }
'''
new = old + '''        if(est&&msg.type===est.requestType){
          if(contextoAberto&&window.__lideresSupa){
            est.responderPedido(event,{
              iframe:iframe,
              supa:window.__lideresSupa,
              unidade:contextoAberto.unidadeFonte,
              semanaId:contextoAberto.semanaId
            }).catch(function(){});
          }
          return;
        }
'''
once(old, new)
p.write_text(s)
