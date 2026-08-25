# S03-12 Portal do revendedor (pre-pedido)

Status: a fazer
Frente: fullstack
Prioridade: P1
Atualizado: 23/07/2026 BRT

## Descricao
A area logada do revendedor no formato definido pelo golden path (docs/golden-paths.md,
secao 2): navegacao igual a do cliente final, com o acrescimo do painel de estoque por
cor e do botao "FAZER PEDIDO". E PRE-PEDIDO, nao e-commerce: nao ha checkout nem pagamento;
o fechamento se da com o financeiro. Depois do pedido emitido, o portal vira ferramenta
informativa (administracao de pedidos, historico, nota fiscal em PDF, rastreamento).

Nasce do golden path apresentado; complementa o S03-03 (auth) e depende do S03-09
(integracao Leads2b) para os dados transacionais.

## Fluxo (golden path)
1. Faz login (S03-03).
2. Cai numa tela que ja mostra os pedidos em aberto.
3. Consulta produto com a tabela de preco DELE aplicada (definida pelo `nivel`, 1 a 4).
4. Monta pedido.
5. Acompanha ate a entrega.
6. Confirmacao de pedido enviado.

## Checklist
- [ ] Shell do portal reusando a navegacao/catalogo do cliente final
- [ ] Tela inicial com "pedidos em aberto"
- [ ] Painel de estoque por cor no produto (placeholder ate o CRM/ERP)
- [ ] Preco por tabela conforme o `nivel` do revendedor (placeholder ate o CRM)
- [ ] Botao "FAZER PEDIDO" que monta um PRE-PEDIDO (sem checkout)
- [ ] Envio do pre-pedido ao CRM/financeiro (adapter, plugavel; depende do S03-09)
- [ ] Pos-emissao: historico de compras, nota fiscal em PDF, rastreamento (do CRM/ERP)
- [ ] Teste minimo do fluxo de montar pre-pedido (CLAUDE.md regra 19)

## Dependencias
- Preco por tabela, estoque por cor em tempo real, nota fiscal em PDF e rastreamento VEM
  do CRM/ERP (Site -> CRM Leads2b -> ERP). O shell navegavel e a montagem do pre-pedido
  dao para construir agora com placeholder; os dados reais entram com a integracao
  (S03-09).
- Financeiro (boleto, limite, saldo): a confirmar se entra na v1 (ver docs/golden-paths.md
  secao 4, pergunta ao Julien). Ate confirmar, NAO modelar financeiro.

## Observacoes
Acesso unico por empresa, sem sub-usuarios na v1 (ver S03-03). Escala esperada ~4000
revendedores.
