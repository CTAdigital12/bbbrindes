# S01-13 PDP revisada

Status: concluido
Frente: frontend
Prioridade: P0
Atualizado: 18/06/2026 BRT

## Descricao
Ajustes na pagina interna de produto pedidos pelo Plinio: adicionar opcao de video (imagem + video demonstrativo); ao trocar a cor, mudar a cor/imagem do produto; remover "personalizavel" e "aplicacoes" (nao fazem sentido). Manter descricao, categoria, cores disponiveis, quantidade e adicionar ao orcamento.

## Checklist
- [x] Galeria com opcao de video (placeholder imagem + video)
- [x] Trocar a cor muda a imagem/cor exibida
- [x] Remover "personalizavel" da PDP
- [x] Remover "aplicacoes" da PDP
- [x] Manter descricao, categoria, cores, quantidade, adicionar ao orcamento

## Observacoes
A galeria e a selecao de cor foram unificadas num componente client (ProdutoView) para compartilhar o estado da cor; o ProdutoCompra foi absorvido e removido. A imagem principal usa a cor da variacao selecionada (no wireframe, cor solida com rotulo); o thumb de video troca a midia principal para um placeholder de video. Material foi mantido (nao foi pedido para remover); personalizavel e aplicacoes sairam da PDP.
