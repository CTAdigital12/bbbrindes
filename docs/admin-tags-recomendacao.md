# Item H (revisao Plinio 10/11): Conteudo > Tags, pra que servem?

Pergunta do Plinio: "Tags: pra que servem e onde? Se for pra SEO, ok; senao nao vejo sentido."

## O que foi medido (investigacao, sem alterar codigo)

- A colecao `tags` (Conteudo > Tags) e um relacionamento usado em TRES colecoes:
  `backend/src/collections/Posts.ts`, `Cases.ts` e `Imprensa.ts` (campo `tags`,
  `relationTo: 'tags'`, `hasMany`). A descricao delas diz: "distribuir/relacionar
  conteudo entre blog, cases e imprensa".
- NAO aparecem em Produtos, Banners nem Configuracoes. O que existe em
  `Produtos.ts` e um campo de SEO separado chamado `titleTag` (nada a ver com a
  colecao `tags`).
- No site (frontend estatico) as tags da colecao NAO sao usadas em lugar nenhum:
  - As paginas de blog, cases e imprensa (`frontend/src/app/blog`, `/cases`,
    `/imprensa`) nao renderizam tag alguma.
  - Nao ha meta `keywords` nem nenhum uso de SEO a partir dessas tags.
  - A camada de dados do site (`frontend/src/lib/content.ts`, `data/blog.ts`) nem
    carrega o campo `tags`: ele e descartado.
  - O `tags?: string[]` que existe em `frontend/src/lib/types.ts` e de PRODUTO
    (ex.: "Ecologico"), hardcoded, outra coisa, nao a colecao de tags do painel.

Conclusao factual: hoje as tags do painel nao fazem NADA no site. Nao e SEO, nao
agrupa, nao filtra, nao aparece. E so um campo que o cliente preenche sem efeito.

## Recomendacao

Duas saidas validas. Minha recomendacao e a opcao 1.

1. REMOVER (recomendado agora). Como nada consome as tags, elas so confundem
   quem usa o painel (o cliente marca algo achando que serve pra SEO). Tirar o
   campo `tags` de Posts/Cases/Imprensa e, se nao sobrar uso, esconder ou remover
   a colecao `tags`. Baixo risco: nenhum dado do site depende disso.

2. MANTER e dar funcao de SEO/curadoria. So vale se o time for de fato construir:
   paginas de agrupamento por tag (`/blog/tag/ecobrindes`), bloco "conteudos
   relacionados" cruzando blog + cases + imprensa pela tag, e/ou meta keywords.
   Enquanto isso nao existir, cai na mesma critica do Plinio ("nao vejo sentido").

## Follow-up (fora do escopo deste PR, pra nao colidir com outros agentes)

A remocao mexe em `Posts.ts` (meu), mas tambem em `Cases.ts` e `Imprensa.ts`
(de outro agente / fora do meu escopo) e na propria colecao `Tags.ts`. Por isso
NAO removi nada aqui: fica como decisao do Fabio/Plinio. Se a decisao for remover,
abrir um PR de integracao que:
- tira o campo `tags` de Posts.ts, Cases.ts e Imprensa.ts;
- remove (ou esconde via `admin.hidden`) a colecao `Tags.ts` e tira do
  `payload.config.ts` + `REBUILD_ON_CHANGE`;
- gera a migration que dropa as tabelas de juncao.

Se a decisao for manter, abrir tarefa de front pra efetivamente renderizar/usar
as tags (agrupamento + relacionados + SEO).
