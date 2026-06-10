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
