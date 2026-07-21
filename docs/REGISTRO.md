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

---

## 23/06/2026 21:02 BRT (terca) -- Home: ajustes da nova revisao do Plinio

Branch feature/home-ajustes-plinio a partir da master atualizada (origin/master c17af4e). Aplicado o retorno do Plinio sobre a Home (arquivo de anotacoes no Obsidian).

Feito nesta sessao:
- Menu da logo (LogoMenu) em 2 colunas no desktop: coluna 1 Pagina inicial + Institucional, coluna 2 Categorias. Colapsa para 1 coluna no mobile (divisor vira borda superior), atendendo o pedido de cuidado com responsividade.
- Secao "Destaques" renomeada para "Lancamentos" (DestaquesRandom), agora com 6 produtos e imagens menores (ProductCard ganhou modo compacto com aspect 4/3; catalogo segue aspect-square).
- Nova faixa "Linha Ecologica" logo abaixo de Campanhas e datas, reusando ProductRow. Filtro por produto eco extraido para o helper ehEcologico/produtosEcologicos em data/produtos.ts (mesma regra ja usada nas tags).

Verificacao: tsc --noEmit ok e next lint sem warnings. Falta validacao visual no browser antes do PR (regra do projeto).

Onde paramos / proximo passo:
- Commit local na branch. PR e push aguardam autorizacao do Fabio e a validacao da UI no browser.
- Ponto em aberto para confirmar com o Plinio: a "Linha Ecologica" foi interpretada como nova faixa de produtos eco abaixo de campanhas; se a intencao era so reposicionar os selos/diferenciais, ajustar.

Ajuste adicional (mesma sessao): busca do Header quebrava no mobile (input espremido a zero ao lado do botao Buscar). Corrigido com flex-wrap + order: no mobile a busca vai para uma 2a linha full-width (sempre visivel, sem lupinha que exige toque extra), no desktop segue inline em 1 linha. Input ganhou flex-1 min-w-0 e o botao Buscar shrink-0. Validado visualmente pelo Plinio/Fabio.

---

## 24/06/2026 18:43 BRT (quarta) -- Home: 2a rodada de ajustes do Plinio

PR #21 (1a rodada) mergeado na master (commit 044adbd). Plinio validou a faixa ecologica como sessao tipo Lancamentos e pediu nova rodada. Branch feature/home-revisao-plinio-2 a partir da master atualizada.

Feito nesta sessao:
- Lancamentos e Brindes Ecologicos com 5 produtos cada (era 6 no Lancamentos; eco era ProductRow com 4). Grids em lg:grid-cols-5.
- Faixa "Linha Ecologica" renomeada para "Brindes Ecologicos". Passou de ProductRow para sessao inline na home, no mesmo estilo de Lancamentos (compacto). ProductRow deixou de ser usado.
- Regra ehEcologico ampliada para incluir material "Fibra natural", o que leva o catalogo eco a 5 itens (entrou o cordao de fibra natural). Mesma regra alimenta a tag "Ecologico".
- Cores removidas dos cards na home (Lancamentos e Brindes Ecologicos) via nova prop ocultarCores no ProductCard. No catalogo e na PDP as cores seguem.
- Menu da logo agora com 3 colunas no desktop: Institucional | Categorias | Datas comemorativas. A coluna de datas lista Carnaval, Dia da Mulher, Dia das Maes, Dia dos Pais e Dia do Cliente, com link para a LP de cada campanha. Colapsa para 1 coluna no mobile.
- Adicionada a campanha "Dia da Mulher" (Marco) em data/campanhas.ts, para a LP existir e o link do menu funcionar. Efeito colateral: a faixa "Campanhas e datas" da home passou de 12 para 13 itens.

Verificacao: tsc --noEmit ok, next lint sem warnings, home 200, /campanha/dia-da-mulher 200. Falta validacao visual no browser antes do PR.

Onde paramos / proximo passo:
- Commit local na branch. PR e push aguardam o aceite visual e a autorizacao do Fabio.
- Ponto a decidir: a faixa "Campanhas e datas" da home ficou com 13 tiles (sobra 1 na grade de 6 colunas no desktop). Confirmar se mantem todas ou limita a um numero par.

---

## 25/06/2026 18:44 BRT (quinta) -- Categorias novas, cards sem tag/categoria e header fixo

PR #22 (2a rodada) mergeado na master (e53aa77). Nova rodada do Plinio, com referencia ao site plusbrindes.com.br. Branch feature/categorias-cards-header-plinio a partir da master.

Feito nesta sessao:
1. Reestruturacao das categorias para as 15 novas: Green Plasticaria, Green Fibras, Copos, Canecas e Xicaras, Chaveiros, Casa e Decoracao, Medalhas e Trofeus, Escritorio, Squeezes, Bowls Baldes e Potes, To Go / Viagem, Infantil, Cordoes e Costurados, In Mold Label, Projetos Especiais. "Datas Comemorativas" saiu da lista de categorias (segue como campanhas). Produtos mock remapeados aos slugs novos; ehEcologico passou a olhar green-plasticaria/green-fibras (mais material/nome). Links que apontavam para categoria=ecologicos foram para green-plasticaria.
2. Cards de produto sem tag (ECOLOGICO) e sem a categoria no topo, deixando so a imagem e o nome (referencia plusbrindes). Na home as cores tambem ficam ocultas (ja era assim); no catalogo as cores seguem. ProductCard nao usa mais tagsDoProduto/nomeCategoria.
3. Header fixo (sticky top-0) que encolhe um pouco no scroll em vez de sumir (pedido Fabio), com leve sombra ao rolar. Listener de scroll no Header (ja era client component).

Decisao tomada (faixa eco): mantida a faixa "Brindes Ecologicos" na home, agora reunindo as duas linhas Green (e demais itens eco por material/nome). O print do Plinio confirmou que a mudanca era nos cards, nao na faixa.

Verificacao: tsc --noEmit ok, next lint sem warnings, home 200, catalogo por green-fibras 200, produto remapeado 200, tag ECOLOGICO zerada nos cards. Falta validacao visual no browser antes do PR (em especial o comportamento do header no scroll e no mobile).

Onde paramos / proximo passo:
- 3 commits locais na branch (categorias, cards, header). PR e push aguardam aceite visual e autorizacao do Fabio.
- Pontos a confirmar com o Plinio/Fabio: (a) categoria removida tambem dos cards do catalogo, nao so da home; (b) categorias In Mold Label, Chaveiros, Casa e Decoracao, Medalhas e Trofeus e Projetos Especiais ficam sem produtos no mock ate vir o catalogo real; (c) os links "Linha Green"/eco apontam para Green Plasticaria, pois o catalogo filtra uma categoria por vez (nao ha filtro combinando as duas Green).

---

## 26/06/2026 14:43 BRT (sexta) -- Faixas da home: 6 no celular, 5 no PC

PR #23 mergeado e deployado no Pages (https://ctadigital12.github.io/bbbrindes/). Fabio apontou card orfao no celular (faixa com 5 vira 2+2+1). Branch feature/faixas-6-mobile-5-pc.

Feito nesta sessao:
- Faixas Lancamentos e Brindes Ecologicos passam a renderizar 6 cards: 6 no celular/tablet (grade par) e 5 no desktop (o 6o card recebe lg:hidden). ProductCard ganhou prop className para isso.
- Adicionado um 6o produto eco no mock (Ecobag de Algodao Cru, green-fibras) para a faixa eco ter 6 no celular.

Verificacao: tsc --noEmit ok, next lint sem warnings, home 200. Falta validacao visual no celular (modo responsivo) antes do PR.

Onde paramos / proximo passo:
- Commit local na branch. PR, merge e deploy aguardam o aceite visual no mobile.

---

## 30/06/2026 14:32 BRT (terca) -- Categorias agrupadas em Ecologicos; home finalizada

PR #24 mergeado e deployado. Branch feature/categorias-grupo-ecologicos.

Feito nesta sessao:
- Green Plasticaria, Green Fibras e Medalhas e Trofeus passam a ser a familia "Ecologicos": nome com prefixo "Ecologicos - ..." e agrupadas no topo da lista de categorias. ehEcologico passou a considerar tambem medalhas-trofeus.
- Com isso, o Plinio deu a home como finalizada.

Heads-up registrado (ainda NAO implementar): o Plinio tem consideracoes para a pagina do produto (PDP). Ele esta preparando os materiais dos produtos tagueados (imagens, identificacao) e vai trazer uma descricao direta e uma mais longa para apoiar SEO. Modelo de conteudo proposto por ele para a PDP:
  1. Nome do produto
  2. Subtitulo (frase que reforca o principal diferencial)
  3. Descricao curta
  4. Descricao completa
  5. Principais beneficios
  6. Ideal para
  7. Diferenciais BB brindes no produto
Aguardar o material do Plinio antes de mexer na PDP. Isso implica estender o tipo Produto (campos novos: subtitulo, descricaoCurta/descricaoCompleta, beneficios, idealPara, diferenciaisProduto) e o layout do ProdutoView.

Verificacao: tsc --noEmit ok, next lint sem warnings. Falta validacao visual da home (labels mais longos nas categorias) antes do PR.

Onde paramos / proximo passo:
- Commit local na branch (ajuste de categorias). PR, merge e deploy aguardam aceite visual.
- A pendir confirmacao: "Medalhas e Trofeus" entrou como linha ecologica (agrupada em Ecologicos) conforme a mensagem; confirmar se e isso mesmo.
- Proxima frente: PDP, quando chegar o material do Plinio.

---

## 08/07/2026 12:49 BRT (quarta) -- Sprint 2 documentada e board do Trello reconciliado

Branch chore/sprint-02-trello-sync.

Feito nesta sessao:
- Criado docs/sprints/sprint-02 (Wireframe v3, revisao Plinio, home finalizada) com README e 8 cards: S02-01 menu 3 colunas + datas, S02-02 faixas Lancamentos/Brindes Ecologicos, S02-03 cards sem tag/categoria, S02-04 header fixo no scroll, S02-05 responsividade das grades e busca mobile, S02-06 reestrutura de categorias (15 + grupo Ecologicos), S02-07 arquitetura de dados do catalogo (em andamento), S02-08 PDP novo modelo de conteudo (a fazer).
- trello-sync.mjs agora e idempotente: alem de criar card novo, move card existente para a lista que corresponde ao Status do .md. Adicionado modo --dry-run. O .md e a fonte da verdade.
- Board reconciliado com as credenciais do .env (que agora existem): 7 cards do Sprint 1 que estavam presos em "A Fazer" foram movidos para Concluido, e os 8 cards do Sprint 2 foram criados nas listas certas. Resultado: A Fazer = S01-14 (bloqueado) e S02-08; Em andamento = S02-07; Concluido = Sprint 0, Sprint 1 e S02-01..06.

Onde paramos / proximo passo:
- Mudancas do repo (cards do Sprint 2 e o sync idempotente) commitadas na branch chore/sprint-02-trello-sync. PR e push aguardam autorizacao.
- Proxima frente de codigo: backend (Payload/Supabase) para o painel de produtos e a PDP, quando chegar o material do Plinio e a definicao do ERP.

---

## 09/07/2026 13:48 BRT (quinta) -- Arquitetura de backend fechada e Sprint 3 planejada

Branch chore/sprint-02-trello-sync (segue acumulando os docs de planejamento desta fase).

Feito nesta sessao:
- docs/arquitetura-backend.md: decisoes fechadas com o Fabio. Postgres Supabase Pro na producao; imagens no Cloudflare R2 com otimizacao no upload via Payload/sharp (Cloudinary descartado; o cliente sobe qualquer imagem e o codigo gera a versao leve); hospedagem Cloudflare. Custo: ~US$ 0 em dev, ~US$ 25-30/mes em producao.
- docs/sprints/sprint-03: fundacao do backend. README + 8 cards (S03-01 scaffold Payload+Supabase+R2, S03-02 modelagem das colecoes, S03-03 auth e login, S03-04 front consumindo Payload, S03-05 migration do catalogo, S03-06 captura de leads, S03-07 SEO estrutural, S03-08 infra e deploy). Tudo que da para fazer sem depender de design, ERP, material do Plinio ou provedores de CRM/e-mail.
- Board do Trello: 8 cards do Sprint 3 criados em A Fazer via pnpm trello:sync.
- Comunicacao: enviado ao CS o panorama por etapa (itens de backend como "em andamento") e o aviso de custo.

Onde paramos / proximo passo:
- Comecar a implementacao pela S03-01 (scaffold do backend) e S03-02 (colecoes), que destravam o resto.
- Aguardando terceiros: identidade visual (design), definicao do ERP, material do catalogo do Plinio, provedores de CRM/e-mail.

---

## 10/07/2026 19:58 BRT (sexta) -- S03-01: scaffold do backend (Payload + Postgres + R2)

Os docs de planejamento acumulados (Sprint 2, arquitetura de backend, plano da
Sprint 3, modelo de importacao) foram mergeados na master pelo PR #26. Branch de
codigo feature/sprint-03-scaffold-backend criada a partir da master atualizada.

Feito nesta sessao (card S03-01):
- Pasta backend/ com Payload CMS 3.86 embutido em Next 15.4 (mesmo padrao do
  template blank oficial na tag v3.86.0). O create-payload-app exige TTY e nao roda
  neste ambiente; o scaffold foi montado a mao a partir dos arquivos exatos da tag.
- Versoes fixadas dentro do range de peers do @payloadcms/next@3.86.0: next 15.4.11
  (fica no major 15 do projeto, em vez do 16 que o template puxaria), react 19.2.6.
- Adapter Postgres via DATABASE_URI (alvo Supabase). Storage S3/R2 condicional: so
  ativa com S3_BUCKET no env; sem credenciais em dev, cai no disco local e o painel
  segue utilizavel.
- Colecao Media converte todo upload para WebP e gera tamanhos responsivos
  (thumbnail 300, card 640, large 1200) no upload via sharp, conforme a arquitetura.
- Colecoes base Users (auth) e Media. payload-types.ts gerado.
- backend/.env.example com Postgres, PAYLOAD_SECRET e R2, sem segredos reais
  (CLAUDE.md regra 14). Raiz: pnpm.onlyBuiltDependencies (sharp, esbuild) e script
  dev:backend.

Verificacao: pnpm install ok (45s, sharp e esbuild compilados), payload
generate:types ok (colecoes users e media reconhecidas, media com os 3 sizes),
typecheck tsc --noEmit verde. Commit 12407d6 na branch (sem push).

Pendente para fechar o S03-01 (depende do Fabio): criar um projeto Supabase free de
dev e me passar a connection string para o backend/.env local. So com ela o painel
/admin sobe e da para criar o primeiro usuario admin (ultimos 2 itens do checklist).
R2 tambem fica pendente de bucket/credenciais, mas nao bloqueia dev (disco local).

Onde paramos / proximo passo:
- Aguardando a connection string do Supabase dev para bootar /admin e validar.
- Em paralelo, seguir para o S03-02 (modelagem das colecoes: Produtos com os campos
  de PDP do Plinio, Categorias, Banners, Campanhas, Blog, Cases, Imprensa,
  Revendedores), que tambem nao depende de terceiros.
- PR do S03-01 so apos bootar o /admin (validacao), sem push ate autorizacao.

---

## 10/07/2026 20:25 BRT (sexta) -- S03-02: modelagem das colecoes

Mesma sessao, mesma branch feature/sprint-03-scaffold-backend. Transformado o mock
do front (data/*.ts) em colecoes reais do Payload.

Feito nesta sessao (card S03-02):
- Produtos: sku (chave unica, indexada; origem ERP, nao sobrescrita pelo import),
  nome, slug, e o modelo de PDP do Plinio (subtitulo, descricaoCurta,
  descricaoCompleta em richtext, beneficios, idealPara, diferenciaisProduto),
  categoria (relationship), material, aplicacoes, cores (array nome+hex), imagens
  (galeria -> media), videoUrl, faixaPreco (filtro publico, sem preco exato no B2B),
  destaques e tags. Grupo `erp` (preco, estoque) marcado como origem ERP, placeholder
  ate a integracao.
- Categorias: nome, slug, grupo (ecologicos|geral, agrupa no topo), ordem, icone.
  Cobre as 15 categorias validadas.
- Conteudo: Banners (carrossel principal e mini banner unificados pelo campo
  posicao, evitando duas colecoes), Campanhas (LP sazonal com produtos em destaque),
  Posts (blog), Cases (com depoimento), Imprensa (materias veiculo/data/link).
- Revendedores: empresa, responsavel, CNPJ, telefone, email, endereco de entrega e
  notas. So o modelo de dados; a auth vira na S03-03. PII sem leitura publica (LGPD).
- Helper slugField/slugify sem dependencia externa (remove acento, kebab-case),
  reaproveitado nas colecoes com slug.
- Colecoes publicas com read aberto; agrupadas no admin (Catalogo, Conteudo, Revenda,
  Sistema). payload-types.ts regenerado com as 10 colecoes.

Decisoes: (1) Banners e Mini banners numa colecao so com campo posicao, em vez de
duas quase iguais (lente MVP, menos manutencao). (2) faixaPreco fica publica para
filtro no catalogo, mas o preco exato vive no grupo erp e nao e exibido no B2B, so na
area do revendedor. (3) SEO por pagina (meta) fica para a S03-07; aqui ja existem
slug e descricoes que alimentam isso.

Verificacao: payload generate:types e typecheck (tsc --noEmit) verdes; slugify
testado com acentos ("Caneca Termica" e "Ecologicos Green"). Commit 0dacaf3 na branch
(sem push). Boot do /admin segue pendente da connection string do Supabase dev.

Onde paramos / proximo passo:
- Ainda aguardando a connection string do Supabase dev para bootar o /admin, criar o
  primeiro admin e ver as colecoes no painel (fecha S03-01 e valida S03-02 de ponta a
  ponta).
- Proximos cards possiveis sem terceiros: S03-03 (auth e login, torna Revendedores
  colecao auth) e S03-04 (front consumindo o Payload em vez do mock). S03-06 (captura
  de leads) tambem independe de provedores para a persistencia.
- PR da Sprint 3 e push seguem pendentes de autorizacao e do boot/validacao do painel.

---

## 14/07/2026 18:10 BRT (terca) -- MARCO: reuniao Julien x Plinio (integracao e modelo de produto validados)

Reuniao apresentou ao Plinio o status do site e do banco. Cliente validou a estrutura
de dados de produtos e fechou a arquitetura de integracao. Cruzei a ata com o que ja
esta implementado (S03-01/S03-02 na branch feature/sprint-03-scaffold-backend, sem
push) para ver o que casa e as controversias.

Decisoes fechadas na reuniao:
- Integracao: Site -> CRM (Leads2b) -> ERP. O site e o painel de revenda conversam SO
  com o CRM; o CRM se alimenta do ERP. Sem integracao direta site-ERP.
- Estrutura de produto validada, com campos novos: dois codigos (codigo do site tipo
  "MV 01" + codigo Cigan integrador, chave do CRM/ERP), headline (chamada), palavra
  chave e meta description (SEO), argumento comercial (interno, treino do agente), 3
  categorias por produto (multipla), tag ecologico sim/nao. Codigos sendo unificados
  pelo Plinio (por isso a planilha atrasa).
- UTM + GA do site vao alimentar o lead scoring no CRM.
- Cronograma: wireframe ~95%, design aguardando, descricoes SEO pendentes.

Batimento com o nosso schema (Produtos.ts): casam nome, subtitulo, as duas descricoes
SEO, beneficios, diferenciais, cores, imagens, video. Mudam: sku unico vira dois
codigos; categoria unica vira multipla; tag ecologico vira boolean; SEO de produto sai
do S03-07 e entra no produto; grupo `erp` reenquadrado para CRM. Faltam headline,
palavra chave, meta description e argumento comercial.

Decisoes do Fabio nesta sessao:
- NAO mexer no schema do Payload agora. Esperar a planilha final do Plinio (com os
  codigos unificados) para evitar retrabalho. So atualizar os docs de arquitetura.
- Categorias: quando executar, modelar como relacao multipla com a primeira como
  principal (URL, breadcrumb, filtro).

Feito nesta sessao (so documentacao, sem tocar em codigo do app):
- docs/arquitetura-backend.md: corrigido o fluxo de integracao (era "ERP casa por
  SKU"; agora Site -> CRM -> ERP) e adicionada a secao "Integracao Site x CRM x ERP".
- docs/modelo-produto.md (novo): modelo de produto validado, delta vs o schema atual
  do Payload e vs o template de importacao (modelo-produtos.csv), decisoes e
  pendencias. Especificacao para executar quando a planilha fechar.

Onde paramos / proximo passo:
- Bloqueado para revisar o schema: aguardando a planilha final do Plinio e a
  confirmacao com o Julien de que ela atende o banco.
- Bloqueado para integracao real: aguardando URL/credencial/doc da API Leads2b (painel
  de revenda e envio de leads) e a pauta com o Leonardo para a ponte CRM-ERP.
- Sem depender de terceiros, ainda da para avancar em: S03-03 (auth/login), S03-04
  (front consumindo o Payload), S03-06 (persistencia de leads) e a captura UTM+GA.
- Segue pendente a connection string do Supabase dev para bootar o /admin.

---

## 15/07/2026 13:59 BRT (quarta) -- nova realidade incorporada ao plano da Sprint 3

Assumido, ate ter retorno, que "Cigan" e o ERP (decisao do Fabio; nome mantido nas
docs). Incorporada a nova realidade da reuniao ao plano central e aos cards.

Feito nesta sessao (so documentacao):
- README da Sprint 3: secao "Atualizacao 15/07" com a arquitetura de integracao (Site
  -> CRM Leads2b -> ERP/Cigan) e o modelo de produto validado (schema congelado ate a
  planilha). Lista "o que fica de fora" ajustada (planilha do Plinio; API Leads2b;
  e-mail; design). Tres cards novos adicionados a lista.
- Cards existentes atualizados: S03-02 (em andamento, congelado ate a planilha, com o
  delta), S03-03 (preco/estoque vem do CRM, nao do ERP; Revendedores vira colecao
  auth), S03-04 (sequenciar: conteudo primeiro, Produtos/PDP so apos o schema fechar),
  S03-05 (upsert por codigo Cigan; reconciliar template com a planilha), S03-06 (CRM
  destino e o Leads2b; adapter real no S03-09; lead carrega UTM), S03-07 (SEO de
  produto vive no produto; este card faz o estrutural).
- Cards novos: S03-09 (integracao Leads2b, P0 bloqueado ate a API: revenda e envio de
  leads), S03-10 (UTM + GA para lead scoring, P1), S03-11 (simular os campos novos na
  PDP do wireframe, P1, acao da ata @Fabio).

Onde paramos / proximo passo:
- Trello: os 3 cards novos e as mudancas de status (S03-02 em andamento) sincronizam
  com `pnpm trello:sync` quando o Fabio autorizar (toca o board externo).
- Frentes sem terceiros: S03-03 (auth/login), S03-04 so nas colecoes de conteudo,
  S03-06 (captura de leads com adapter stub), S03-10 (captura de UTM). Produto e PDP
  seguem congelados ate a planilha; integracao real congelada ate a API Leads2b.
- Segue pendente a connection string do Supabase dev para bootar o /admin.

Trello sincronizado na mesma sessao: S03-02 movido para Em andamento; S03-09, S03-10 e
S03-11 criados em A Fazer com checklist; 41 cards inalterados.

---

## 16/07/2026 14:55 BRT (quinta) -- MARCO: planilha real de produtos recebida e analisada

O Fabio trouxe a planilha do cliente ("Planilha de produtos e suas especificacoes
_06.2026", aba Especificacoes) junto com print e transcricao da gravacao do Plinio.
Analisada linha a linha e cruzada com a ata de 14/07 e com o schema ja implementado.
Confirma que valeu congelar o S03-02: a planilha tem 26 colunas que a ata nao citou.

A planilha: ~190 produtos, 50 colunas em quatro blocos (7 flags de canal, 17 de
conteudo/classificacao, 13 selos, 8 de logistica, 5 de impressao).

Achados principais (spec completa reescrita em docs/modelo-produto.md):
- CORRECAO: os dois codigos estavam invertidos na ata. `Codigo site` = 109 (comercial)
  e `Codigo CIGAM` = MV01109 (integrador). "MV 01" e prefixo do CIGAM, nao do codigo do
  site. O Plinio confirma na gravacao. O CIGAM embute o codigo do site (MV01+109
  tradicional, MV02+109G Green, MV10+2003 IML).
- BLOQUEIO NOVO: site e ERP nao tem a mesma granularidade. O CIGAM descarta o sufixo de
  variacao do codigo do site: `233 CL` e `233 PB` sao dois produtos no site com o mesmo
  CIGAM `MV01233`. Como o CIGAM e a chave de preco/estoque do CRM, nao da para marcar
  como unique ate decidir se e variacao de um produto ou dois produtos no mesmo item do
  ERP.
- FALTAM na planilha, e nao foram citados na ata: imagens (nenhuma coluna), cores e
  variacoes (nenhuma coluna) e video. Sao os bloqueios mais serios.
- Isso reconcilia os 1200 SKUs: ~190 produtos x cores da a ordem de 1200. Produto nao e
  SKU, e o import teria que gerar as variacoes.
- BLOCOS NOVOS: 13 selos por produto (livre de BPA, 100% reciclado, logistica reversa,
  fibra natural etc.), 8 campos de logistica (NCM, peso, caixa master) e 5 de impressao
  (metodos e areas). Mudam a PDP e o filtro do catalogo.
- A planilha e mestre de varios canais (SITE, BRINDICE, FREESHOP, brindes.com,
  CATALOGO, TABELA REVENDA, TABELA B2B), nao so do nosso site. As flags viram
  visibilidade do produto. A coluna SITE nao e boolean limpo: mistura `ok`,
  `ok (370 ml)`, `S/COD` e `COD. 280`.
- Categoria 1 mistura linha e funcao: nos Green/IML a categoria 1 e a LINHA e a funcao
  cai para a 2 (Squeeze Green Fibras = Green Fibras / Squeezes / Infantil). Confirma a
  necessidade das 3 categorias.
- RESOLVIDO de graca: "Medalhas e Trofeus" NAO e linha ecologica (pendencia aberta
  desde 30/06). O `ecologico=sim` so aparece nas linhas Green. O agrupamento do
  wireframe e a regra `ehEcologico` do front estao errados e devem ser desfeitos.
- Divergencia de volume entre nome e nota: 135 "Copo Roma Cristal 400mL" marcado como
  370 ml; 406 "Super Bowl 500mL" como 475 ml. Afeta titulo e SEO.

Feito nesta sessao (so documentacao, sem tocar em codigo do app):
- docs/modelo-produto.md reescrito como spec completa (14 secoes), com a estrutura real
  da planilha, os bloqueios, o delta vs o schema e vs o template de importacao.
- Cards atualizados: S03-02 (segue congelado, agora por granularidade/imagens/cores, e
  ganhou selos/logistica/impressao/flags de canal), S03-05 (template superado, chave de
  upsert nao resolvida, regras de parsing), S03-11 (os 3 blocos novos mudam o escopo da
  simulacao da PDP).
- Texto de retorno tecnico preparado para o Fabio postar no Slack.

Onde paramos / proximo passo:
- Schema e migration seguem BLOQUEADOS: granularidade CL/PB, imagens, cores, confirmar
  produto x cor e se a planilha 06.2026 e completa ou recorte.
- Sem depender de terceiros, da para avancar em: S03-03 (auth/login), S03-04 nas
  colecoes de conteudo (banners, categorias, campanhas, blog, cases, imprensa), S03-06
  (captura de leads com adapter stub) e S03-10 (captura de UTM).
- Segue pendente a connection string do Supabase dev para bootar o /admin (fecha o
  S03-01 e valida o S03-02 de ponta a ponta).
- Nada pushado. Branch feature/sprint-03-scaffold-backend acumula scaffold + colecoes +
  docs.

## 17/07/2026 12:44 BRT (sexta) -- DECISAO DO BANCO DE DEV ADIADA PARA 20/07 (segunda)

Sessao curta, de verificacao. Nenhuma linha de codigo do app tocada.

Verificado no repo (nao de memoria) se o projeto Supabase de dev ja existia. NAO EXISTE,
e nunca foi criado. Evidencias:
- backend/.env nao existe; so o .env.example, com a URI ficticia db.xxxxxxxx.supabase.co.
- O .env da raiz (o do Trello) declara DATABASE_URI mas o valor esta vazio.
- REGISTRO.md registra "pendente a connection string do Supabase dev" em cinco entradas.
- S03-01 e S03-08 tem o item "projeto Supabase de dev (free) provisionado" desmarcado.
O que esta documentado e a DECISAO de usar Supabase (docs/arquitetura-backend.md: free em
dev, Pro US$ 25/mes na producao), nao a execucao dela.

Ambiente: Docker instalado (29.5.2) mas com o daemon parado. Nenhum psql local.

DECISAO EM ABERTO, o Fabio retoma na segunda 20/07/2026 (hoje ele esta em outro projeto
atrasado). As tres opcoes na mesa, na ordem em que recomendo:
1. Criar o projeto Supabase free de dev e me passar a connection string (Project Settings
   > Database > Connection string, modo URI). Mesmo esforco do Docker e, alem de validar
   o schema, FECHA o S03-01. Eu monto o backend/.env local (gitignored), boto o /admin de
   pe e valido as 10 colecoes do S03-02 de ponta a ponta.
2. Subir o Docker Desktop e eu rodo um Postgres 16 em container. Valida o schema do
   S03-02, mas o S03-01 continua aberto e o boot teria que ser refeito no Supabase.
3. Seguir sem banco no S03-10 (captura de UTM). Front puro, testavel no browser, mas
   S03-01 e S03-02 seguem sem validacao.

Onde paramos / proximo passo:
- Retomar a decisao acima na segunda 20/07/2026. Tudo o mais do backend depende dela.
- Schema e migration seguem BLOQUEADOS por terceiros: granularidade CL/PB, imagens,
  cores (ver docs/modelo-produto.md). Integracao S03-09 sem a API do Leads2b. Design
  S01-14 sem o brandbook.
- Nada pushado. Branch feature/sprint-03-scaffold-backend acumula scaffold + colecoes +
  docs.

## 21/07/2026 19:24 BRT (terca) -- S03-11: PDP-modelo simulada no wireframe (Squeeze 300 mL, Versao A)

Frente de aparencia, front puro, sem depender do banco. O Fabio trouxe o doc de conteudo
da pagina de produto (renomeado para docs/pdp-modelo-squeeze.md) e, na sequencia, o
fluxograma de estrutura da PDP. Escolhida a Versao A (honesta), coerente com o doc e com
desfazer o "Medalhas = ecologico".

Feito:
- types.ts: tipo ProdutoDetalhe opcional no Produto (so o produto-modelo preenche no
  wireframe; na producao vira schema do Payload).
- produtos.ts: novo produto squeeze-300ml-personalizado com o conteudo da Versao A.
- ProdutoDetalheView.tsx (novo): blocos abertura, Especificacoes, Beneficios, Ideal para,
  Descricao completa com "ver mais", Diferenciais, Selos, FAQ e box de pendencias.
- ProdutoView.tsx: linha curta sob o H1.
- produto/[slug]/page.tsx: pluga o bloco e liga title tag/meta description da Versao A.
- Os 3 itens [PLINIO] (material PEAD+PEBD vs PP, MOQ 500 vs 100, prazo) marcados
  "a confirmar" no FAQ e no box de pendencias.

Typecheck e lint verdes. Fabio validou no browser (regra 27 satisfeita) e autorizou o
push. Nada mergeado na master ainda (segue o fluxo branch > PR > merge).

Pendencia aberta do cliente (reuniao 21/07, Julien e Plinio): o CODIGO DO SITE tem que
aparecer na PDP e o codigo CIGAM (integrador do CRM) fica escondido. O build atual NAO
mostra o codigo do site ainda; falta o campo codigoSite visivel e o valor do Squeeze.
Proximo passo dessa frente.

Onde paramos / proximo passo:
- Adicionar codigoSite visivel na PDP (CIGAM escondido) quando o Fabio passar o codigo.
- Decisao do banco de dev (Supabase free vs Postgres local vs seguir sem banco) segue
  em aberto, e trava todo o resto do backend (S03-01, S03-02, schema do S03-11).

## 21/07/2026 21:31 BRT (terca) -- Taxonomia de navegacao, datas comemorativas e LPs (so docs)

Sessao de registro, sem tocar em codigo do app. O Fabio trouxe da reuniao (Plinio,
Julien) o modelo de LP (/brindes-de-natal), a planilha de datas comemorativas (GERAL
B2B do MKT) e decisoes de navegacao. Antes disso, nesta mesma sessao, a PDP-modelo
(S03-11) foi mergeada via PR #27 e publicada no Pages.

Pergunta central da reuniao (slug muda ao filtrar?) respondida com base no codigo: NAO.
O filtro do catalogo e estado client e nao altera a URL. Quem tem slug e a LP de
campanha (/campanha/[slug], ja existe). Os dois mecanismos sao diferentes.

Decisoes registradas em docs/taxonomia-navegacao-seo.md (novo):
1. Tres conceitos separados: categoria (tipo de produto) x tag/ocasiao (data, feira,
   aniversario) x LP de campanha (pagina com slug para ranquear).
2. Filtro por tag NAO gera slug indexavel (evita facetas rasas; noindex). Ocasiao vira
   query param no maximo.
3. LP de campanha com slug keyword-rich no topo (/brindes-de-natal, nao /campanha/natal).
   Subconjunto curado: Natal (estrela), eventos, kits-corporativos, dia-das-maes,
   dia-dos-pais, dia-do-cliente.
4. Feiras corporativas e aniversario de empresa sao tag/ocasiao, nao categoria
   (recomendacao minha, contra a fala da ata; pendente de aceite do Plinio).
5. Tabela das 21 datas comemorativas com a data de "soltar campanha" (~2 meses antes).

Tambem atualizado docs/modelo-produto.md (secoes 5, 6, 11): modelo de imagem (imagem 1
muda com a cor, imagem 2 ambientada) e SKU por cor (codigo base + variacao de tom), que
o Plinio vai subir depois no banco. O modelo ficou definido; o dado (arquivos, coluna de
cor) segue faltando.

Cards atualizados: S03-07 (SEO: LPs no sitemap, filtro sem slug), S03-05 (SKU por cor e
casamento de imagem por cor), S03-11 (Versao A no ar; pendente codigo do site na PDP e
galeria imagem-por-cor).

Onde paramos / proximo passo:
- Branch docs/taxonomia-catalogo-e-datas com estes docs, aguardando push/PR (nao pushado).
- Front-puro fazivel sem banco: exibir o codigo do site na PDP (falta o valor do Squeeze),
  renomear slugs de campanha para keyword-rich e plugar o layout de LP (com validacao no
  browser). Nada disso feito ainda.
- Schema (S03-02) segue congelado ate a decisao do banco de dev, que continua em aberto.
