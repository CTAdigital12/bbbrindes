# Mensagens de validacao e publicacao de Produtos

Estado06/11/2026 18:09BRT. Branchfix/admin-product-validation, baseorigin/master3b13af0.
Fabio aprovou o fluxo Novo produto e pediu corrigir a mensagem "Cores1 > Nome".
Depois confirmou que outro produto apareceu apos o rebuild e pediu substituir a
404 preta por orientacao amigavel. Novos modulos do mock foram adiados para este foco.

## Implementado localmente

* Cor sem nome e identificada antes do envio. Mensagem em portugues informa o numero
  da cor e orienta preencher ou remover a linha. AbaCores abre e campo recebe foco,
  contorno e atributos de acessibilidade. Dados digitados ficam preservados.
* RequestError conserva campos estruturados do Payload; ProductEditor trata a mesma
  falha vinda do servidor e orienta codigo duplicado. Mensagens claras preexistentes
  continuam preservadas. Nao houve mudanca de schema ou contratos REST.
* O admin avisa junto ao link que a pagina pode demorar alguns minutos apos salvar.
  Salvar sem publicar tem confirmacao propria, sem sugerir que a pagina sera publicada.
* not-found.tsx substitui a tela generica por mensagem da BB Brindes, usando somente
  identidade e icone existentes. Explica CONDICIONALMENTE a espera por cadastro recente;
  nao garante que todo404 represente atualizacao em curso. Inclui Tentar novamente,
  Ver catalogo e inicio. Mantem status404,noindex,cabecalho e rodape.

## Validacao

25testesadmin e42front aprovados. Lint,TypeScript e builds completos aprovados.
Chromeadmin: corvazia bloqueiaPOST, abreCores/foco, destaque requerido, resposta real
Payload simulada traduzida sem perda, salvamento local apos correcao, aviso persistente
e salvar sem publicar. Escritas do teste SOMENTE na memoria da previa3044.
Chrome404:6casos em1440/768/390px, light/dark;404e noindex corretos,semoverflow,
sem tela preta, retry mantemURL original, links respeitam /bbbrindes, produtoexistente200.

Previaadmin:http://localhost:3044/admin/collections/produtos/create
Previa404:http://localhost:3047/bbbrindes/produto/aguardando-publicacao/
Servidor3047 e temporario, somenteGET/HEAD, servefrontend/outcom404.html para ausentes.
Nao parar servidores preexistentes3001/3042. Nenhum dado ou imagem de producao alterado.
Aceite visual recebido do Fabio em06/11/2026, registrado18:12BRT: "Aprovado, pode publicar". Regra27 atendida.

Referencias oficiais: [Next not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found),
[export estatico](https://nextjs.org/docs/app/guides/static-exports) e
[GitHub Pages404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).
