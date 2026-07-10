# S03-07 SEO estrutural (sitemap, robots, metadata)

Status: a fazer
Frente: frontend
Prioridade: P1
Atualizado: 09/07/2026 BRT

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
