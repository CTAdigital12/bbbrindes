# bbbrindes

Plataforma B2B de brindes corporativos: catalogo de produtos com variacoes, carrinho de orcamento (sem pagamento online), area de revendedor com login, integracao com CRM (Leads2b) e foco em SEO.

Escopo completo em [PERGUNTAS ECOMMERCE.md](PERGUNTAS%20ECOMMERCE.md). Regras de engenharia e governanca em [CLAUDE.md](CLAUDE.md).

## Stack

- Monorepo com pnpm workspaces.
- `frontend/`: Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- `backend/`: Payload CMS 3 (Node/TypeScript) -- a partir da Sprint 1.

## Estrutura

```
frontend/        Next.js (site publico, catalogo, orcamento, area do revendedor)
backend/         Payload CMS (admin, API, conteudo) -- Sprint 1 em diante
docs/sprints/    Planejamento e cards de cada sprint (markdown)
docs/REGISTRO.md Log de tempo: o que foi feito e onde paramos
```

## Como rodar (Sprint 0 -- wireframe)

Pre-requisitos: Node 20+ e pnpm 9+.

```bash
pnpm install
pnpm dev
```

O site sobe em http://localhost:3000. Nesta fase os dados sao mockados; o backend ainda nao e necessario.

Se o pnpm nao estiver instalado global, use o corepack (vem com o Node):

```bash
corepack pnpm@9.12.0 install
corepack pnpm@9.12.0 --filter frontend dev
```

Para habilitar o pnpm global de vez (Windows, requer admin): `corepack enable`.

## Deploy (Vercel)

O preview do cliente roda na Vercel (repo privado, URL gratuita `*.vercel.app`).
Configuracao do projeto na Vercel:

1. Importar o repositorio CTAdigital12/bbbrindes (autorizar o app da Vercel no GitHub).
2. Root Directory: `frontend`.
3. Framework: Next.js (deteccao automatica). Gerenciador: pnpm (pelo packageManager).
4. Production Branch: `master`.

Nao e preciso dominio pago: cada deploy ganha uma URL `*.vercel.app`. O export
estatico do Next fica desligado por padrao (build nativo, pronto para SSR). Para
gerar export estatico, usar `STATIC_EXPORT=true` (e `PAGES_BASE_PATH` se sob subpath).

## Estado atual

Sprint 0 (wireframe navegavel para aprovacao do cliente). Acompanhe em [docs/sprints/sprint-00/README.md](docs/sprints/sprint-00/README.md) e [docs/REGISTRO.md](docs/REGISTRO.md).
