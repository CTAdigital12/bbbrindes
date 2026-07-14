# Modelo de dados do produto (validado 14/07/2026)

Fonte da verdade dos campos que o catalogo do site precisa suportar. Estrutura
validada pelo cliente (Plinio) na reuniao de 14/07/2026. Serve de especificacao para
executar quando a planilha final do Plinio fechar (esta atrasada porque ele esta
unificando os codigos site/CRM/ERP). Ate la, nao mexer no schema do Payload para
evitar retrabalho (decisao do Fabio).

Fluxo de integracao relacionado: ver docs/arquitetura-backend.md, secao "Integracao
Site x CRM x ERP". Resumo: Site -> CRM (Leads2b) -> ERP, sem integracao direta com o
ERP; preco e estoque vem do CRM.

## Campos validados

Identificacao:
1. codigoSite: codigo comercial/visual do site, ex.: "MV 01".
2. codigoCigan: codigo do integrador, o mesmo do CRM/ERP. E a chave de integracao.

Conteudo da PDP (publico):
3. nome.
4. subtitulo: reforco do nome.
5. headline: chamada do produto (junto com o nome, e a primeira chamada da PDP).
6. descricaoCurta: descricao comercial resumida, otimizada para SEO.
7. descricaoCompleta: descricao completa, otimizada para SEO.
8. beneficios: principais beneficios.
9. diferenciais: diferenciais BB brindes no produto.

SEO (busca):
10. palavraChave.
11. metaDescription.

Comercial (interno, nao exibir no site):
12. argumentoComercial: por que o produto vende. Usado no treinamento do agente de
    atendimento.

Classificacao:
13. categorias: ate 3 por produto (um produto pode pertencer a mais de uma, ex.:
    squeeze infantil + esporte). Modelagem decidida: relacao multipla, com a primeira
    como principal (URL, breadcrumb e filtro do catalogo).
14. ecologico: sim/nao (boolean).

Integracao (via CRM Leads2b, nao editar como fonte da verdade):
15. preco e estoque (produto); pedido e historico no painel de revenda.

## Delta vs o schema atual do Payload (backend/src/collections/Produtos.ts)

O S03-02 ja foi implementado antes desta reuniao; estes sao os ajustes pendentes:

1. sku (unico) -> dividir em codigoSite + codigoCigan. O atual sku equivale ao
   codigoCigan (chave de integracao).
2. Adicionar: headline, palavraChave, metaDescription, argumentoComercial (interno).
3. categoria (relacao unica, obrigatoria) -> categorias (relacao multipla, ate 3,
   primeira como principal). Impacta o filtro do catalogo no front, que hoje filtra
   uma categoria por vez.
4. tags (select com opcao "ecologico") -> ecologico (boolean sim/nao) como fonte da
   verdade. Hoje o front deriva eco de categoria/material (ehEcologico); passa a usar
   o boolean. Resolver a redundancia com o grupo de categorias "Ecologicos".
5. grupo `erp` (preco, estoque) -> reenquadrar como integracao via CRM (Leads2b), nao
   ERP direto. Segue nao editavel como fonte.
6. SEO por produto (palavraChave, metaDescription) entra aqui, no S03-02. A S03-07
   fica so com o SEO estrutural do site (sitemap, robots, JSON-LD, canonical).

Campos nossos que a reuniao nao citou mas seguem uteis: idealPara, material,
aplicacoes (sobrepoe idealPara), cores, imagens, videoUrl, faixaPreco (filtro publico
de preco, sem preco exato no B2B), destaques.

## Delta vs o template de importacao (docs/importacao-catalogo/modelo-produtos.csv)

O template atual tambem precisa reconciliar quando a planilha do cliente chegar:

1. codigo (unico) -> codigo_site + codigo_cigan.
2. categoria (unica) -> categoria_1, categoria_2, categoria_3.
3. Adicionar: headline, palavra_chave, meta_description, argumento_comercial.
4. Remover personalizavel (Plinio ja pediu tirar da PDP).
5. linha_ecologica (sim/nao) ja bate com o boolean ecologico; manter.

Acao da ata (Fabio): confirmar com o Julien se a estrutura da planilha do cliente
atende esses campos antes de reescrever o template ou o schema.

## Decisoes

1. Esperar a planilha final do Plinio (com codigos unificados) antes de mexer no
   schema do Payload e no template de importacao. Evita retrabalho.
2. Categorias: relacao multipla, primeira como principal.
3. argumentoComercial e interno (nao exibido no site).
4. SEO de produto vive no produto; SEO estrutural do site fica na S03-07.

## Pendencias e bloqueios

1. Planilha final do Plinio (codigos unificados). Bloqueia a revisao do schema.
2. Confirmar com o Julien se a planilha do cliente atende o banco.
3. API Leads2b (URL, credencial, doc) para o painel de revenda (estoque/preco/
   pedido) e para o envio de leads. Bloqueia a integracao real.
4. Descricoes SEO dos produtos (analista de conteudo).
5. PDP: simular os campos novos no wireframe da pagina de produto, a quatro maos com
   a analista de conteudo (SEO + UX). Nao lotar a pagina: usar "ver mais", background
   etc. Nome + headline como primeira chamada, depois subtitulo, descricoes,
   beneficios. Exige validacao visual no browser antes de PR.
6. UTM + tagueamento GA no site para alimentar o lead scoring no CRM.
7. Identidade visual (brandbook, paleta, fontes) segue bloqueando o design (S01-14).
