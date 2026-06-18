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

## 10/06/2026 17:12 BRT (quarta) -- integracao com o Trello

Deploy do Pages confirmado no ar (apos liberar Workflow permissions = Read and write e Pages Source = GitHub Actions).

Feito nesta sessao:
- Criado script scripts/trello-sync.mjs (Node, sem dependencias): le os cards das sprints (docs/sprints/**/S*.md), cria listas por status (A Fazer, Em Andamento, Concluido) e cria cada card com descricao e checklist. Idempotente na criacao (nao duplica pelo codigo S00-xx). Por ora e create-only (nao atualiza card existente).
- Script trello:sync no package.json raiz (node --env-file=.env).
- .env local criado (gitignored) para o responsavel preencher TRELLO_API_KEY e TRELLO_TOKEN. .env.example atualizado com a secao Trello e DATABASE_URI ajustado para Supabase/Postgres.
- Parsing dos cards validado contra os arquivos reais (codigo, status, descricao e checklist corretos).
- Board: https://trello.com/b/dAiTB3Ff/bbbrindesproject (TRELLO_BOARD_ID=dAiTB3Ff).

Sobre cadastro de SKUs (discutido): nao sao 1200 cards. SKUs sao dado, importados via script na Sprint 2 a partir de planilha/export ou, em ultimo caso, scrape do site atual. Aguardando o responsavel confirmar a fonte dos dados do catalogo.

Sync executado: 11 cards da Sprint 0 criados no board, na lista Concluido 🎉, com checklist. Ajuste: o match de listas passou a normalizar nome (sem acento/emoji) para usar as listas que ja existem no board (Backlog, Design, A Fazer, Em andamento, Revisao de codigo, Fase de teste, Concluido 🎉) em vez de criar duplicata. Uma lista duplicada criada por engano foi arquivada e os cards movidos para a correta.

Onde paramos / proximo passo:
- Abrir PR de feature/trello-sync para master.
- Decidir a fonte da verdade de status (Trello x arquivos) antes de evoluir o script para update.

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

---

## 17/06/2026 14:32 BRT (quarta) -- MARCO: revisao do Plinio (bbbrindes) sobre o wireframe

Marco de referencia. A apresentacao ao cliente ocorreu em 15/06; o Plinio (representante da bbbrindes) revisou e enviou comentarios em 17/06. Removido o selo flutuante de wireframe (PR #10). Adicionada ao CLAUDE.md a regra de registro de tempo (secao "Registro de tempo", itens 24 a 26).

Resumo dos pedidos do Plinio (detalhe completo vai para o plano da v2 do wireframe):
- Home: banners rotativos (3+, tamanhos variados); barra de categorias sem scroll horizontal (estilo iFood, 2 linhas); destaques em 1 linha de 4 + "ver todos", itens randomicos (pool de 12); remover tag "Personalizavel" (todos sao); remover secao "Linhas de produto" (replica categorias) e por no lugar secao sazonal/campanhas (~12 itens, destino de LP); manter beneficios e blog; tirar o destaque grande do revendedor e mandar para o rodape; adicionar Cases/prova social e clipping de imprensa; reforcar institucional (forca do Grupo BB).
- Navegacao: logo clicavel abrindo submenu com a arvore (institucional, quem somos, categorias, resumo da home); acesso ao institucional no topo, nao so no rodape. Rodape com quem somos, blog, catalogos, revendedores, area do revendedor, contato, cases, clipping.
- PDP: adicionar video; trocar cor muda imagem; remover "personalizavel" e provavelmente "aplicacoes"; manter descricao, categoria, cores, quantidade e adicionar ao orcamento.
- Identidade visual: alinhar ao catalogo 2026/27 (Plinio enviara o catalogo final apos revisao interna); a versao visual revisada do site sai depois disso. Por ora, mudancas estruturais com tema neutro.

Onde paramos / proximo passo:
- Entrar em plan mode e detalhar o plano da v2 do wireframe incorporando a revisao.

---

## 17/06/2026 16:17 BRT (quarta) -- Sprint 1 iniciada: cards + grupo Home

Plano da v2 aprovado. Versionamento SemVer adotado (master em 0.1.2; Sprint 1 fecha em 0.2.0). Credencial git resolvida por repositorio (useHttpPath + usuario na URL do remote).

Feito nesta sessao:
- Criados os 14 cards da Sprint 1 (docs/sprints/sprint-01, S01-01 a S01-14, um por topico do Plinio) e sincronizados ao board do Trello (lista A Fazer).
- Grupo Home implementado (cards S01-01, 03, 04, 05, 06, 07): carrossel de banners rotativo (BannerCarousel), destaques em 1 linha randomica de um pool de 12 (DestaquesRandom), remocao da tag e do filtro "Personalizavel" e exibicao de tags reais (Ecologico via tagsDoProduto), secao de campanhas sazonais (~12, com landing /campanha/[slug]) no lugar de "Linhas de produto", diferenciais viraram links, e remocao da faixa grande de revendedor da home.
- Build ok. Tema neutro mantido (identidade visual 2026/27 segue pendente do catalogo, card S01-14 bloqueado).

Onde paramos / proximo passo:
- PR feature/sprint-01-home (inclui os cards da sprint + grupo Home) para master.
- Proximos grupos em sequencia: Navegacao (S01-02, 11, 12), Conteudo (S01-08, 09, 10), PDP (S01-13). Bump para 0.2.0 ao fechar.

---

## 17/06/2026 17:02 BRT (quarta) -- Sprint 1: grupo Navegacao

Feito nesta sessao (cards S01-02, S01-11, S01-12, todos concluidos):
- S01-02 barra de categorias sem scroll: CategoryMenu reescrito como grid estilo iFood (icone placeholder + label), ate 2 linhas no desktop (md:grid-cols-6) e menos colunas no mobile, sem overflow-x.
- S01-11 logo com submenu: novo componente client LogoMenu com dropdown acessivel (aria-expanded/haspopup, fecha no Escape com retorno de foco ao botao e no clique fora). Arvore: pagina inicial, grupo Institucional (quem somos, revendedores, catalogos, blog, contato, sac) e grupo Categorias. Header passou a usar LogoMenu no lugar do link fixo. Institucional agora acessivel no topo, nao so no rodape.
- S01-12 rodape reorganizado: grupos Institucional, Revenda (inclui area do revendedor) e Imprensa (cases, clipping), mantendo contato e versao. Criadas paginas placeholder /cases e /clipping para os links nao quebrarem; o conteudo real fica nos cards S01-08 e S01-09 (grupo Conteudo).

Verificacao:
- Build de export ok (46 rotas, agora com /cases e /clipping; lint e tipos validos; Exporting 3/3).
- Smoke HTTP no dev server: 200 em /, /cases, /clipping, /catalogo, /quem-somos.
- Pendente: validacao visual interativa no browser (abrir o submenu da logo, conferir as 2 linhas das categorias e o rodape) antes do merge.

Ajuste pos-revisao do Fabio (mesma sessao):
- O Fabio apontou que a barra de categorias estilo iFood (S01-02) ficou redundante com a secao "Categorias" do corpo da Home (ambas icone + label, alem do submenu da logo). Decisao: a faixa estilo iFood fica so na Home; a barra global saiu do Header e o CategoryMenu.tsx foi removido. A secao da Home virou o estilo iFood sem moldura. Categorias em outras paginas ficam no submenu da logo (S01-11) e nos filtros do catalogo. Build de export ok apos o ajuste.

Onde paramos / proximo passo:
- Branch feature/sprint-01-navegacao com o grupo Navegacao (commit do grupo + commit do ajuste da Home). PR para master e push aguardam autorizacao do Fabio.
- Proximo grupo: Conteudo (S01-08 cases, S01-09 clipping, S01-10 institucional reforcado), que preenche o conteudo real das paginas placeholder. Depois PDP (S01-13). Fechar a sprint em 0.2.0.

---

## 17/06/2026 19:01 BRT (quarta) -- fechamento do dia: Navegacao mergeada

Grupo Navegacao revisado pelo Fabio no browser e mergeado na master via PR #15 (commits 6736b95 e a0af3f1). O push na master dispara o deploy do Pages.

Resumo do dia (Sprint 1):
- Grupo Home ja estava mergeado (PR #13) no inicio do dia.
- Grupo Navegacao concluido e mergeado: S01-02 categorias estilo iFood sem scroll (consolidada so na Home apos a revisao, barra global do Header removida e CategoryMenu deletado), S01-11 LogoMenu com submenu acessivel (Escape, clique fora) levando o institucional ao topo, S01-12 rodape em grupos Institucional/Revenda/Imprensa. Paginas placeholder /cases e /clipping criadas para nao quebrar os links do rodape.
- Incidente resolvido: o erro "Cannot find module './888.js'" no dev era cache stale do .next (dev server orfao no Windows somado a builds de export por cima da mesma pasta). Corrigido limpando .next/out e reiniciando o dev. Licao registrada para nao repetir.

Verificacao: build de export ok (46 rotas, lint e tipos validos, Exporting 3/3); smoke HTTP 200 em /, /cases, /clipping, /catalogo; _not-found serve 404 corretamente.

Pendencias para 18/06 (amanha):
- Grupo Conteudo: S01-08 cases (depoimentos, logos de clientes, resultados), S01-09 clipping (materias com veiculo, data e link), S01-10 institucional reforcado (forca do Grupo BB). Preenche os placeholders /cases e /clipping. Branch a partir da master atualizada.
- Depois: grupo PDP (S01-13 video, trocar cor muda imagem, remover personalizavel e aplicacoes). S01-14 identidade visual segue BLOQUEADO ate o catalogo 2026/27 do Plinio.
- Trello: mover S01-02, S01-11 e S01-12 para Concluido e marcar o checklist (depende das credenciais TRELLO_API_KEY/TOKEN no .env; o sync e create-only).
- Ao fechar a sprint, bump de versao para 0.2.0.
- Opcional: podar branches locais ja mergeadas (sprint-00, sprint-01-home, chore antigos) quando autorizado.

Onde paramos: master em 348011c, grupo Navegacao mergeado. Proximo passo amanha: iniciar o grupo Conteudo a partir da master atualizada.

---

## 18/06/2026 11:19 BRT (quinta) -- Sprint 1: grupo Conteudo

Grupo Conteudo implementado na branch feature/sprint-01-conteudo (a partir da master 59fbad7, que ja inclui o registro de fechamento mergeado no PR #16).

Feito nesta sessao (cards S01-08, S01-09, S01-10, todos concluidos):
- S01-08 Cases: pagina /cases real (galeria por cliente/segmento, secao de depoimentos, CTA para orcamento/contato) com mock em data/cases.ts (exemplos ilustrativos: Coca-Cola, Ambev, Natura, Sicredi, Localiza, Prefeitura). Teaser na home e link no rodape e no submenu da logo.
- S01-09 Imprensa: a rota /clipping (placeholder do grupo Navegacao) foi renomeada para /imprensa (o card pede /imprensa e e melhor para SEO em PT). Pagina /imprensa real (materias com veiculo, data e resumo) com mock em data/imprensa.ts. Teaser na home e link no rodape (label "Imprensa") e no submenu da logo. /clipping passou a retornar 404.
- S01-10 Institucional: /quem-somos reforcada com bloco da forca do Grupo BB, numeros de autoridade, bloco de sustentabilidade e chamadas para Cases e Imprensa, mantendo os diferenciais e o tema neutro.
- Tipos Case e Materia adicionados em lib/types.ts.

Verificacao: build de export ok (lint e tipos validos, Exporting 3/3). Smoke HTTP no dev: 200 em /, /cases, /imprensa, /quem-somos; /clipping retorna 404. Dev server encerrado e arvore de node finalizada (porta 3000 livre), seguindo a licao do cache .next.

Onde paramos / proximo passo:
- Branch feature/sprint-01-conteudo com o grupo Conteudo. Falta commit; PR para master e push aguardam autorizacao do Fabio.
- Ultimo grupo da sprint: PDP (S01-13). Ao fechar, bump de versao para 0.2.0. S01-14 identidade visual segue bloqueado ate o catalogo 2026/27.
- Trello: mover Navegacao (S01-02/11/12) e Conteudo (S01-08/09/10) para Concluido quando houver credenciais.

---

## 18/06/2026 12:03 BRT (quinta) -- Sprint 1: grupo PDP (S01-13)

Grupo PDP implementado na branch feature/sprint-01-pdp (a partir da master cc64225, com o grupo Conteudo ja mergeado no PR #17).

Feito nesta sessao (card S01-13 concluido):
- PDP revisada conforme o Plinio. Galeria e selecao de cor unificadas no novo componente client ProdutoView (compartilham o estado da cor); o ProdutoCompra foi absorvido e removido.
- Galeria com opcao de video: thumbs de imagem e de video; o thumb de video troca a midia principal para um placeholder de video. Trocar a cor muda a imagem principal (no wireframe, cor solida da variacao com o rotulo da cor).
- Removidos "personalizavel" e "aplicacoes" da PDP. Mantidos descricao, categoria, material, cores, quantidade e adicionar ao orcamento.

Verificacao: build de export ok (lint e tipos validos, Exporting 3/3). Smoke HTTP no dev: 200 em / e nas paginas de produto. Dev server deixado no ar para o Fabio testar a interacao (cor e video); sera encerrado com a arvore de node ao terminar.

Onde paramos / proximo passo:
- Branch feature/sprint-01-pdp com o grupo PDP. PR e push aguardam autorizacao do Fabio.
- Com a PDP mergeada, fecha-se a Sprint 1 (todos os grupos, exceto S01-14 identidade visual, BLOQUEADO ate o catalogo 2026/27). Proposto bump de versao para 0.2.0 ao fechar.
- Trello: mover Navegacao, Conteudo e PDP para Concluido quando houver credenciais.

---

## 18/06/2026 14:17 BRT (quinta) -- Sprint 1 fechada: bump 0.2.0

PDP mergeada na master (PR #18). Todos os grupos da revisao do Plinio estao na master: Home (PR #13), Navegacao (PR #15), Conteudo (PR #17) e PDP (PR #18).

Feito nesta sessao (fechamento):
- Bump de versao 0.1.2 para 0.2.0 em package.json (raiz e frontend). O rodape passa a mostrar v0.2.0 (next.config le pkg.version do frontend).
- CHANGELOG.md: secao [0.2.0] datada (2026-06-18) e revisada (corrigido "Clipping" para "Imprensa", incluido o institucional reforcado e os detalhes da PDP).
- Build de export ok com frontend@0.2.0 (Exporting 3/3).

Escopo concluido da Sprint 1: banners rotativos, categorias estilo iFood na home, destaques randomicos, campanhas sazonais, logo com submenu acessivel, rodape reorganizado, paginas Cases e Imprensa, institucional reforcado e PDP revisada. Unico card em aberto: S01-14 identidade visual, BLOQUEADO ate o Plinio enviar o catalogo 2026/27.

Onde paramos / proximo passo:
- Branch chore/fechamento-sprint-01 com o bump. PR para master para o Fabio mergear; apos o merge, master em 0.2.0 e Sprint 1 oficialmente fechada.
- Trello: mover os cards de Navegacao, Conteudo e PDP para Concluido (depende das credenciais TRELLO_API_KEY/TOKEN).
- Sprint 2 a alinhar com o Fabio: provavel inicio do backend (Payload CMS + Supabase) e a identidade visual quando vier o catalogo 2026/27.
