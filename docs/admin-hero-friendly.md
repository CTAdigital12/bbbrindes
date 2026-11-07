# Banners do hero: estado da implementação

Atualizado em 07/11/2026, conferência às 12:58 BRT. Fabio pediu continuidade no Claude.

## Repositório e escopo

Repo CTAdigital12/bbbrindes, FB-6, épico eKyte 10941087.
Worktree: C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup.
Branch existente: feature/admin-hero-friendly, HEAD/origin/master bc442a1861a629c4ba4b538b78dd69594a2d2146.
Pedido autorizado: adaptar Banners do hero ao mock da Joy. Fabio fará a validação.

## Somente iniciado, ainda não integrado

Não houve commit, push, PR, deploy ou checks de Banners. Os 67 testes verdes anteriores pertencem ao PR #125.

Alteração tracked: backend/src/admin/friendly/model.ts permite mes/ativo nulos no tipo Banner.
Seis arquivos novos e untracked em backend/src/admin/hero:
* hero-model.ts: tipos, meses e rota.
* hero-data.ts: novo/cópia inativos, PATCH parcial e validações.
* HeroIcon.tsx: SVGs existentes.
* HeroList.tsx: busca, filtros, toggle e ações.
* HeroListRow.tsx: miniatura, ordem, mês, mobile e status.
* HeroPreview.tsx: prévia desktop/mobile e fallback existente.

Preservar os esboços. Git diff não mostra o conteúdo dos untracked.
Faltam editor/imagens, SCSS, views privadas, drawers nativos, registro na collection, CRUD em memória na prévia, importMap e testes. Revisar os arquivos antes de assumir que funcionam.

## Comportamento real a preservar

Collection hero-slides, em backend/src/collections/HeroSlides.ts. Não usar a antiga banners.
Campos: nome, tipo, mes, ordem, ativo, theme, tag, icone, tituloAntes, tituloDestaque, tituloDepois, sub, ctaLabel, ctaHref, imagemDesktop e imagemMobile.
Nome/tag obrigatórios; mensal/fixo; mês 1 a 12; temas dark/cream.
O mês é prioridade, não exclusividade: mês corrente, fixos por ordem, demais mensais por mês/ordem.
Não há datas de início/fim ou posição lateral no schema. Preservar os banners laterais do site.
Desktop recomendado 1656x480; mobile 716x480; upload até 15 MB.
Sem mobile usa desktop; sem ambas usa a arte padrão existente da fábrica. Não atribuir imagens automaticamente.
Reutilizar MediaPicker/uploadImage/requestJSON/RequestError e PATCH parcial.

## Bug pendente no frontend

getHeroSlides, em frontend/src/lib/content.ts, retorna orderedHeroSlides(monthIdx) quando ativos.length === 0.
Uma resposta real vazia ou com todos inativos ressuscita exemplos. Ainda NÃO corrigido.
Tratar esse caso com fixtures locais. HeroSlider.tsx precisa suportar slides=[] sem módulo por zero ou caixa vazia, mantendo hooks e laterais.
Falha de rede e resposta intencionalmente vazia são casos diferentes. Não testar desligando a produção.

## Produção e prévias

PRs #119 a #125 mergeados. Railway 9975b15e-343c-4b5e-8763-519e1b0b6110 SUCCESS; Actions 42294926756 SUCCESS.
APIs 200: 156 produtos, 14 categorias, 13 campanhas, 14 hero-slides e 1218 mídias. Contagens são fotografia, não alvo de restauração.
Admin: https://heartfelt-courtesy-production-3747.up.railway.app/admin
Site: https://ctadigital12.github.io/bbbrindes/
bbbrindes.com.br permanece no WordPress antigo. Não alterar DNS.

Portas 3001/3042/3044/3047 conferidas. Não parar 3001/3042.
3044: prévia React, gravações somente em memória, CSS REAL do Payload, sem HMR. Banners ainda é placeholder.
3047: export local do frontend/404.
railway run npm run dev usa banco REAL. Não salvar testes.
node_modules são junctions; não apagar/reinstalar sem avaliar outros worktrees.
Preservar backend/pnpm-lock.yaml e gerar importMap com ambiente S3, mantendo S3ClientUploadHandler.

## Próximos passos e limites

Concluir lista/editor, integrar prévia em memória, corrigir fonte vazia, testar e abrir para Fabio validar.
Aceites anteriores de Produtos/404 não autorizam publicar Banners. Regra 27 exige aceite específico.
Não gerar artes: Joy fornece. Não rodar seed/migração/reset ou apagar cadastros reais.
Não houve teste autenticado pelo agente; não alegar o contrário.

Mock: C:\Users\raizh\Downloads\BB-Brindes_Admin-Mockup (2).html, V.banners/V.banner.
Prompt completo: HANDOFF-CLAUDE-ADMIN-HERO-2026-11-07.md.
