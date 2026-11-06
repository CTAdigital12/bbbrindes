# FB-6: admin conforme mock da Joy, primeira etapa

Estado em 06/11/2026 16:59 BRT. Aceite visual recebido do Fabio: "ta aprovado".
Branch `feature/admin-mockup-fiel`, base `origin/master` 247657e.

Referencia: `C:\Users\raizh\Downloads\BB-Brindes_Admin-Mockup (2).html`.
Estilos, icones e logo extraidos desse arquivo; nenhuma imagem nova foi criada.

## Escopo implementado

* Barra superior e menu agrupado conforme mock, com permissoes do Payload.
* Painel: atalhos, alertas e destaques com dados reais. Atualizacoes usam datas reais,
  sem atribuir autores inexistentes. Certificacoes contam os registros, pois o schema
  atual nao tem imagem de selo para cada certificacao.
* Produtos: lista com miniaturas, busca, categorias, filtros de publicacao e fotos,
  paginacao, duplicacao e publicar/despublicar.
* Editor: sete abas, fotos, biblioteca, upload de imagens ate 15 MB, reordenacao,
  cores com imagens, categorias, selos, especificacoes, SEO, dados comerciais e canais.
  Slug automatico permanece travado; preco/estoque do CRM permanecem somente leitura.
* Salvamento parcial preserva grupos, ids de linhas e relacoes existentes. Erro de API
  nao exibe sucesso nem descarta a edicao. Duplicacao exige novo codigo comercial.
* O site passa a respeitar `canais.site`: catalogo, PDP, listas e sitemap. Resposta vazia
  ou produto despublicado nao recupera o mock. Fallback preexistente para falha de API
  permanece. Campanhas resolvem seus produtos a partir da mesma lista publicada.

## Limites desta etapa

Demais areas mantem as telas nativas do Payload com o novo menu/barra; a previa local
mostra aviso de proxima etapa para esses links. Depoimentos, Logos, Institucional,
Catalogo digital, Tags e Revendedores continuam acessiveis em Outras areas.
Nao foram criados roles novos, agendamento, lixeira nem versionamento de rascunhos.
Salvar sem publicar altera o campo existente `canais.site`; nao cria uma versao separada.
A descricao usa edicao em texto simples, convertida para Lexical. O valor rico original
fica intacto quando esse campo nao e alterado. A previa de produto mostra a composicao
do cadastro e nao substitui uma renderizacao final da pagina publica.

## Previa local para Fabio

`http://localhost:3044/admin`
`http://localhost:3044/admin/collections/produtos`

Executa os mesmos componentes React do admin, com adaptadores de navegacao e um
servidor isolado em `backend/preview`. Somente GETs publicos sao enviados a producao.
Uploads, salvar, duplicar e publicacao ficam na memoria desse servidor local. Reiniciar
apaga os testes. A previa nao cria sessao autenticada nem comprova o save real do Payload.
O backend integrado exige login, usa Local API com `overrideAccess:false` e a API REST
com cookies da sessao. Conferencia autenticada manual ainda pendente.

Para abrir novamente no PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\backend'
node 'C:\Users\raizh\Documents\raizhe\bbbrindes-admin-mockup\backend\preview\server.cjs'
```

A previa compila ao iniciar; reiniciar depois de alterar componentes. Dependencias do
worktree atual usam junctions para a instalacao existente. Nenhuma dependencia adicionada.

## Verificacao

54 testes aprovados: 12 do admin e 42 do site. Testes cobrem mudancas parciais, relacoes,
duplicacao, validacao, falha de API, limite/tipo do upload e bloqueio das telas sem login.
Lint e TypeScript aprovados; funcoes novas verificadas com complexidade maxima 10.
Builds do Payload e do site aprovados. Build adicional com catalogo vazio aprovado,
sem recuperar produtos antigos. O parametro tecnico nao linkado gera somente a resposta
404 de produto quando nao ha slugs para o export estatico do Next.
Chrome: painel, lista, busca, paginacao, filtro sem foto, sete abas, salvar, erro de save,
nao publicar, duplicar com codigo obrigatorio, biblioteca, upload local, reordenacao,
Escape em modal e menu movel. Alteracoes dos testes locais reiniciadas antes da revisao.
ImportMap regenerado com S3 via Railway; `S3ClientUploadHandler` preservado.
Arquivos novos abaixo de 400 linhas. `docs/REGISTRO.md` e historico cumulativo;
`frontend/src/app/produto/[slug]/page.tsx` e arquivo existente extenso e recebe apenas
tratamento localizado do caso sem produtos, preservando a pagina atual.

Aceite visual recebido em 06/11/2026, registrado as 16:59 BRT. Regra 27 atendida.
Fabio apontou tambem o endereco do produto: o texto do editor exibia o dominio antigo.
Conferido por HTTP: dominio antigo /produto/copo-mug-550ml-ecologico-colors retorna 404;
novo site no GitHub Pages retorna 200 com o produto correto. Editor corrigido para
exibir um link clicavel usando a mesma origem de Ver site e Ver no site. Produtos
nao publicados mostram o endereco previsto sem link. Nenhuma mudanca de dominio/DNS.
Publicacao da etapa aprovada autorizada: commit, push como Fabio-raizhe, PR, merge
apos checks e deploy do backend. Sem schema, seed ou alteracao de cadastro.
