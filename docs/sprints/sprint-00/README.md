# Sprint 0 -- Wireframe navegavel para aprovacao

Periodo: 10/06/2026 (quarta) a 15/06/2026 (segunda, apresentacao ao cliente).
Responsavel: Fabio.

## Objetivo

Entregar um wireframe navegavel no browser, construido ja no stack real (Next.js), com dados mockados e visual neutro, espelhando a estrutura do site atual (bbbrindes.com.br). Serve para o cliente aprovar estrutura e fluxo antes de investirmos em visual final e integracoes. Nao e descartavel: vira a base dos 30 dias seguintes.

## Criterio de pronto

O cliente consegue, no browser, clicar pelos fluxos:
1. B2B: navegar pelo catalogo, aplicar filtros e busca, abrir um produto, escolher cor, adicionar ao orcamento, preencher o formulario e ver a tela de confirmacao com botao de WhatsApp.
2. Revendedor: entrar na tela de login e ver o painel com tabela de precos, estoque, fechamento de pedido, historico, uploads e notas.
3. Institucional: Quem Somos, SAC, Contato, Revendedores, Catalogos, Blog.

Sem lint/typecheck/build quebrados (CLAUDE.md regra 20).

## Cards

Prioridade P0 = essencial para a apresentacao. P1 = desejavel.

- [S00-01](S00-01-setup-monorepo.md) (P0) Setup do monorepo
- [S00-02](S00-02-scaffold-front.md) (P0) Scaffold do front e layout base
- [S00-03](S00-03-mock-data.md) (P0) Mock data
- [S00-04](S00-04-home.md) (P0) Home
- [S00-05](S00-05-catalogo.md) (P0) Catalogo com filtros e busca
- [S00-06](S00-06-pdp.md) (P0) Pagina de produto (PDP)
- [S00-07](S00-07-carrinho-orcamento.md) (P0) Carrinho de orcamento e formulario
- [S00-08](S00-08-confirmacao.md) (P0) Tela de confirmacao
- [S00-09](S00-09-area-revendedor.md) (P0) Area do revendedor (login e painel)
- [S00-10](S00-10-institucionais.md) (P1) Paginas institucionais
- [S00-11](S00-11-integracao-telas.md) (P0) Integracao das telas e validacao local

## Observacao de escopo

Tudo nesta sprint e mock/UI. Persistencia, auth real, SEO tecnico e integracoes (Leads2b, CRM, e-mail) entram a partir da Sprint 1.
