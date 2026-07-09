# S03-04 Frontend consumindo o Payload

Status: a fazer
Frente: fullstack
Prioridade: P0
Atualizado: 09/07/2026 BRT

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
