# S03-04 Frontend consumindo o Payload

Status: a fazer
Frente: fullstack
Prioridade: P0
Atualizado: 15/07/2026 BRT

## Descricao
Trocar os dados mock (data/*.ts) por leitura das colecoes do Payload, pagina por
pagina, com renderizacao ISR (estatico cacheado, revalida quando o cliente edita no
painel). Mantem a UI atual do wireframe.

## Checklist
- [x] Home lendo banners, categorias, campanhas do Payload (produtos segue mock)
- [ ] Catalogo e filtros lendo produtos e categorias do Payload (espera schema de produto)
- [ ] PDP lendo o produto (com os campos novos) do Payload (espera schema de produto)
- [x] Institucionais (blog, cases, imprensa) lendo do Payload
- [ ] ISR com revalidacao on-demand via hook do Payload (adiado para o S03-08 / hosting)
- [~] Remocao gradual dos data/*.ts mock (mock virou fallback; remove quando nao houver risco)

## Atualizacao 27/08/2026 (fatia de conteudo entregue)
Branch feature/sprint-03-04-front-conteudo. Ver docs/REGISTRO.md (27/08/2026) para o detalhe.
1. Render decidido: MANTER output: export (SSG, le do Payload no build). ISR/revalidacao
   on-demand fica para o S03-08 (migracao de hosting Cloudflare).
2. Camada frontend/src/lib/payload.ts + content.ts com fallback pro mock (se a API falha
   ou vem vazia). UI inalterada.
3. Ligados: blog (lista + detalhe), cases, imprensa e home. Seed reproduzivel do post de
   teste em backend/src/seed/post-teste.ts (script `seed:post-teste`).
4. Adiado (nao regressao): produtos/catalogo/PDP (schema do Plinio), categorias no header
   e no catalogo (nav/produto), pagina institucional de Revendedores (estatica, sem
   colecao), sitemap (ainda mock). Validado no navegador (regra 27).

## Observacoes
Feito de forma incremental para nao quebrar o site publicado. A UI nao muda; muda a
fonte dos dados.

## Atualizacao 15/07/2026
Sequenciar por dependencia: as colecoes de conteudo (banners, categorias, campanhas,
blog, cases, imprensa) tem schema estavel e podem ser ligadas ja. A fiacao de Produtos
e da PDP espera o schema de produto fechar (planilha do Plinio, ver S03-02 e
docs/modelo-produto.md), porque os campos novos (dois codigos, headline, SEO,
categorias multiplas) mudam a leitura. Comecar pelo conteudo evita retrabalho.

## Atualizacao 23/07/2026 (paginas do revendedor)
Os golden paths (docs/golden-paths.md) detalham duas telas do revendedor:
1. Pagina institucional de Revendedores (proposta + botao "Quero ser revendedor"):
   conteudo do Payload, buildable agora.
2. Shell do portal do revendedor: navegacao igual a do cliente final + painel de estoque
   por cor + botao "FAZER PEDIDO". O shell da para montar; preco/estoque/NF/rastreamento
   vem do CRM/ERP (ver S03-12), placeholder ate a integracao.
