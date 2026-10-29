# Handoff admin -> front (canal de coordenacao FB-6)

Canal vivo entre o chat do **admin/backend** (deixa campos editaveis no Payload) e
o chat do **front** (consome no site). O admin anexa cada campo novo aqui; o front
le daqui o que ja pode consumir.

**Regra de ouro:** padrao "a fonte muda, a tela nao". Ler o Payload no build via
`lib/content.ts` com **fallback no mock** (o build nao pode quebrar se o Payload
vier vazio). O front **nao mexe** em `backend/src/collections`, `payload.config`
nem `globals` (sao do chat do admin), pra nao colidir. O auto-rebuild ja esta no
ar: edicao no admin reflete no proximo build.

## Pronto pra consumir AGORA

### 1. Qtd minima por produto (item 3) — PR #74
- Campo novo `produto.quantidadeMinima` (number; pode vir `null` em produtos antigos).
- Trocar o `MIN_QTD = 500` fixo em `ProdutoView.tsx` (a constante e o label "minimo 500 unidades") por **`produto.quantidadeMinima ?? 500`**.
- Adicionar `quantidadeMinima` ao tipo do produto (`lib/types.ts`) e ao mapeamento em `lib/content.ts` / `lib/payload`.

### 2. Icone de categoria (Fase 3.4)
- O campo `icone` (upload) **ja existe** na collection Categorias.
- Hoje o front usa `CAT_ICON` estatico. Passar a usar `categoria.icone` quando preenchido, com **fallback no CAT_ICON** (categoria sem icone nao quebra).

### 3. Campanhas reais (Fase 4 / overlap FB-4)
- A collection Campanhas **ja existe** (nome/slug/mes/chamada/imagem/conteudo richText/produtos rel).
- `campanha/[slug]` hoje usa mock. Migrar pra ler a collection (generateStaticParams + conteudo/imagem/produtos da collection), com fallback no mock.

## Alinhar ANTES de mexer

### 4. Hero -> Banners (Fase 3.1/3.2)
- A collection Banners existe mas esta orfa. O hero atual e rotacao mensal de 12 banners; a collection talvez precise de campos extras. **Nao remover o hero hardcoded ate o modelo ser fechado com o chat do admin.**

## Vem ai (NAO comecar, o admin manda o schema)

### 5. Fase 5 — blocos de marketing da home como CMS
- O admin vai modelar um global "Conteudo da home" (grupos: trust, diferenciais, FAQ, depoimentos, urgencia, eco, CTA) + collection de logos. Quando pronto, a shape exata dos campos entra aqui. **Segurar o refactor do `home-joy` desses blocos ate o admin postar o schema.**

### 6. Tags de conteudo (item 6)
- O admin vai criar uma collection `Tags` + campo `tags` (relationship hasMany) em Posts/Cases/Imprensa, pra distribuir/relacionar conteudo entre blog, cases e imprensa. Shape exata entra aqui quando pronto.

---

## Changelog (o admin anexa aqui a cada entrega)
- 29/10: criado o canal. Prontos pra front: item 3 (qtd minima, PR #74), icone de categoria (3.4), campanhas (Fase 4). Fase 5 e tags (item 6) em construcao.
