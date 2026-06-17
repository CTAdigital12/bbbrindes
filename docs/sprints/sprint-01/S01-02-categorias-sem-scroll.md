# S01-02 Barra de categorias sem scroll (estilo iFood)

Status: concluido
Frente: frontend
Prioridade: P0
Atualizado: 17/06/2026 BRT

## Descricao
Remover a barra de rolagem horizontal da barra de categorias (o Plinio nao gostou). Mostrar todas as categorias sem scroll, quebrando em ate duas linhas. Estilo de referencia: categorias do iFood (icone visual + label, fluido, facil de associar).

## Checklist
- [x] Remover overflow-x / scroll horizontal
- [x] Todas as categorias visiveis em ate 2 linhas
- [x] Item visual estilo iFood (icone + label)
- [x] Responsivo (menos colunas no mobile, ainda sem scroll)

## Observacoes
Por decisao do Fabio (revisao da Home), a faixa estilo iFood ficou apenas na Home, nao como barra global no Header. Isso removeu a redundancia com a antiga secao "Categorias" do corpo da Home, que passou a ser o proprio estilo iFood (sem moldura). Em outras paginas, as categorias ficam no submenu da logo (S01-11) e nos filtros do catalogo. Componente CategoryMenu.tsx removido.
