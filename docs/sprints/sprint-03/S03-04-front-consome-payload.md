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
- [ ] Home lendo banners, categorias, campanhas, faixas do Payload
- [ ] Catalogo e filtros lendo produtos e categorias do Payload
- [ ] PDP lendo o produto (com os campos novos) do Payload
- [ ] Institucionais (blog, cases, imprensa) lendo do Payload
- [ ] ISR com revalidacao on-demand via hook do Payload
- [ ] Remocao gradual dos data/*.ts mock

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
