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
- [S03-12](S03-12-portal-revendedor-pre-pedido.md) (P1) Portal do revendedor (pre-pedido)

## Criterio de pronto

Backend no ar (homologacao) com painel de administracao funcional, login real do
revendedor, o site lendo dados do Payload em vez do mock, captura de leads
persistida e SEO estrutural gerado. Sem lint/typecheck/build quebrados (CLAUDE.md
regra 20). Funcionalidade critica (orcamento, login de revendedor, captura de lead)
com teste minimo (regra 19).

## Atualizacao 23/07/2026 (backend no ar + golden paths: ordem de execucao)

Dois marcos mudam a ordem:
1. Banco confirmado (Supabase) e o /admin do Payload SUBIU conectado ao Supabase, com o
   schema das 10 colecoes criado. O S03-01 fechou e o S03-02 esta validado no nivel de
   schema. Isso destrava tudo que dependia do banco.
2. Golden paths do revendedor e do administrador documentados em docs/golden-paths.md, e
   incorporados aos cards S03-03, S03-04, S03-06 e no novo S03-12.

Ordem para codar agora (sem depender do Plinio nem da integracao):
1. S03-03 auth: Revendedores como colecao auth (acesso unico por empresa, campo `nivel`
   1 a 4, aprovar-e-atribuir-tabela no mesmo passo); admin do Payload protegido.
2. S03-04 conteudo: front lendo as colecoes de conteudo (home, banners, categorias,
   campanhas, blog, cases, imprensa) e a pagina institucional de Revendedores. Produtos e
   PDP esperam o schema fechar.
3. S03-06 leads: formularios de orcamento, SAC e "Quero ser revendedor" gravando via
   adapter stub + log de entrega (sem armazenar). Envio real ao Leads2b e Fase 1.
4. S03-12 shell do portal do revendedor: navegacao + estoque por cor + "FAZER PEDIDO"
   como pre-pedido, com preco/estoque/NF/rastreamento em placeholder.

Espera a integracao Leads2b (Fase 1, token + endpoint): envio real de leads, funil de
revenda, e os dados transacionais do portal (preco por tabela, estoque, NF, rastreamento).

Espera o Plinio: schema de Produto (granularidade, imagens, cores) e, portanto, a fiacao
de Produtos/PDP e a migration (S03-05).

Pendencia a confirmar com o Julien: se o financeiro (boleto, limite, saldo) entra na v1
do portal (ver docs/golden-paths.md, secao 4).
