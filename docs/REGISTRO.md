# Registro de tempo

Log de sessoes. Cada entrada usa horario de Brasilia (BRT, UTC-3). Serve para sempre sabermos o que foi feito e onde paramos. Tempo e fator determinante no projeto.

Marcos do projeto:
- Marco zero: 10/06/2026 12:14 BRT (quarta).
- Apresentacao do front ao cliente: 15/06/2026 (segunda).
- Meta de finalizacao (~30 dias apos a apresentacao): por volta de 15/07/2026.
- Teto total (2 meses): ~10/08/2026.

---

## 10/06/2026 12:14 BRT (quarta) -- inicio do projeto, Sprint 0

Responsavel: Fabio (unico dev e lider).

Feito nesta sessao:
- Definido o plano e a stack: monorepo pnpm, frontend Next.js 15 (App Router) + TS + Tailwind, backend Payload CMS (a partir da Sprint 1).
- Criada a base do monorepo (pnpm-workspace, package.json raiz, .gitignore, .env.example, README).
- Atualizada a secao de stack no CLAUDE.md.
- Criado o registro de tempo e os cards da Sprint 0.

Onde paramos / proximo passo:
- Em andamento o scaffold do frontend Next.js e a montagem das telas do wireframe (cards S00-02 em diante).

Pendencias com o responsavel:
- Definir identidade git oficial (nome/email) antes do primeiro commit (CLAUDE.md regra 9). Git ainda nao inicializado.
- Sem push ate autorizacao explicita.

---

## 10/06/2026 12:48 BRT (quarta) -- Sprint 0 concluida (wireframe)

Feito nesta sessao:
- Frontend Next.js 15 + TS + Tailwind montado e rodando. Layout base (header com busca e menu de categorias, footer).
- Telas: Home, Catalogo com filtros e busca, PDP com variacao de cor e adicionar ao orcamento, Carrinho de orcamento com formulario, Tela de confirmacao com WhatsApp, Login e Painel do revendedor (precos, estoque, fechamento, historico, cadastro/entrega, uploads, notas), institucionais (Quem Somos, SAC com seletor de motivo, Contato, Revendedores, Catalogos, Blog lista e post).
- Cards S00-01 a S00-11 marcados como concluidos.
- Banco definido pelo responsavel: Supabase (Postgres) para o MVP. Na Sprint 1, Payload usa o adapter Postgres apontando para o Supabase.
- Verificacao: pnpm install ok (19s); build de producao ok (30 rotas, lint e tipos validos); smoke test HTTP 200 em Home, Catalogo, PDP, Orcamento, Login e Painel do revendedor, SAC e Blog.

Como rodar:
- pnpm nao esta instalado global nesta maquina. Usar via corepack: `corepack pnpm@9.12.0 install` e `corepack pnpm@9.12.0 --filter frontend dev`. Sobe em http://localhost:3000. Alternativa: habilitar o pnpm global com `corepack enable` (requer permissao de admin no Windows).

Onde paramos / proximo passo:
- Sprint 0 pronta para apresentacao de segunda (15/06). Aguardando feedback do cliente para priorizar a Sprint 1 (fundacao do backend Payload + Supabase: modelagem de produtos, categorias, variacoes, banners, blog, revendedores, seed e painel admin).

Pendencias com o responsavel:
- Identidade git oficial (nome/email) antes do primeiro commit. Git ainda nao inicializado, sem push.

---

## 10/06/2026 13:29 BRT (quarta) -- publicacao e deploy via GitHub Actions

Feito nesta sessao:
- Repositorio publicado em https://github.com/CTAdigital12/bbbrindes (branch base master). Sprint 0 mergeada na master via PR #1.
- Configurado deploy do wireframe por GitHub Actions no GitHub Pages.
- Frontend ajustado para export estatico (output: export): catalogo passou a ler a query string no client (useSearchParams + Suspense), basePath /bbbrindes para o Pages, trailingSlash e images.unoptimized.
- Workflow .github/workflows/deploy.yml: build do export e deploy no Pages a cada push na master (e manual via workflow_dispatch).
- Verificacao: build de export ok (30 rotas, Exporting 3/3), basePath /bbbrindes aplicado nos assets.

Onde paramos / proximo passo:
- Abrir PR de chore/deploy-github-pages para master. Apos o merge, o Actions publica.
- URL prevista: https://ctadigital12.github.io/bbbrindes/
- Acao manual no GitHub (uma vez): em Settings > Pages, definir Source = GitHub Actions (o workflow tenta habilitar automaticamente via configure-pages enablement; se a org bloquear, fazer manual).

---

## 10/06/2026 15:23 BRT (quarta) -- troca do deploy para a Vercel

Contexto: o GitHub Pages no plano free exige repo publico, e o repo e privado. Decidido (com o responsavel) publicar na Vercel, que aceita repo privado, da URL gratuita *.vercel.app e ja serve para SSR nas proximas sprints. Time pago da Vercel ja existente.

Feito nesta sessao:
- output: export do Next passou a ser condicional (so com STATIC_EXPORT=true). Build padrao volta a ser Next nativo, servido na raiz (sem basePath). Verificado: build ok, rotas estaticas/SSG.
- Removido o workflow .github/workflows/deploy.yml (deploy do Pages), que ficaria falhando a cada push na master.
- README com o passo a passo do deploy na Vercel (Root Directory = frontend, branch de producao master).

Onde paramos / proximo passo:
- Abrir PR de chore/deploy-vercel para master e mergear.
- Na Vercel: importar CTAdigital12/bbbrindes, Root Directory = frontend, deploy. A URL *.vercel.app vai para o cliente. Dominio proprio (os ja existentes no time) fica opcional para depois.

---

## 10/06/2026 15:40 BRT (quarta) -- rollback para o GitHub Pages

Decisao do responsavel: deixar a Vercel em standby e publicar agora pelo GitHub Pages. O repo foi tornado publico, o que destrava o Pages no plano free.

Feito nesta sessao:
- Restaurado o estado de deploy do Pages a partir do commit 86db521: workflow .github/workflows/deploy.yml (com o fix do pnpm) e frontend/next.config.mjs com output: export e basePath /bbbrindes via env.
- README revertido para o estado pre-Vercel.
- A branch chore/deploy-vercel fica preservada no remoto para retomar a Vercel quando o cliente aprovar (ai entra o dominio proprio e o modo SSR).

Onde paramos / proximo passo:
- Mergear chore/rollback-deploy-pages na master. O push dispara o workflow.
- Com o repo publico, habilitar Pages: Settings > Pages > Source = GitHub Actions (o configure-pages tenta habilitar sozinho; em repo publico costuma funcionar). Se a primeira run falhar so no Pages, re-rodar apos habilitar.
- URL: https://ctadigital12.github.io/bbbrindes/

---

## 12/06/2026 11:58 BRT (sexta) -- area do lojista no wireframe (S00-12)

Ainda na fase de wireframe (sem apresentar ao cliente). Adicionada a opcao do lojista cadastrar produto.

Feito nesta sessao:
- Area do lojista (mock, sem auth/backend): pagina /gestao com lista de produtos mostrando origem (Importado x Manual) e botao Adicionar produto; pagina /gestao/novo com formulario amigavel (nome, categoria, material, descricao, aplicacoes, variacoes de cor, faixa de preco, personalizavel, imagens placeholder).
- Produtos manuais persistem em localStorage (frontend/src/lib/lojista.ts), aparecem na lista e podem ser removidos. Aviso explicito de que import nao apaga manuais.
- Acesso pelo rodape (link Area do lojista). Card S00-12 criado.
- Build ok (32 rotas, /gestao e /gestao/novo estaticas).

Onde paramos / proximo passo:
- Abrir PR de feature/wireframe-gestao-produtos para master (apos merge, o deploy do Pages atualiza, se a branch do Trello e esta entrarem na master).
- Decisoes de arquitetura do catalogo real (origem unica com marcacao, gestao via Payload, nopCommerce so como fonte de import) seguem pendentes para a Sprint 1/2, fora do escopo do wireframe.

---

## 12/06/2026 16:19 BRT (sexta) -- ajuste de papeis das areas (admin x revendedor)

Pedido do responsavel: deixar claro que a area antes chamada "lojista" e a administracao do site todo (cadastra produtos e SKUs), e que a area do revendedor puxa esses produtos e SKUs da lista geral do site.

Feito nesta sessao:
- Botao da tabela do revendedor renomeado para "Adicionar ao pedido" (era so "Adicionar", ambiguo).
- Area /gestao renomeada para "Administracao do site" / "Produtos e SKUs" (cabecalho, formulario, link do rodape "Admin do site"). Variacoes de cor rotuladas como SKU.
- Painel do revendedor passou a puxar o catalogo unificado: produtos do catalogo geral mais os cadastrados na administracao (marcados como Novo, com preco por faixa). A aba Pedido usa esse catalogo unificado. Isso demonstra o vinculo admin -> lista geral -> revendedor.
- Build ok (32 rotas).

Onde paramos / proximo passo:
- Branch fix/clareza-revendedor-pedido reune o ajuste de rotulo e o ajuste de papeis. Abrir/atualizar o PR para master.
- Seguem pendentes os merges do PR do Trello e a decisao de fonte dos dados do catalogo (Sprint 1/2).
