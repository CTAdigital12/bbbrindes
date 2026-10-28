# FB-6: Admin 100% editável + limite de upload (plano/tracker)

Frente da reunião (27/10): deixar o site editável pelo admin do Payload (nada
hardcoded) e pôr limite de tamanho e formato no upload. Tracker vivo: marcar o
que for sendo feito. Contexto e inventário completo na memória do projeto
(`fb6-admin-editavel-inventario.md`).

## Regras
- O que mexe no front vira PR (Fábio mergeia). Schema do backend vai por deploy.
- Sempre fazer seed dos valores atuais pra não regredir o visual.
- Testar no browser antes do PR.

## Dependência de deploy do backend (IMPORTANTE)
O front é export estático: o build (CI, deploy.yml) lê o backend LIVE no Railway
(`heartfelt-courtesy-production-3747.up.railway.app`) e inlina no HTML; se o
backend não responde, cai no mock. Logo, **collection/global/campo novo só
funciona de verdade quando o backend que roda nesse Railway rodar o código
novo.** Esse Railway é do cliente/Plínio (o `railway run` do Fábio morreu).
PENDENTE confirmar com o Fábio: esse backend auto-deploya no push da master, ou
precisa deploy manual (e quem tem acesso)? Isso define como a Fase 0 chega à
produção. (Schema push: o config usa `push: PAYLOAD_DB_PUSH !== 'false'`; se o
Railway sobe com push ligado, o boot cria a tabela do global.)

## Decisões já tomadas (Fábio, 27/10)
- Formato do upload: imagens + PDF. PDF NÃO entra na Media (ela converte tudo pra
  webp); precisa collection separada de PDF.
- Tamanho do upload: PENDENTE (Fábio aguarda retorno das imagens). Lembrar: o
  `upload.limits.fileSize` do Payload é global (um nº pra todos os uploads).

## Fases e subtarefas

> ESTADO 27/10: Fase 0 + Fase 1 commitadas na branch `feature/fb6-admin-editavel`
> (da master, commit 07be720). Frontend `tsc --noEmit` EXIT 0. Validado via curl no
> dev (localhost:3010): /contato/ e / renderizam 200 com todos os valores do mock
> (telefone, email, CNPJ, endereço, horário, selos, descrição) e o link wa.me do
> config; Footer sem `href="#"` (0 links mortos). Screenshot no browser ficou
> bloqueado por ambiente (o Chrome da extensão não alcança o localhost:3010; curl
> alcança). PR ainda NÃO aberto (aguarda go do Fábio + decisão das redes).

### Fase 0 — Fundação (infra de edição)  [CÓDIGO PRONTO, falta deploy]
- [x] FB6-0.1 Global "Configurações do site" (backend/src/globals/Configuracoes.ts) + registrado em payload.config; payload-types regenerado
- [x] FB6-0.2 Loader `getConfig()` (payloadGlobal em lib/payload.ts + getConfig em lib/content.ts) + tipo SiteConfig + mock em data/config.ts. Frontend tsc limpo
- [x] FB6-0.3 Seed `seed-configuracoes.ts` (idempotente, CONF_OVERWRITE=1 força) com os valores atuais
- [ ] FB6-0.deploy Backend com o global no ar (ver dependência acima) + seed aplicado (via REST admin, já que railway run morreu)

### Fase 1 — Identidade site-wide (Header, Footer, Contato)  [CÓDIGO PRONTO, validado via curl]
- [x] FB6-1.1 Footer lê contato/redes/selos/CNPJ/blurb do global
- [x] FB6-1.2 Header (topbar) lê telefone/WhatsApp do global
- [x] FB6-1.3 Contato lê do global (telefone/email/endereço/horário/CNPJ + link wa.me)
- [x] FB6-1.4 Unificar o WhatsApp (antes repetido em vários lugares) numa fonte só
- Input externo: URLs reais das redes (hoje `#`), endereço completo, horário, mapa
- MUDANÇA VISÍVEL: com as redes vazias no mock, o Footer esconde a fileira de
  ícones sociais (antes 5 ícones apontando pra `#`, links mortos). Volta assim que
  o cliente cadastrar as URLs no admin. Decisão a confirmar com o Fábio: manter
  escondido (recomendado, sem link morto) ou voltar a mostrar os ícones com `#`.

### Fase 2 — Upload (limite de tamanho e formato)  [independente]
- [ ] FB6-2.1 Formato imagens + PDF (collection separada de PDF)
- [ ] FB6-2.2 Tamanho: `upload.limits.fileSize` + abortOnLimit + mensagem PT (valor TBD)
- [ ] FB6-2.3 Mensagem de erro amigável no admin

### Fase 3 — Ligar a home ao que já existe
- [ ] FB6-3.1 Hero da home ler a collection Banners (hoje órfã) [SEGURADO: trocaria o hero mensal rotativo por banners que o cliente ainda não cadastrou; precisa conteúdo + decisão visual]
- [ ] FB6-3.2 Banners laterais (2) -> Banners posicao=mini [junto do 3.1]
- [x] FB6-3.3 Home usar getCases/getMaterias/getPosts (parar de usar mock home-joy). As seções Cases (faixa de marca, igual à /cases), Na imprensa e Do blog agora leem o conteúdo REAL que já está no ar. Validado via curl no dev (localhost:3010 batendo no backend live): Cases = Coca-Cola/Stella Artois/Nestlé (sem chip "Ilustrativo"); Imprensa = Plástico Virtual/Folha do Norte/Site Lícia Fabio; Blog = 3 posts reais com slug certo linkando pra /blog/[slug]. Frontend puro + fallback no mock: sobe por GitHub Pages SEM depender do deploy do backend (não bloqueado pelo Railway). tsc EXIT 0, lint limpo.
- [ ] FB6-3.4 Ícone de categoria vir do campo `icone` da collection [depende do cliente preencher o campo `icone`; sem isso regride os ícones atuais do CAT_ICON]

### Fase 4 — Campanhas (overlap FB-4)
- [ ] FB6-4.1 campanha/[slug] ler a collection Campanhas (conteudo/chamada/imagem/produtos)
- [ ] FB6-4.2 generateStaticParams da collection
- [ ] FB6-4.3 Imagem de topo/tile da collection
- [ ] FB6-4.4 (FB-4) Rotação por mês data-driven

### Fase 5 — Blocos de marketing da home como CMS  [opcional, maior]
- [ ] FB6-5.1 TRUST / DIF / FAQ / QUOTES
- [ ] FB6-5.2 Blocos urgência + eco
- [ ] FB6-5.3 Marquee de logos -> collection
- [ ] FB6-5.4 CTA final

### Fase 6 — Páginas institucionais como CMS  [opcional]
- [ ] FB6-6.1 quem-somos (números/sustentabilidade/galeria/textos)
- [ ] FB6-6.2 sac (motivos/textos)
- [ ] FB6-6.3 catálogos (flipbook + PDFs; depende de 2.1)

### Fase 7 — Migração de assets estáticos  [decisão]
- [ ] Migrar pra Media só o que o cliente troca (logos, fotos, banners); ícones de UI ficam estáticos

## Corte
- "Mínimo editável" = Fases 0 + 1 + 2 + 3 (+4 se adiantar o FB-4).
- "100% editável" = + 5 + 6 + 7.

## Bloqueios externos
- Valor do limite de tamanho (aguarda imagens), URLs reais das redes, endereço/horário/mapa, PDFs reais de catálogo, 15 ícones de categoria como arquivo.
