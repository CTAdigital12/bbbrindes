# S02-07 Arquitetura de dados do catalogo (ERP, imagens, migration)

Status: em andamento
Frente: backend
Prioridade: P0
Atualizado: 08/07/2026 BRT

## Descricao
Definir de onde vem o dado do catalogo real. O cliente confirmou que produto, preco e estoque ficam no sistema deles e a integracao e com o ERP. O painel de administracao (Payload) e onde os produtos sao registrados. As imagens sao hospedadas por nos, enviadas pelo Plinio. Carga inicial dos ~1200 produtos via migration one-shot.

## Checklist
- [x] Fonte de dados confirmada: ERP para preco e estoque; painel para cadastro
- [x] Imagens hospedadas por nos, enviadas pelo Plinio
- [x] Decisao: carga inicial via migration one-shot
- [ ] Descobrir qual e o ERP e como ele expoe dados (API/webservice/export)
- [ ] Confirmar se a area do revendedor mantem preco/estoque do ERP
- [ ] Definir formato do material do Plinio (planilha + convencao de imagem por SKU)
- [ ] Modelo de dados do Produto (SKU como chave; preco/estoque como campos do ERP)

## Observacoes
SKU e a chave que amarra painel e ERP: o cadastro cria o produto, o ERP casa por SKU so para preco e estoque. Detalhes na memoria do projeto (catalogo-arquitetura) e no REGISTRO. Aguardando resposta do cliente sobre o ERP e o material do Plinio.
