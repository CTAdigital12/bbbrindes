# Prompt para o Claude continuar o admin BB Brindes

Continue o BACKEND/admin do site BB Brindes, repo CTAdigital12/bbbrindes, frente FB-6, épico eKyte 10941087. Eu sou Fabio e farei a validação visual.
Última frente autorizada: "bora baners do hero". Este handoff registra o estado de 07/11/2026, conferido às 12:58 BRT.

## 1. Leia estas fontes antes de agir

Worktree com o trabalho atual:
C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup

Leia CLAUDE.md e:
* docs/admin-hero-friendly.md
* docs/admin-mockup-fiel.md
* docs/produtos-mensagens-publicacao.md
* docs/backend-deploy-lockfile.md
* O fim de docs/REGISTRO.md.

Memória persistente:
C:\Users\raizh\.claude\projects\c--Users-raizh-Documents-raizhe-bbbrindes\memory

Leia MEMORY.md e admin-hero-friendly.md primeiro. Para contexto histórico, leia admin-reskin-friendly.md, incluindo o bloco ESTADO 06/11 no fim e os fechamentos posteriores; epic-plinio-final-backend.md; fb6-admin-editavel-inventario.md; front-admin-conectividade.md. Este estado mais recente prevalece sobre notas antigas.

Mock real da Joy:
C:\Users\raizh\Downloads\BB-Brindes_Admin-Mockup (2).html

Leia especialmente V.banners, V.banner, bannerStatus e sitePreview. O mock é referência visual; seus dados e controles demonstrativos não comprovam funcionalidades existentes no backend.

## 2. Preferências e limites do usuário

* NÃO gerar imagens ou artes. Joy cria e fornece. Se faltar arte, registrar a pendência e localizar com ela. Reutilizar SVGs existentes é permitido. Não substituir ou apagar imagens automaticamente. O usuário rejeitou expressamente a geração anterior de arte para Ano Novo.
* Fabio valida as telas. Joy fornece o design e as artes. Não transferir a validação para ela.
* Plínio pode estar testando em produção. Preservar cadastros, conexões, imagens e outros módulos. Não rodar seed, reset, limpeza, migração ou alterar PAYLOAD_DB_PUSH nesta frente.
* Testes de gravação devem usar a prévia em memória, nunca registros reais de produção. Não apagar produtos de teste criados por Fabio/Plínio.
* Nenhuma mensagem externa à equipe foi autorizada.
* Português claro, sem travessão ou emojis. Listas com asteriscos ou números. Etapas de terminal em blocos PowerShell prontos para colar, com caminho absoluto.
* Fluxo por branch, PR e merge. Não commitar direto em master, usar force-push, reset hard, git clean ou descartar trabalho pendente.
* Conta de push/merge: Fabio-raizhe. Autor: fabio / fabio.ferreira@raizhe.com.br. Conferir antes de publicar.
* Trailer solicitado nos commits: Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>.
* A regra 27 do CLAUDE.md exige aceite visual explícito de Fabio antes de push/PR. Primeiro concluir, testar e disponibilizar a prévia. Os aceites de Produtos e da página 404 NÃO cobrem Banners.
* Não pedir novamente autorização para trabalho local reversível já solicitado.
* Respeitar complexidade máxima 10 para código novo e limite de 400 linhas por arquivo, dividindo ou justificando exceções. Executar os checks pertinentes e atualizar REGISTRO/memória em BRT.

## 3. O que já foi publicado neste chat

PR #119: tornou durável o reskin do admin. Branding verde, sidebar escura, logo, ícone B único sem corte, nome amigável e atalho que abre a lista de produtos sem foto já filtrada.

PR #120: cadastrou 13 campanhas e integrou menu, home e páginas de campanha. Campanhas representam datas/ações e seus produtos; Banners do hero são os slides do destaque da home. Tags são editoriais de blog/cases/imprensa. Green é categoria/linha, não uma Tag que deva ser criada só para preencher a coleção.
A etapa antiga incluiu uma arte de Ano Novo não solicitada. O usuário proibiu repetir isso. Não desfazer ou remover conteúdos automaticamente.

PR #121, commit 0976603: aproximou o admin do mock da Joy, com menu, barra superior, dashboard e Produtos. Lista com miniaturas, busca, filtros e paginação; editor com sete abas, fotos, cores, categorias, selos, ficha técnica, SEO e comercial.
As gravações usam PATCH parcial, preservando outros campos e IDs de grupos/arrays/relações. Slug protegido contra mudanças acidentais, upload de até 15 MB, preço/estoque do CRM somente para leitura. O site respeita canais.site em catálogo, PDP, slugs e sitemap.
O endereço do produto passou a apontar para o GitHub Pages. bbbrindes.com.br continua no WordPress antigo; não houve autorização para mudar DNS.

PR #122, commit 16cb1b6: preservou as views nativas em drawers de relacionamento. NativeProductViews.tsx usa os contextos de list/document drawer; native-product-props.ts filtra props para o cliente. Não serializar req, payload ou user. Reutilizar essa compatibilidade ao integrar Banners.

PR #123, commit 3856704: adicionou backend/pnpm-lock.yaml para o deploy backend --path-as-root. Dois builds anteriores falharam ao resolver versões transitivas novas da AWS. O lockfile deriva do principal, sem alterar resoluções, e foi validado com instalação congelada e build. Não remover. Justificativa em docs/backend-deploy-lockfile.md.

PR #124, commit 3f07a75: corrigiu a coluna direita de Novo produto. A classe genérica .card colidia com flex/padding do Payload; os cartões customizados usam bb-card. Foram corrigidas margens de botões e responsividade. A prévia passou a carregar o CSS REAL do Payload para reproduzir essas colisões.

PR #125, commit dee60d8: mensagens amigáveis de validação e publicação:
* Nome de cor obrigatório em português, identificando a linha e abrindo a aba Cores com foco/destaque.
* Tratamento de erros estruturados da API e código duplicado, preservando os valores digitados.
* Código do produto é alfanumérico, por exemplo 137GC e 233CL; não restringir a números.
* Aviso de que o site pode levar alguns minutos para refletir a publicação, pois depende do rebuild. Salvar sem publicar tem mensagem própria.
* Página 404 com identidade do site, tentar novamente mantendo o endereço original, catálogo e início, status HTTP 404 e noindex. O texto é condicional: nem toda URL ausente significa publicação em andamento.
Fabio aprovou as telas e autorizou a publicação desses lotes. No PR #125 passaram 67 testes (25 admin + 42 frontend), lint, tipos, builds e verificações no navegador. Isso NÃO valida os novos arquivos de Banners.

O #107 de Depoimentos/Linha do tempo já estava concluído e seedado antes. Não repetir a carga.

## 4. Estado conferido de produção e Git

PRs #119 a #125 mergeados. HEAD e origin/master:
bc442a1861a629c4ba4b538b78dd69594a2d2146

Último Railway: 9975b15e-343c-4b5e-8763-519e1b0b6110, SUCCESS.
GitHub Actions: 42294926756, SUCCESS.
APIs HTTP 200: 156 produtos, 14 categorias, 13 campanhas, 14 hero-slides e 1218 mídias.
Essas contagens são uma fotografia, não uma meta de restauração. Os usuários podem criar mais registros.

Admin: https://heartfelt-courtesy-production-3747.up.railway.app/admin
Site: https://ctadigital12.github.io/bbbrindes/

Não havia sessão autenticada disponível ao agente. Não alegar conferência logada nem forjar JWT; Fabio/Plínio validam essa parte.

Branch atual EXISTENTE: feature/admin-hero-friendly, baseada em bc442a1.
Não existe commit, push, PR ou deploy de Banners. Preserve o trabalho pendente.

```powershell
Set-Location -LiteralPath 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup'
git status --short
git branch --show-current
git fetch origin
git log --oneline -5
git log --oneline HEAD..origin/master
Get-ChildItem -LiteralPath 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\backend\src\admin\hero'
```

Se master avançou, preservar os arquivos e integrar com cuidado. Não recriar a branch ou descartar untracked.

## 5. Banners: implementação somente iniciada

Existem seis arquivos NOVOS E UNTRACKED em backend/src/admin/hero:
* hero-model.ts: tipos HeroDraft/HeroBanner, meses e rota.
* hero-data.ts: novo/cópia inativos, PATCH do diff, IDs de mídia e validações.
* HeroIcon.tsx: SVGs reutilizados do site.
* HeroList.tsx: busca, filtros, toggle e ações de editar/duplicar/visualizar.
* HeroListRow.tsx: miniatura, ordem, mês, mobile e status.
* HeroPreview.tsx: prévia desktop/mobile, modal e fallback de imagem existente.

Alteração tracked em backend/src/admin/friendly/model.ts: tipo Banner aceita mes/ativo nulos, conforme os registros reais.

Ainda NÃO existem editor/formulário, campos de imagem integrados, SCSS específico, views de servidor, registro na collection, rotas/CRUD de hero na prévia, importMap atualizado ou testes desta frente. O frontend também não recebeu a correção de fallback descrita abaixo.
Revisar os esboços: tipos, complexidade, normalização de links/espaços, erros e permissões. Não foram executados lint, typecheck, build ou validação visual desses arquivos. Git diff não inclui o conteúdo dos untracked.

## 6. Schema e comportamento reais do hero

Collection correta: hero-slides, em backend/src/collections/HeroSlides.ts. Não confundir com a collection antiga banners.
Campos existentes: nome, tipo, mes, ordem, ativo, theme, tag, icone, tituloAntes, tituloDestaque, tituloDepois, sub, ctaLabel, ctaHref, imagemDesktop, imagemMobile.
Nome e tag obrigatórios; tipo mensal/fixo; mês 1 a 12; tema dark/cream.

Há 12 mensais e dois fixos. O mês define PRIORIDADE, não período exclusivo. O site ordena os mensais do mês corrente, os fixos por ordem e os demais mensais por mês/ordem. Todos os meses ativos continuam na sequência.
Não há início/fim, agendamento por data, status encerrado ou posição lateral no schema. Não mostrar controles fictícios do mock como recursos funcionais.
O escopo é o carrossel principal; preservar os dois banners laterais de frontend/src/app/page.tsx.

Recomendações: desktop 1656x480, mobile 716x480, upload até 15 MB.
Sem mobile, usa desktop; sem ambas, usa a arte padrão existente da fábrica. Explicar isso na prévia sem atribuir ou subir imagem automaticamente.
Preservar as três partes do título e os campos avançados com PATCH parcial. Reutilizar MediaPicker, uploadImage, requestJSON e RequestError.

## 7. Bug identificado, ainda NÃO corrigido

Em frontend/src/lib/content.ts, getHeroSlides contém:
if (ativos.length === 0) return orderedHeroSlides(monthIdx);

Uma resposta real vazia ou com TODOS os banners inativos ressuscita exemplos. Corrigir para respeitar o painel, usando fixtures locais, sem desligar banners de produção.
Isso é diferente da correção histórica de inativação INDIVIDUAL.

HeroSlider.tsx precisa suportar slides=[] sem setas, módulo por zero ou caixa vazia, preservando as regras dos hooks. Manter os dois banners laterais.
Falha de rede é diferente de resposta intencionalmente vazia. Documentar a decisão sobre o fallback de rede preexistente.

## 8. Próxima entrega esperada

* Concluir lista/editor conforme o mock: biblioteca/upload, imagens desktop/mobile, textos, três partes do título, tag/ícone, tema, CTA, fixo/mensal, mês, ordem e ativo, com prévia imediata.
* Implementar views privadas com autenticação, permissões e Local API usando overrideAccess:false e user. Preservar as views nativas em drawers.
* Integrar HeroSlides.admin.components.views e SCSS com classes bb-*, evitando a colisão .card.
* Estender backend/preview/app.tsx e fixture-api.cjs para hero-slides, com gravações APENAS EM MEMÓRIA. Hoje a rota é placeholder.
* Corrigir o caso vazio/todos inativos no frontend, com testes locais.
* Regenerar importMap com ambiente S3 e conferir S3ClientUploadHandler.
* Testar PATCH/IDs/remoção de associação, cópia inativa, campos inválidos, erros sem perda de valores, permissões, imagens e integração.
* Se implementar exclusão, exigir confirmação na interface e testar em memória. Não excluir banners reais para testar.
* Rodar checks e navegador desktop/tablet/mobile com CSS REAL do Payload.
* Disponibilizar a prévia para Fabio validar. Só depois do aceite específico de Banners seguir com push/PR/merge/deploy.

## 9. Ambiente e publicação

Portas conferidas: 3001, 3042, 3044 e 3047. Não parar 3001/3042. PIDs podem mudar.
3044 é a prévia React com leituras públicas e escritas em memória. Compila ao iniciar, sem HMR; reiniciar após alterações. Manter payload-styles.cjs com CSS real do Payload. Banners ainda não está integrado.
3047 é o export local do site/404. Produto criado na memória da prévia não é publicado no site.
railway run npm run dev conecta ao BANCO REAL; somente olhar, não gravar testes.
node_modules são junctions para instalações existentes; não remover ou reinstalar sem avaliar os outros worktrees.
devsafe usa rm -rf e quebra no Windows. Mudanças em graphics podem exigir reinício do dev.

Comandos de referência, ajustando os testes ao trabalho concluído:
```powershell
Set-Location -LiteralPath 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\backend'
npm run typecheck
node 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\frontend\node_modules\vitest\vitest.mjs' run --config 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\backend\vitest.admin.config.ts'
railway run npx payload generate:importmap
Select-String -LiteralPath 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\backend\src\app\(payload)\admin\importMap.js' -Pattern 'S3ClientUploadHandler'
railway run npm run build
```

Para iniciar a prévia, conferir antes se a porta já está ocupada:
```powershell
Set-Location -LiteralPath 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\backend'
node 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\backend\preview\server.cjs'
```

Depois do aceite, checks, PR e merge, publicar a árvore correspondente à master, sem incluir alterações alheias:
```powershell
Set-Location -LiteralPath 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup'
gh auth switch --hostname github.com --user Fabio-raizhe
railway up backend --path-as-root --detach
```

Manter backend/pnpm-lock.yaml. Não expor variáveis ou segredos. Aguardar Railway SUCCESS e Actions verdes, conferir APIs/login/site e documentar o resultado.

Continue dos seis arquivos pendentes. Não refazer Produtos/404 nem mexer em outras frentes. O próximo resultado é uma prévia fiel e funcional da lista/editor de Banners do hero, com testes, para Fabio validar.
