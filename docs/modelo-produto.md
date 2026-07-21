# Modelo de dados do produto

Fonte da verdade dos campos que o catalogo do site precisa suportar. Estrutura
validada pelo cliente (Plinio) na reuniao de 14/07/2026 e conferida contra a planilha
real recebida em 15/07/2026 ("Planilha de produtos e suas especificacoes _06.2026",
aba Especificacoes).

Fluxo de integracao relacionado: ver docs/arquitetura-backend.md, secao "Integracao
Site x CRM x ERP". Resumo: Site -> CRM (Leads2b) -> ERP (Cigan/CIGAM), sem integracao
direta com o ERP; preco e estoque vem do CRM.

Navegacao, datas comemorativas e LPs de campanha: ver docs/taxonomia-navegacao-seo.md.
Resumo: categoria (tipo de produto) e diferente de tag/ocasiao (data, feira,
aniversario) e de LP de campanha (pagina com slug para ranquear). Filtro por tag nao
muda o slug.

Status: o schema do Payload (S03-02) segue CONGELADO. A planilha destravou a maior
parte do modelo, mas tres pontos ainda bloqueiam: granularidade do produto (ver
secao 3), imagens e cores (ver secao 5).

## 1. A planilha real

Cerca de 190 produtos (bem abaixo dos ~1200 SKUs do escopo; ver secao 6) e 50 colunas
em quatro blocos:

1. Canais (7 colunas): SITE, BRINDICE, FREESHOP, brindes.com, CATALOGO, TABELA
   REVENDA, TABELA B2B.
2. Descricao para cadastro de produto (17 colunas): Codigo site, Codigo CIGAM, Nome
   Produto, subtitulo, Headline, Descricao Comercial resumida, Descricao comercial
   completa, principais beneficios, ideal para, diferenciais BB Brindes associados,
   palavras chave SEO, Meta description, argumento comercial, Categoria, categoria 2,
   categoria 3, Ecologico.
3. Selos/icones (13 colunas): livre de BPA, uso em microondas, uso em lava-loucas,
   produto 100% reciclado, logistica reversa, uso permanente, reducao de emissao de
   CO2, 50% fonte renovavel, design circular, upcycling, fibra natural, produto
   reciclavel, reducao de plastico.
4. Informacoes logisticas (8 colunas): NCM, dimensoes do produto, peso unitario,
   materia prima, modelo caixa master, quantidade por caixa, dimensoes da caixa
   master, peso da caixa master.
5. Informacoes tecnicas para impressao (5 colunas): metodos de impressao, area de
   impressao transfer, area de impressao tampografia, area de impressao serigrafia,
   sleeve.

Os blocos 3, 4 e 5 NAO foram citados na ata da reuniao. Sao 26 colunas de novidade.

## 2. Correcao: os dois codigos estao invertidos na ata

A ata registrou "codigo do site (comercial/visual, ex.: MV 01)". A planilha mostra o
contrario, e o Plinio confirma na gravacao ("o codigo comercial pro cliente nao e esse
negocio MV01"):

1. `Codigo site` = 109. Comercial/visual, o que o cliente ve. Alfanumerico, aceita
   sufixo e espaco (109, 109G, 233 CL, 1085, 2003).
2. `Codigo CIGAM` = MV01109. Integrador, o que casa com CRM/ERP. E a chave de
   integracao.

O CIGAM embute o codigo do site, com um prefixo de linha de 2 digitos: MV01 + 109
(tradicional), MV02 + 109G (Green), MV10 + 2003 (In Mold Label). A unificacao que o
Plinio esta fazendo ja esta parcialmente refletida.

## 3. BLOQUEIO: site e ERP nao tem a mesma granularidade

O CIGAM descarta o sufixo de variacao do codigo do site. Consequencia direta:

1. `233 CL` (Foto Caneca refil colorido) e `233 PB` (refil preto e branco) sao dois
   produtos no site e tem o MESMO CIGAM: `MV01233`.
2. `332 PB` vira `MV01332`; `332GC CL` vira `MV02332GC`.

Como o CIGAM e a chave que traz preco e estoque do CRM, isso precisa de decisao antes
de fechar o schema e o import:

1. Opcao A: CL/PB e variacao de um unico produto (o site tem 1 produto, o ERP tem 1
   item, preco e estoque batem).
2. Opcao B: sao dois produtos no site apontando para o mesmo item do ERP (preco e
   estoque compartilhados; o CIGAM deixa de ser unico na colecao Produtos).

Enquanto isso nao fechar, `codigoCigam` nao pode ser modelado como unique.

## 4. Campos validados (o que a planilha entrega)

Identificacao:
1. codigoSite: comercial, exibido. Alfanumerico.
2. codigoCigam: integrador (chave CRM/ERP). Ver secao 3 antes de marcar como unique.

Conteudo da PDP (publico):
3. nome.
4. subtitulo: na planilha e texto LONGO (uma ou duas frases), nao frase curta.
5. headline: chamada do produto. Junto com o nome, e a primeira chamada da PDP.
6. descricaoCurta ("Descricao Comercial resumida"): um paragrafo, otimizada para SEO.
7. descricaoCompleta: multiplos paragrafos com quebra de linha. Vira richtext.
8. beneficios ("principais beneficios"): lista, uma por linha na celula.
9. idealPara ("ideal para"): lista, uma por linha na celula.
10. diferenciais ("diferenciais BB Brindes associados"): lista, uma por linha.

SEO:
11. palavrasChave ("palavras chave SEO"): LISTA separada por virgula, nao uma unica
    palavra. Modelar como lista.
12. metaDescription: texto unico.

Comercial (interno, nao exibir no site):
13. argumentoComercial: por que o produto vende. Treinamento do agente de atendimento.

Classificacao:
14. categoria, categoria2, categoria3: ate 3 por produto. Ver secao 8.
15. ecologico: sim/vazio. Preenchido "sim" so nas linhas Green. Ver secao 9.

Selos (13 booleanos, marcados com "OK"): ver secao 1, bloco 3.

Logistica: NCM, dimensoes, peso unitario, materia prima, modelo/quantidade/dimensoes/
peso da caixa master.

Impressao: metodos e areas (transfer, tampografia, serigrafia, sleeve).

Integracao (nao vem da planilha, vem do CRM Leads2b): preco e estoque.

## 5. BLOQUEIO: o que a planilha NAO tem

Nenhum destes foi citado na ata e nenhum existe na planilha:

1. Imagens. Nao ha coluna de imagem, nome de arquivo ou link. Sem convencao de nome
   casando com o codigo, nao ha catalogo nem PDP.
2. Cores e variacoes. Nao ha coluna de cor. O wireframe da PDP troca a imagem ao
   trocar a cor e o catalogo lista as cores. E a lacuna mais seria.
3. Video. O Plinio pediu video na PDP e nao ha coluna.

Atualizacao 21/07/2026 (reuniao Plinio/Julien): o MODELO de imagem e de variacao ficou
definido, mesmo sem os arquivos e a planilha de cor terem chegado. O Plinio vai subir os
produtos com variacoes depois, direto no banco. Regras validadas:

1. Imagens por produto: a imagem 1 e a que muda ao trocar a cor (foto do produto na
   cor); a imagem 2 e ambientada (lifestyle), fixa. O schema precisa de imagem por cor
   (item 1 abaixo) mais um slot de imagem ambientada.
2. SKU por cor: hoje o cadastro e por produto; vai evoluir para SKU por cor, com
   codificacao base + variacao numerica de tom (codigo base do produto + sufixo de
   tom). E a fonte de cor que faltava na secao 6 e no bloqueio de cores.

Continua faltando: os arquivos de imagem, a convencao de nome casando com o codigo, e a
planilha/coluna onde as cores e os tons vivem. O modelo esta definido; o dado, nao.

## 6. Produto nao e SKU: a conta dos 1200

A planilha tem menos de 200 produtos e o escopo sempre falou em ~1200 SKUs. Leitura
provavel: ~190 produtos x cores por produto da a ordem de 1200. A reuniao de 21/07
confirma a direcao: a evolucao e para SKU por cor (codigo base + variacao numerica de
tom; ver secao 5). O import gera as variacoes a partir dessa fonte de cor, que o Plinio
vai subir depois no banco. Segue pendente o dado de cor em si.

## 7. As 7 flags de canal mudam o modelo

A planilha e o mestre de varios canais, nao so do nosso site:

1. O site deve importar apenas linhas com SITE preenchido. As flags TABELA REVENDA e
   TABELA B2B controlam onde o produto aparece (area do revendedor x B2B). Isso nao
   estava no modelo e provavelmente vira campo/visibilidade na colecao Produtos.
2. A coluna SITE nao e um sim/nao limpo. Ela mistura `ok`, `ok (370 ml)`, `ok (475ml)`,
   `S/COD` e `COD. 280` (referencia cruzada a outro codigo). Do jeito que esta, nao
   serve como flag automatica; exige limpeza ou regra de parsing.
3. As notas dentro da coluna SITE apontam divergencia de volume entre o nome e a
   realidade: produto 135 "Copo Roma Cristal 400mL" com `ok (370 ml)`; 406 "Super Bowl
   500mL" com `ok (475ml)`; 134G "Copo Roma Ecologico 380ml" com `ok (360 ml)`. Isso
   vai para o titulo da pagina e para o SEO; precisa de definicao de qual vale.

## 8. Categoria 1 mistura linha e funcao

Nos produtos tradicionais, `Categoria` e a funcao (Squeezes, Copos). Nos Green e IML,
`Categoria` e a LINHA e a funcao cai para `categoria 2`:

1. Squeeze 300 ml Green Fibras = Green Fibras / Squeezes / Infantil.
2. Balde IML = In mold label / Bowls, baldes e potes.

Se a navegacao usar so a categoria 1, esse squeeze nao aparece em Squeezes. Isso
confirma a necessidade das 3 categorias e exige definir qual e a principal (URL e
breadcrumb). Modelagem decidida: relacao multipla, com a primeira como principal.

As categorias da planilha batem com as 15 validadas (com variacao de acento e caixa,
que exige mapa de nomes): Squeezes, Copos, Canecas e xicaras, Chaveiros, Casa e
decoracao, Medalhas e trofeus, Escritorio, Bowls baldes e potes, To Go / Viagem,
Infantil, Cordoes e costurados, In mold label, Green Plasticaria, Green Fibras.

## 9. Medalhas e Trofeus NAO e linha ecologica

Pendencia aberta desde 30/06/2026 (o wireframe agrupou "Medalhas e Trofeus" na familia
Ecologicos e ficou "a confirmar"). A planilha responde: `Ecologico = sim` aparece so
nas linhas Green; Medalhas e trofeus aparece como categoria de FUNCAO (categoria 2)
dos itens Green Plasticaria. Ou seja, uma medalha so e ecologica se for da linha
Green. Acao: desfazer o agrupamento no wireframe, salvo objecao do Plinio.

Efeito colateral: a regra `ehEcologico` do front (frontend/src/data/produtos.ts), que
deriva eco de categoria/material e inclui medalhas-trofeus, esta errada. O eco passa a
vir do campo booleano da planilha.

## 10. Qualidade de dado que limita o import automatico

1. Peso unitario sem padrao: `33gr`, `44g`, `3,5`, `150`, `115 g`.
2. Dimensoes em texto livre e formatos muito diferentes, incluindo `N/A` e casos com
   duas pecas ("XICARA: ... PIRES: ...").
3. Categorias com variacao de acento e caixa em relacao as 15 validadas.
4. Varias linhas sem NCM, dimensoes, peso e areas de impressao.
5. Conteudo divergente do nome: o 125 se chama "Squeeze Wave" e as descricoes falam em
   "Squeeze Portatil 250 mL".
6. `S/COD` na coluna SITE em produtos sob projeto (817 Trofeu Formato Especial, 818
   Pingente Formato Especial).

Nada disso e impeditivo, mas define quanto do import e automatico e quanto e limpeza
manual.

## 11. Delta vs o schema atual do Payload (backend/src/collections/Produtos.ts)

O S03-02 foi implementado antes da reuniao. Ajustes pendentes:

1. `sku` (unico) -> `codigoSite` + `codigoCigam`. Ver secao 3 antes de marcar unique.
2. Adicionar: headline, palavrasChave (lista), metaDescription, argumentoComercial
   (interno).
3. `subtitulo` de `text` para `textarea` (na planilha e texto longo).
4. `categoria` (relacao unica) -> `categorias` (relacao multipla, ate 3, primeira como
   principal). Impacta o filtro do catalogo, que hoje filtra uma categoria por vez.
5. `tags` (select com "ecologico") -> `ecologico` (boolean) como fonte da verdade.
6. Adicionar os 13 selos (booleanos) e definir como aparecem na PDP e no filtro.
7. Adicionar o bloco de logistica e o de impressao, definindo o que e publico, o que e
   so revendedor/B2B e o que nao vai para o site.
8. Adicionar as flags de canal (site, tabela revenda, tabela B2B) como visibilidade.
9. Grupo `erp` (preco, estoque) -> reenquadrar como integracao via CRM (Leads2b).
10. SEO por produto entra aqui, no S03-02. A S03-07 fica so com o SEO estrutural do
    site (sitemap, robots, JSON-LD, canonical).
11. Adicionar `ocasioes` (relacao multipla de tags: datas comemorativas, feiras,
    aniversario de empresa), distinta de `categorias`. Ver docs/taxonomia-navegacao-seo.md.
12. Imagem por cor (variacao) mais um slot de imagem ambientada; SKU por cor com codigo
    base + sufixo de tom. Ver secao 5.

## 12. Delta vs o template de importacao (docs/importacao-catalogo)

O template (modelo-produtos.csv + GUIA-PLINIO.md) foi feito antes e esta SUPERADO pela
planilha do cliente. A planilha do cliente e a fonte; o template so serviria se
tivessemos que pedir o material do zero. Divergencias: codigo unico x dois codigos,
categoria unica x tres, falta headline/SEO/argumento comercial/selos/logistica/
impressao, e o template tem `personalizavel` (que o Plinio pediu para tirar).

Decisao pendente: descontinuar o template ou reescreve-lo como espelho da planilha do
cliente. Acao da ata (Fabio): confirmar com o Julien se a planilha atende o banco.

## 13. Decisoes tomadas

1. Categorias: relacao multipla, primeira como principal.
2. argumentoComercial e interno (nao exibido no site).
3. SEO de produto vive no produto; SEO estrutural do site fica na S03-07.
4. Nao mexer no schema ate resolver granularidade, imagens e cores.
5. "Cigan" da ata e o CIGAM da planilha. Assumido como o ERP ate confirmacao; nome
   mantido como esta nas docs.

## 14. Pendencias e bloqueios

Bloqueiam o schema e o import:
1. Granularidade CL/PB: variacao de um produto ou dois produtos com o mesmo CIGAM.
2. Imagens: como chegam e qual a convencao de nome casando com o codigo.
3. Cores e variacoes: em qual planilha ou coluna vivem.
4. Confirmar que os ~1200 sao produto x cor.
5. Confirmar se a planilha 06.2026 e o catalogo completo ou um recorte.

Bloqueiam a PDP (S03-11):
6. Definir o que e publico dos blocos de logistica, impressao e selos.
7. Divergencia de volume entre nome e nota (Copo Roma Cristal 400 x 370, Super Bowl
   500 x 475).
8. Layout a quatro maos com a analista de conteudo (SEO + UX), sem lotar a pagina.

Bloqueiam a integracao (S03-09):
9. API Leads2b: URL, credencial e doc. Falta a pauta com o Leonardo para a ponte
   CRM-ERP.

Outros:
10. Descricoes SEO pendentes (analista de conteudo).
11. Identidade visual (brandbook, paleta, fontes) segue bloqueando o design (S01-14).
