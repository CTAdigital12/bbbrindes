# Sprint 3 -- Fundacao do backend

Inicio: 09/07/2026. Responsavel: Fabio.

## Objetivo

Sair do wireframe mock e construir a fundacao funcional do site, com base na
arquitetura decidida (ver docs/arquitetura-backend.md): Payload CMS 3 sobre
Postgres (Supabase), imagens no Cloudflare R2 com otimizacao no upload, hospedagem
Cloudflare, renderizacao ISR. Esta sprint cobre tudo que da para fazer sem depender
das frentes externas (design/identidade visual, definicao do ERP, material do
catalogo do Plinio, provedores de CRM/e-mail).

## O que fica de fora (depende de terceiros)

1. Carga real dos ~1200 produtos (aguarda o material do Plinio).
2. Integracao do ERP para preco e estoque (aguarda saber qual e o ERP).
3. Envio real ao CRM e e-mail transacional (aguarda os provedores).
4. Design visual final (aguarda a identidade visual).

Onde esses itens tocam o codigo, deixamos a estrutura pronta e o ponto de plugar
isolado (interface/adapter), para conectar sem retrabalho quando destravar.

## Cards

Prioridade P0 = fundacao, destrava o resto. P1 = importante, nao bloqueia.

- [S03-01](S03-01-scaffold-backend.md) (P0) Scaffold do backend (Payload + Supabase + R2)
- [S03-02](S03-02-modelagem-colecoes.md) (P0) Modelagem das colecoes (schema)
- [S03-03](S03-03-auth-login.md) (P0) Autenticacao e paginas de login
- [S03-04](S03-04-front-consome-payload.md) (P0) Frontend consumindo o Payload
- [S03-05](S03-05-migration-catalogo.md) (P1) Migration de carga do catalogo
- [S03-06](S03-06-captura-leads.md) (P0) Captura de leads (orcamento e SAC)
- [S03-07](S03-07-seo-estrutural.md) (P1) SEO estrutural (sitemap, robots, metadata)
- [S03-08](S03-08-infra-deploy.md) (P0) Infra e deploy (Cloudflare + R2 + Supabase)

## Criterio de pronto

Backend no ar (homologacao) com painel de administracao funcional, login real do
revendedor, o site lendo dados do Payload em vez do mock, captura de leads
persistida e SEO estrutural gerado. Sem lint/typecheck/build quebrados (CLAUDE.md
regra 20). Funcionalidade critica (orcamento, login de revendedor, captura de lead)
com teste minimo (regra 19).
