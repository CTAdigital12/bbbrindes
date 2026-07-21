# Sprint 3 -- Fundacao do backend

Inicio: 09/07/2026. Responsavel: Fabio.

## Objetivo

Sair do wireframe mock e construir a fundacao funcional do site, com base na
arquitetura decidida (ver docs/arquitetura-backend.md): Payload CMS 3 sobre
Postgres (Supabase), imagens no Cloudflare R2 com otimizacao no upload, hospedagem
Cloudflare, renderizacao ISR. Esta sprint cobre tudo que da para fazer sem depender
das frentes externas (design/identidade visual, definicao do ERP, material do
catalogo do Plinio, provedores de CRM/e-mail).

## Atualizacao 15/07/2026 (reuniao Julien x Plinio)

Arquitetura de integracao fechada e estrutura de dados do produto validada pelo
cliente. Detalhe em docs/arquitetura-backend.md (secao "Integracao Site x CRM x ERP")
e docs/modelo-produto.md.

1. Integracao: Site -> CRM (Leads2b) -> ERP (Cigan, assumido como o ERP ate
   confirmacao). O site e o painel de revenda falam SO com o CRM. Sem integracao
   direta site-ERP. Preco, estoque, pedido e historico vem do CRM.
2. Produto: campos novos validados (dois codigos, site + Cigan; headline; palavra
   chave; meta description; argumento comercial; ate 3 categorias; ecologico boolean).
   O schema so sera revisado quando a planilha final do Plinio chegar (codigos em
   unificacao). Ate la, o S03-02 fica congelado. Ver docs/modelo-produto.md.
3. Novos cards desta realidade: S03-09 (integracao Leads2b), S03-10 (UTM + GA para
   lead scoring) e S03-11 (simular os campos novos na PDP do wireframe).

## O que fica de fora (depende de terceiros)

1. Carga real dos ~1200 produtos (aguarda a planilha final do Plinio, com codigos
   unificados).
2. Consumo da API Leads2b (CRM) para preco/estoque/pedido e envio de leads (aguarda
   URL, credencial e doc da API; falta a pauta com o Leonardo para a ponte CRM-ERP).
3. E-mail transacional (aguarda provedor/credenciais).
4. Design visual final (aguarda a identidade visual: brandbook, paleta, fontes).

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
- [S03-09](S03-09-integracao-leads2b.md) (P0, bloqueado) Integracao Leads2b (CRM): revenda e envio de leads
- [S03-10](S03-10-utm-ga-lead-scoring.md) (P1) UTM + tagueamento GA para lead scoring
- [S03-11](S03-11-pdp-campos-novos.md) (P1) Simular os campos novos na PDP do wireframe

## Criterio de pronto

Backend no ar (homologacao) com painel de administracao funcional, login real do
revendedor, o site lendo dados do Payload em vez do mock, captura de leads
persistida e SEO estrutural gerado. Sem lint/typecheck/build quebrados (CLAUDE.md
regra 20). Funcionalidade critica (orcamento, login de revendedor, captura de lead)
com teste minimo (regra 19).
