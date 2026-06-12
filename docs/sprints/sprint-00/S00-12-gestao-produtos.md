# S00-12 Administracao do site: produtos e SKUs (wireframe)

Status: concluido
Frente: frontend
Prioridade: P1
Atualizado: 12/06/2026 BRT

## Descricao
Wireframe da administracao do site (admin do site todo), separada do visitante, para cadastrar produtos e SKUs. Mostra os produtos com a marcacao de origem (Importado x Manual) e permite adicionar um produto novo manualmente, de forma amigavel. A area do revendedor puxa esses produtos e SKUs da lista geral do site (os cadastrados aqui aparecem la marcados como Novo). Tudo mock client-side (localStorage), sem backend e sem auth real. Na producao isso vira a coleção Produtos no Payload, com origem "manual" convivendo com a "import" (um import nunca apaga os manuais).

## Checklist
- [x] Pagina /gestao com cabecalho distinto e lista de produtos
- [x] Coluna de origem (Importado x Manual) e contagem
- [x] Botao Adicionar produto
- [x] Pagina /gestao/novo com formulario (nome, categoria, material, descricao, aplicacoes, variacoes de cor, faixa de preco, personalizavel, imagens)
- [x] Salvar produto manual (localStorage) e refletir na lista
- [x] Remover produto manual
- [x] Acesso pela navegacao (link no rodape)
- [x] Aviso de que e wireframe e que import nao apaga manuais
