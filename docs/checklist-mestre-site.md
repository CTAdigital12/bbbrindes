# Checklist mestre do site BB Brindes (tracker)

Consolidação dos 22 itens da reunião (lista do Fábio dev) num só lugar, com o
status REAL verificado no código em 29/10 (branch `feature/fb6-admin-editavel`,
incluindo o trabalho de design ainda não commitado: ExitPopup, LinhaDoTempo,
HistMini). Este é o acompanhamento técnico; o gerencial fica no eKyte, projeto
"bbbrindes (Desenvolvimento)", uma tarefa por front (links no fim).

Legenda: ✅ feito · 🟡 parcial · ⬜ pendente.

Placar: **4 feitos · 7 parciais · 11 pendentes** (22 itens).

Go-live alvo: 02/11. Regra do repo: o que mexe no front vira PR (Fábio mergeia);
schema de backend vai por deploy (`railway up` manual no workspace do cliente, da
master). Edição no admin reflete no site sozinha (auto-rebuild, FB6 já no ar).

---

## Front 1 — Admin editável + upload (FB-6)

Tracker detalhado por subtarefa: [fb6-admin-editavel-plano.md](fb6-admin-editavel-plano.md).

| # | Item | Status | Onde está / próximo passo |
|---|------|--------|---------------------------|
| 1 | Admin 100% editável (produtos, banners, rodapé, blog, categorias) | 🟡 | Rodapé/contato (global), blog, cases, imprensa e produtos já editáveis e lidos pelo site. FALTA: hero/banners (collection `Banners` órfã, hero hardcoded em page.tsx) → FB6-3.1/3.2; ícone de categoria vem de `CAT_ICON` estático, não do campo `icone` → FB6-3.4; blocos de marketing/institucional ainda hardcoded → FB6 Fases 5/6 |
| 2 | Travas de upload (tamanho, peso, formato, dimensão, px no campo) | ⬜ | FB6 Fase 2. Formato `image/*` já existe na Media; falta `upload.limits.fileSize` + collection separada pra PDF (a Media converte tudo pra webp) + limite de dimensão + mensagens com px. Bloqueio: valor do tamanho (Fábio aguardava retorno das imagens) |
| 3 | Quantidade mínima puxada do cadastro, não fixa | ⬜ | Hoje é fixo: `MIN_QTD = 500` (ProdutoView.tsx:21) e label "mínimo 500 unidades" (:255). Falta campo na collection `Produtos` + front ler dele |
| 6 | Tags no admin (métodos de impressão) e tags pra distribuir conteúdo entre blog/cases/imprensa | ⬜ | Impressão hoje é texto livre (`impressao.metodos`, Produtos.ts:225), não tag. Blog/cases/imprensa sem campo de tag/categoria. Falta modelar as tags |

## Front 2 — Catálogo e produto (PDP)

| # | Item | Status | Onde está / próximo passo |
|---|------|--------|---------------------------|
| 4 | Um cadastro por código com todas as variações de cor | ✅ | Array `cores` (nome/hex/imagem) num só produto (Produtos.ts:166-179); front lê e mostra botões de cor (ProdutoView.tsx:219) |
| 5 | Tag de lançamento + selo laranja "novo" + seção de lançamentos | ✅ | Campo `destaques: lancamento` (Produtos.ts:264); selo `chip chip-orange "Novo"` (ProdutoView.tsx:179, ProductCardJoy.tsx:102); seção "Lançamentos" na home (page.tsx:205) |
| 14 | Botão de vídeo com ícone de câmera ao lado da qtd mínima | 🟡 | Botão de vídeo existe (`videoUrl`, Produtos.ts:196; "Ver vídeo do produto" ProdutoView.tsx:201). AJUSTES: ícone é `brand-youtube` (não câmera) e fica no topo, não ao lado da qtd mínima (bloco de quantidade em :253) |
| 17 | Ordem das fotos: conceitual, medidas, cores (por botão) | 🟡 | Galeria segue a ordem do array `imagens` (convenção de cadastro, "a primeira é a principal", Produtos.ts:187); cores são botões separados, sincronizam só quando nº imagens == nº cores (ProdutoView.tsx:37). A sequência não é imposta nem rotulada no código |

## Front 3 — Campanhas (FB-4)

| # | Item | Status | Onde está / próximo passo |
|---|------|--------|---------------------------|
| 7 | 12 campanhas padrão com rotação automática por mês | ⬜ | Hoje a rotação é hardcoded (`nextCamps()`/`orderedHeroSlides()` em home-joy.ts) e `campanha/[slug]` usa mock, ignora a collection `Campanhas`. Falta ler da collection + rotação data-driven por mês. FB6 Fase 4 / FB-4 |

## Front 4 — Conteúdo e institucional

| # | Item | Status | Onde está / próximo passo |
|---|------|--------|---------------------------|
| 12 | Destacar certificações internacionais (SMETA 4 pilares) | 🟡 | Selos (inclui SMETA) já saem do global no rodapé. Falta o "destaque" visual pedido (seção/bloco com peso), não só a lista do rodapé |
| 13 | Replicar a linha do tempo no catálogo, Quem Somos e descrições | 🟡 | `LinhaDoTempo` em Quem Somos (quem-somos/page.tsx:106) e teaser `HistMini` na PDP (produto/[slug]/page.tsx:103). FALTA: no catálogo |
| 20 | Seção de imprensa (clipping) integrada ao blog e aos cases | ✅ | /imprensa lê a collection; home mostra Cases + Na imprensa + Do blog com conteúdo real (FB6-3.3). Obs: o "tagueamento cruzado" entre os três é o item 6 (pendente) |

## Front 5 — Conversão: popups e WhatsApp (FB-5)

| # | Item | Status | Onde está / próximo passo |
|---|------|--------|---------------------------|
| 8 | Botão de WhatsApp que se estende com gatilho de urgência ("orçamento em até 2h") | 🟡 | Botão flutuante existe (`.wa-f`, Footer.tsx:102) e sobe no scroll com anel pulsante (design-system.css:341). FALTA: "estender" com texto e a copy de urgência "orçamento em até 2h" |
| 9 | Popups: opt-in de saída (LGPD), quem navegou e não cotou (closer), abandono de carrinho (WhatsApp); caminhos tagueados por interesse | 🟡 | `ExitPopup.tsx` (montado no layout) cobre opt-in de saída com LGPD quando vazio (:146) e abandono de orçamento → itens pro WhatsApp quando há itens (:68, :116). FALTA: caminho separado "navegou e não cotou → closer" e o tagueamento por nível de interesse (liga no front 6, UTM/lead scoring) |
| 16 | Botão de WhatsApp verde-escuro com letra branca e texto comercial | ⬜ | Hoje é verde WhatsApp brilhante `#25d366` + texto branco (`.btn-wa`, design-system.css:40; `.wa-f` :339), não verde-escuro. O verde-escuro existe como `.btn-deep` (usado no "Orçamento"). O flutuante é só ícone, sem texto comercial |

## Front 6 — Tracking e CRM (FB-7)

| # | Item | Status | Onde está / próximo passo |
|---|------|--------|---------------------------|
| 18 | UTM em campanhas/banners/origens + orçamento/opt-in/forms num fluxo único no admin | ⬜ | Forms ainda não enviam pra lugar nenhum (captura só no localStorage). Falta UTM + lead scoring + o fluxo de leads. Spec em sprint-03/S03-10 e S03-06. FB-7 |
| 21 | Integração com o CRM via formulário nativo | ⬜ | Não feito. Destino = Leads2b (docs/integracao-leads2b.md). Depende do 18 |

## Front 7 — UX e copy

| # | Item | Status | Onde está / próximo passo |
|---|------|--------|---------------------------|
| 10 | Trocar "ver catálogo" por "ver todos os produtos" | ⬜ | Hoje "Ver catálogo" (page.tsx:174, quem-somos:81) e "Ver catálogo completo" (home-joy.ts:41, campanha/[slug]:153). O menu já usa "Todos os produtos" (Header.tsx:17). Falta trocar as CTAs. Mudança pequena |
| 11 | Botão fixo no menu superior pro catálogo em flipbook, com compartilhar (sem PDF) | ⬜ | Flipbook é placeholder. FB6-6.3 |
| 15 | CTAs focadas em orçamento ("adicione ao orçamento"), sem "comprar"/"carrinho" | ✅ | CTAs são "Adicionar ao orçamento" (ProdutoView.tsx:300,352) e "Orçamento" (Header.tsx:139); nenhum "comprar"; "carrinho" só em nome interno de código, nunca na UI. Obs: o pedido cita "cote aqui" também; hoje o CTA é "Adicionar ao orçamento" (ajuste de copy se o Fábio quiser a frase exata) |
| 19 | Tirar o celular pessoal do Plínio do topo/rodapé, pôr a central (3024-8080) + WhatsApp oficial | ⬜ | Hoje config tem (71) 99416-0138; "3024-8080" não aparece em lugar nenhum. AGORA é editável no admin (Configurações do site): trocar `telefone` e `whatsapp`. Confirmar os números certos com o cliente |

## Front 8 — Operacional (não-dev)

| # | Item | Status | Onde está / próximo passo |
|---|------|--------|---------------------------|
| 22 | Enviar a lista dos 9 produtos que faltam taguear (155 já tagueados) | ⬜ | Operacional, sem prazo. Levantar os 9 e mandar |

---

## Bloqueios externos (dependem do cliente/Plínio)
- Valor do limite de tamanho de upload (item 2) e se libera PDF de catálogo.
- URLs reais das redes sociais, endereço completo, horário, mapa (front 1).
- Números certos de telefone/WhatsApp (item 19): central 3024-8080 + WhatsApp oficial.
- PDFs reais do catálogo (item 11) e os 15 ícones de categoria como arquivo (FB6-3.4).
- Dados das 12 campanhas e dos banners do hero (item 1/7).

## Ganhos rápidos (dá pra fechar já, pouco esforço)
- Item 10: trocar "Ver catálogo" por "Ver todos os produtos" (copy).
- Item 16: cor do botão WhatsApp pra verde-escuro (CSS) + texto comercial.
- Item 19: trocar os números no admin (Configurações do site), assim que confirmados.
- Item 14: trocar o ícone do botão de vídeo pra câmera e mover pra junto da qtd mínima.
