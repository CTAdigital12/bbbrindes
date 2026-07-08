# S02-05 Responsividade das grades e busca no mobile

Status: concluido
Frente: frontend
Prioridade: P0
Atualizado: 08/07/2026 BRT

## Descricao
Correcoes de responsividade no celular apontadas pelo Fabio: a busca do header ficava espremida, e as faixas com contagem impar deixavam um card orfao na ultima linha.

## Checklist
- [x] Busca do header vai para uma 2a linha full-width no mobile, sempre visivel
- [x] Faixas de produto com 6 no celular e 5 no PC (sem card orfao)
- [x] Faixa de campanhas limitada a numero par
- [x] Diferenciais em 3 colunas (3x3), sem selo orfao

## Observacoes
Entregue nos PRs #21 (busca) e #24 (grades). No PC o 6o card da faixa fica oculto (lg:hidden). Os 9 diferenciais passam a 3 colunas em qualquer tela.
