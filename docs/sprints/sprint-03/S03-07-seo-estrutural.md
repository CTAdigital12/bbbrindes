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
- [x] app/sitemap.ts gerado a partir das rotas e do catalogo
- [x] app/robots.ts
- [x] Metadata por pagina (title, description) com template
- [x] Open Graph / metadados de compartilhamento
- [x] Dados estruturados Product (JSON-LD) na PDP
- [x] URLs amigaveis conferidas (ja existem via slug)

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

## Atualizacao 22/07/2026 (implementado)
Nucleo do SEO estrutural feito e verificado via build de export:
1. src/lib/site.ts: URL base do site (origin NEXT_PUBLIC_SITE_URL + basePath), com
   helpers pageUrl (barra final) e assetUrl. Default aponta ao Pages; producao define
   NEXT_PUBLIC_SITE_URL (passthrough novo em next.config.mjs).
2. app/sitemap.ts: so rotas publicas e indexaveis (home, catalogo, institucionais,
   produtos, campanhas, blog). Fora: orcamento, gestao, area do revendedor.
3. app/robots.ts: disallow /orcamento/ /gestao/ /revendedor/ (barra final para nao
   pegar a pagina publica /revendedores/), aponta o sitemap.
4. layout.tsx: metadataBase, Open Graph e Twitter padrao, JSON-LD de Organization.
5. produto/[slug]: canonical, Open Graph e JSON-LD de Product + BreadcrumbList.
6. Titulo default e template ajustados para "BB Brindes".

Verificado no out/: robots.txt e sitemap.xml corretos, 0 rota privada no sitemap,
canonical e os 4 schemas (Organization, Product, BreadcrumbList, Brand) na PDP.
Mudanca nao visual (meta/SEO), nao altera o layout renderizado.

Fica para producao: multiplos dominios e LPs, e definir NEXT_PUBLIC_SITE_URL com o
dominio real. Canonical foi aplicado na PDP; estender as demais rotas quando o dominio
existir.
