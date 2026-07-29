# Taxonomia de navegacao e SEO: categoria, tag/ocasiao e LP de campanha

Fonte da verdade de COMO o catalogo se organiza e como as datas comemorativas e
ocasioes entram no site. Decisoes da reuniao de 21/07/2026 (Plinio e Julien, relato do
Fabio), cruzadas com o codigo atual do wireframe. Complementa docs/modelo-produto.md
(schema do produto) e alimenta os cards S03-07 (SEO estrutural) e S03-11 (PDP).

## 1. O problema: tres conceitos estavam sendo misturados

A ata pergunta se "a pagina do filtro vai alterar o slug ao escolher setembro amarelo".
A pergunta mistura tres mecanismos que sao diferentes e devem continuar separados:

1. Categoria: tipo de produto (Copos, Canecas, Squeezes). Filtro estrutural do catalogo.
   Ja existe, 15 categorias validadas (ver docs/modelo-produto.md, secao 8).
2. Tag / ocasiao: motivo da compra (datas comemorativas, feiras corporativas,
   aniversario de empresa). NAO e categoria fixa. Tagueia-se o produto e filtra-se por
   tag. E o que o Plinio definiu: "datas comemorativas via tagueamento no painel, nao
   categorias fixas".
3. LP de campanha: pagina curada, com slug proprio e keyword no slug, feita para
   ranquear no Google (ex.: /brindes-de-natal). Puxa produtos por tag por dentro, mas e
   uma pagina de verdade, com H1 e texto proprio.

## 2. Como funciona hoje no wireframe (fato, conferido no codigo)

1. Filtro do catalogo (frontend/src/components/CatalogoClient.tsx): le a query string ao
   abrir (`/catalogo?categoria=x`), mas quando o usuario mexe num filtro so atualiza o
   estado em memoria. A URL NAO muda. Nao ha slug por filtro.
2. LP de campanha (frontend/src/app/campanha/[slug]/page.tsx): rota real, gera paginas
   estaticas a partir de frontend/src/data/campanhas.ts (carnaval, dia-das-maes,
   dia-do-cliente, etc.). Slug atual no formato `/campanha/<slug>`.

## 3. Decisao: filtro por tag NAO muda o slug

Escolher uma ocasiao no filtro (ex.: setembro amarelo) e um estado de filtro, nao uma
pagina. No maximo vira query param (`/catalogo?ocasiao=setembro-amarelo`), que nao e
alvo de ranqueamento. Gerar um slug indexavel para cada combinacao de filtro criaria
centenas de paginas rasas e duplicadas e afundaria o SEO do catalogo. E armadilha
classica de SEO de e-commerce (facetas indexaveis). Portanto:

1. Tag/ocasiao filtra o catalogo. Sem slug proprio por tag; query param no maximo, com
   `noindex` nas combinacoes de faceta.
2. Quem tem slug proprio e a LP de campanha, que e um subconjunto curado de ocasioes,
   nao todas.

## 4. LP de campanha: modelo e slug keyword-rich

O modelo apresentado (print /brindes-de-natal) define o formato da LP:

1. H1 com a keyword ("Brindes de Natal corporativos personalizados").
2. Paragrafo de abertura util (o que e, para quem, a partir de quantas unidades).
3. H2 de prazo/urgencia ("Quando fechar o pedido de Natal"). No print ha um
   [PLINIO] confirmar corte real do prazo.
4. Grade de produtos puxada por tag.

Decisao de slug: keyword-rich no topo, sem prefixo `/campanha/`. Natal e
`/brindes-de-natal`, nao `/campanha/natal`. Isso poe a keyword na URL, que ajuda o
ranqueamento. Impacto no wireframe: renomear os slugs de campanha e (se o Fabio pedir)
plugar o layout de LP. Fica para outra tarefa, com validacao no browser antes de subir.

Prioridade das LPs (do print):
1. Estrela / modelo: /brindes-de-natal (pico do setor, fim de ano).
2. Demais ocasioes, prioridade menor, mesma estrutura: /brindes-para-eventos,
   /kits-corporativos, /brindes-para-dia-das-maes, /brindes-para-dia-dos-pais,
   /brindes-para-dia-do-cliente.

Nem toda data vira LP. Datas de menor peso comercial vivem so como tag/filtro.

## 5. Feiras corporativas e aniversario de empresa: tag, nao categoria

A ata pede "incluir as categorias: feiras corporativas, aniversario de empresa". Pela
propria logica do Plinio (data = tag, nao categoria), essas duas sao OCASIAO, nao tipo
de produto. Recomendacao: entram como tag/ocasiao (item 2 da secao 1) e cada uma ganha
uma LP curada so se valer o esforco de SEO. Coloca-las como categoria misturaria "tipo
de produto" com "motivo da compra" no mesmo filtro, exatamente o que a decisao de tags
evita. Pendente de aceite do Plinio.

## 6. Datas comemorativas (planilha GERAL B2B do MKT)

Fonte: planilha de datas apresentada na reuniao (coluna "quando soltar a campanha" =
data de lancamento da campanha, cerca de dois meses antes do evento). Estas viram TAGS
de ocasiao; o subconjunto priorizado (secao 4) tambem vira LP.

| Evento | Data | Soltar campanha |
| --- | --- | --- |
| Carnaval | 15-fev | 17-dez |
| Dia da Mulher | 8-mar | 7-jan |
| Dia do Consumidor | 15-mar | 14-jan |
| Dia Mundial da Agua | 22-mar | 21-jan |
| Pascoa | 20-abr | 19-fev |
| Dia Mundial da Saude | 7-abr | 6-fev |
| Dia do Trabalhador | 1-mai | 2-mar |
| Dia das Maes | 1-mai | 2-mar |
| Dia Mundial do Meio Ambiente | 5-jun | 6-abr |
| Dia dos Namorados | 12-jun | 13-abr |
| Festas Juninas | 1-jun | 2-abr |
| Inverno | 21-jun | 22-abr |
| Dia dos Pais | 1-ago | 2-jun |
| Setembro Amarelo | 1-set | 3-jul |
| Dia do Cliente | 15-set | 17-jul |
| Outubro Rosa | 1-out | 2-ago |
| Dia do Vendedor | 1-out | 2-ago |
| Dia das Criancas | 12-out | 13-ago |
| Novembro Azul | 1-nov | 2-set |
| Final de Ano | 1-dez | 2-out |
| Verao | 25-dez | 26-out |

Observacoes:
1. A coluna "quando soltar" implica agendamento de banner/campanha. No schema, a
   campanha/tag pode ter janela de exibicao (inicio e fim), para o painel acender e
   apagar sozinho. Confirmar com o Plinio se querem automatico ou manual.
2. Algumas nao sao data comemorativa de venda no sentido classico (Inverno, Verao); sao
   sazonalidade. Mesmo tratamento de tag.
3. A planilha do wireframe (campanhas.ts) tem um subconjunto; ao migrar para o Payload,
   esta lista e a referencia.

## 7. Impacto no schema (entra em docs/modelo-produto.md, S03-02)

1. Produto ganha `ocasioes` (relacao multipla de tags), distinta de `categorias`.
2. Colecao nova (ou reuso de Campanhas) para as ocasioes/datas, com nome, slug, janela
   de exibicao e flag "tem LP".
3. Segue congelado junto com o resto do schema ate a decisao do banco.

## 8. Pendencias

1. Aceite do Plinio: feiras corporativas e aniversario de empresa como tag, nao
   categoria.
2. [PLINIO] corte real de prazo nas LPs (ex.: quando fechar o pedido de Natal).
3. Confirmar se a janela de campanha e automatica (agendada) ou manual.
4. Renomear slugs de campanha para keyword-rich e plugar o layout de LP: tarefa de
   front separada, com validacao no browser (regra 27).
