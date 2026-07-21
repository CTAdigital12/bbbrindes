# S03-07 SEO estrutural (sitemap, robots, metadata)

Status: a fazer
Frente: frontend
Prioridade: P1
Atualizado: 15/07/2026 BRT

## Descricao
Colocar a base tecnica de SEO que e so codigo e depende das rotas que ja existem:
sitemap, robots e metadados por pagina. A parte de multiplos dominios e LPs entra
com o ambiente de producao.

## Checklist
- [ ] app/sitemap.ts gerado a partir das rotas e do catalogo
- [ ] app/robots.ts
- [ ] Metadata por pagina (title, description) com template
- [ ] Open Graph / metadados de compartilhamento
- [ ] Dados estruturados Product (JSON-LD) na PDP
- [ ] URLs amigaveis conferidas (ja existem via slug)

## Observacoes
Multiplos dominios/LPs (~70) e estrutura para midia paga ficam para quando houver o
dominio de producao. Ver docs/arquitetura-backend.md.

## Atualizacao 15/07/2026
Divisao de responsabilidade: o SEO por produto (palavra chave, meta description,
descricoes) vive na colecao Produtos (S03-02, validado com o cliente). Este card
consome esses campos e cuida do SEO estrutural do site (sitemap, robots, JSON-LD,
Open Graph, canonical). Ver docs/modelo-produto.md.

## Atualizacao 21/07/2026 (taxonomia e LPs)
Decisao de navegacao e SEO registrada em docs/taxonomia-navegacao-seo.md, e afeta este
card:
1. Filtro por tag/ocasiao (datas comemorativas) NAO gera slug indexavel. No maximo query
   param, com noindex nas facetas, para nao criar paginas rasas.
2. LP de campanha e o que tem slug proprio, keyword-rich no topo (/brindes-de-natal, nao
   /campanha/natal). Subconjunto curado de ocasioes, nao todas as datas.
3. O sitemap deve incluir as LPs de campanha e as rotas reais, e excluir as combinacoes
   de filtro. Renomear os slugs de campanha e uma tarefa de front separada (validacao no
   browser).
